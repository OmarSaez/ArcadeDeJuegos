// CONFIGURACIÓN
const CANVAS_W = 1280;
const CANVAS_H = 720;
const PUCK_R = 25;
const PADDLE_R = 40;
const GOAL_SIZE = 250;
const FRICTION = 0.99; // Hielo
const WALL_BOUNCE = 0.9;

// ESTADO GLOBAL
let gameState = 'MENU'; // MENU, LOBBY, PLAYING
let myNick = localStorage.getItem('hockey_nick') || `Jugador${Math.floor(Math.random() * 1000)}`;
let myTeam = 'A'; // 'A' (Left/Red) or 'B' (Right/Blue)
let myColor = '#ff4757';
let myReady = false;
let isHost = false;
let myId = null;
let peer = null;
let hostConn = null;

// CONFIGURACIÓN PARTIDA
let config = {
    maxScore: 5,
    maxRounds: 0
};

// EQUIPOS (Estado Global Explicito)
let teams = {
    A: { name: 'EQUIPO A', color: '#ff4757' },
    B: { name: 'EQUIPO B', color: '#3742fa' }
};

// ESTADO JUEGO
let scores = { A: 0, B: 0 };
let roundWins = { A: 0, B: 0 };
let currentRound = 1;
let isGameOver = false;
let clientConns = []; // Si soy host (lista de {conn, id, nick, team, color, x, y})
// Nota: Si soy Host, mi propio jugador también está en lógica, pero no en clientConns.

// OBJETOS JUEGO
const puck = { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: 0, vy: 0, color: 'white' };
const players = {}; // Diccionario id -> { x, y, nick, team, color, vx: 0, vy: 0 }

// INPUT
const mouse = { x: CANVAS_W / 2, y: CANVAS_H / 2 };
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// --- INICIALIZACIÓN ---
window.onload = () => {
    resize();
    window.addEventListener('resize', resize);
    document.getElementById('input-nick').value = myNick;

    // Mouse Move
    window.addEventListener('mousemove', e => {
        if (gameState !== 'PLAYING') return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_W / rect.width;
        const scaleY = CANVAS_H / rect.height;
        mouse.x = (e.clientX - rect.left) * scaleX;
        mouse.y = (e.clientY - rect.top) * scaleY;
    });

    // Touch support basic
    window.addEventListener('touchmove', e => {
        if (gameState !== 'PLAYING') return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_W / rect.width;
        const scaleY = CANVAS_H / rect.height;
        mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
        mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
    }, { passive: false });

    requestAnimationFrame(gameLoop);
};

function resize() {
    // Mantener aspect ratio 16:9
    // Ajustar visualmente el canvas al tamaño de ventana
    // Pero la lógica interna usa CANVAS_W/H constantes.
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w / h > CANVAS_W / CANVAS_H) w = h * (CANVAS_W / CANVAS_H);
    else h = w * (CANVAS_H / CANVAS_W);

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    // Internal resolution
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
}

// --- RED (PEERJS FAST-DUAL) ---
function screenCreate() {
    myNick = document.getElementById('input-nick').value || 'Anónimo';
    localStorage.setItem('hockey_nick', myNick);

    // Init Host
    const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
    peer = new Peer(shortId);

    peer.on('open', (id) => {
        isHost = true;
        myId = id;
        // Add self to players
        players[myId] = { x: 150, y: CANVAS_H / 2, nick: myNick, team: 'A', color: '#ff4757', ready: false };
        myTeam = 'A'; myColor = '#ff4757'; myReady = false;
        myTeam = 'A'; myColor = '#ff4757'; myReady = false;

        setupLobby();
        // Init UI
        updateConfigUIDisp();
    });

    peer.on('connection', (conn) => {
        setupHostConnection(conn);
    });

    peer.on('error', err => {
        if (err.type === 'unavailable-id') screenCreate(); // Retry
        else alert(err);
    });
}

function screenJoin() {
    myNick = document.getElementById('input-nick').value || 'Anónimo';
    localStorage.setItem('hockey_nick', myNick);

    const code = document.getElementById('input-code').value.toUpperCase();
    if (!code) return;

    peer = new Peer();
    peer.on('open', (id) => {
        myId = id;
        isHost = false;
        const conn = peer.connect(code);
        setupClientConnection(conn);
    });
    peer.on('error', err => alert(err));
}

// HOST LOGIC
function setupHostConnection(conn) {
    conn.on('open', () => {
        // Nuevo cliente
        const pId = conn.peer;
        // Asignar equipo por defecto (balanceo simple)
        const countA = Object.values(players).filter(p => p.team === 'A').length;
        const countB = Object.values(players).filter(p => p.team === 'B').length;
        const newTeam = countA > countB ? 'B' : 'A';
        const newColor = newTeam === 'A' ? '#ff4757' : '#3742fa';

        clientConns.push({ conn, id: pId });

        // Pide info inicial
        conn.send({ type: 'WELCOME', team: newTeam, color: newColor, config: config, teams: teams });
    });

    conn.on('data', data => {
        const pId = conn.peer;

        if (data.type === 'JOIN_INFO') {
            // Registrar jugador oficialmente
            players[pId] = {
                x: CANVAS_W / 2, y: CANVAS_H / 2,
                vx: 0, vy: 0,
                nick: data.nick,
                team: data.team,
                color: data.color,
                ready: false
            };
            broadcastLobby();
        }

        if (data.type === 'LOBBY_UPDATE') {
            // Jugador cambió equipo/color/listo
            if (players[pId]) {
                if (data.team) players[pId].team = data.team;
                if (data.color) {
                    players[pId].color = data.color;
                    // Host: Update Team Color Global if a user changed it
                    // This enforces "Last One Wins" color logic
                    if (teams[players[pId].team]) {
                        teams[players[pId].team].color = data.color;
                    }
                }
                if (data.ready !== undefined) players[pId].ready = data.ready;
                broadcastLobby();
            }
        }

        if (data.type === 'INPUT') {
            if (players[pId]) {
                // Calculate velocity based on difference
                const dx = data.x - players[pId].x;
                const dy = data.y - players[pId].y;
                // Limit velocity to prevent teleporting gltiches from confusing physics
                // Assume 60fps, so speed is pixels per frame
                players[pId].vx = dx;
                players[pId].vy = dy;

                players[pId].x = data.x;
                players[pId].y = data.y;
            }
        }
    });

    conn.on('close', () => {
        delete players[conn.peer];
        clientConns = clientConns.filter(c => c.conn !== conn);
        broadcastLobby();
    });
}

function broadcastLobby() {
    // Check if ALL ready to enable Start Button
    const all = Object.values(players);
    const allReady = all.every(p => p.ready);
    const btnStart = document.getElementById('btn-start-game');

    // Config Display Update
    const rConfig = { maxScore: config.maxScore, maxRounds: config.maxRounds };

    if (allReady) {
        btnStart.disabled = false;
        btnStart.innerText = "EMPEZAR PARTIDA";
        btnStart.style.opacity = "1";
        btnStart.style.cursor = "pointer";
    } else {
        btnStart.disabled = true;
        btnStart.innerText = `ESPERANDO (${all.filter(p => p.ready).length}/${all.length})`;
        btnStart.style.opacity = "0.5";
        btnStart.style.cursor = "not-allowed";
    }

    const listToSend = Object.keys(players).map(k => ({ id: k, nick: players[k].nick, team: players[k].team, color: players[k].color, ready: players[k].ready, x: players[k].x, y: players[k].y }));
    clientConns.forEach(c => c.conn.send({ type: "LOBBY_STATE", list: listToSend, config: rConfig, teams: teams }));
    renderLobbyUI(listToSend);
    updateConfigUIDisp();
}

// CLIENT LOGIC
function setupClientConnection(conn) {
    hostConn = conn;
    hostConn.on('open', () => {
        setupLobby(); // Mostrar pantalla lobby
    });

    hostConn.on('data', data => {
        if (data.type === 'WELCOME') {
            myTeam = data.team;
            myColor = data.color;
            config = data.config || config;
            if (data.teams) teams = data.teams;

            // Send back my info
            hostConn.send({ type: 'JOIN_INFO', nick: myNick, team: myTeam, color: myColor });

            // INIT LOCAL PLAYER
            // Ensure I exist in my own dictionary
            players[myId] = {
                // FLIPPED LOGIC requested by User
                x: myTeam === 'A' ? CANVAS_W - 150 : 150,
                y: CANVAS_H / 2,
                nick: myNick,
                team: myTeam,
                color: myColor,
                ready: false
            };

            // Update UI
            updateMyControls();
        }

        if (data.type === 'LOBBY_STATE') {
            config = data.config;
            if (data.teams) teams = data.teams; // CRITICAL: Update local teams state from Host

            renderLobbyUI(data.list);
            updateConfigUIDisp();

            // SYNC PLAYERS for Lobby Visuals
            // We rebuild players dict to match lobby list, ensuring we don't clobber our local prediction 'myId' if possible,
            // or just overwrite everything since Lobby isn't twitch-sensitive yet.
            data.list.forEach(pData => {
                if (pData.id === myId) return; // Don't overwrite self (maintain local mouse pos)
                players[pData.id] = {
                    x: pData.x || CANVAS_W / 2,
                    y: pData.y || CANVAS_H / 2,
                    nick: pData.nick,
                    team: pData.team,
                    color: pData.color,
                    ready: pData.ready
                };
            });
        }

        if (data.type === 'START') {
            startGame();
        }

        if (data.type === 'GAME_UPDATE') {
            // Updated Protocol: data.list is [Puck, P1, P2...]
            if (data.list && data.list.length > 0) {
                // 1. Puck (Index 0)
                const pData = data.list[0];
                puck.x = pData.x;
                puck.y = pData.y;

                // 2. Players (Index 1..N)
                for (let i = 1; i < data.list.length; i++) {
                    const pInfo = data.list[i];
                    if (pInfo.id === myId) continue; // Don't override self input

                    // Update or Init player
                    if (players[pInfo.id]) {
                        players[pInfo.id].x = pInfo.x;
                        players[pInfo.id].y = pInfo.y;
                    } else {
                        // If player appeared mid-game?
                        players[pInfo.id] = {
                            x: pInfo.x, y: pInfo.y,
                            nick: pInfo.nick,
                            color: '#fff', team: 'A' // Defaults until Lobby Sync
                        };
                    }
                }
            }

            if (data.teams) teams = data.teams;
            if (data.scores) updateScores(data.scores);
            if (data.roundWins) roundWins = data.roundWins;
            if (data.round) currentRound = data.round;
            if (data.gameOver) showGameOver(data.winner);
            updateHUDOverlay();
        }
    });
}

// --- LOBBY UI ---
function setupLobby() {
    gameState = 'LOBBY';
    document.getElementById('screen-title').classList.add('hidden');
    document.getElementById('screen-lobby').classList.remove('hidden');
    document.getElementById('lobby-room-code').innerText = 'SALA: ' + (isHost ? peer.id : 'CONECTADO');

    if (isHost) {
        document.getElementById('btn-start-game').classList.remove('hidden');
        document.getElementById('lobby-config').classList.remove('hidden');
    } else {
        document.getElementById('msg-wait').classList.remove('hidden');
        document.getElementById('lobby-config-display').classList.remove('hidden');
    }

    updateMyControls();
}

function updateMyControls() {
    document.getElementById('input-color').value = myColor;
}

function setTeam(t) {
    myTeam = t;
    // Update local preference, but Team Color dictates my paddle initially?
    // Or if I join, I adopt Team Color?
    // User wants: "Si alguien se une, se le asigna directo el color".
    // So:
    myColor = teams[t].color;

    // Reset Position to Correct Side
    if (players[myId]) {
        players[myId].x = t === 'A' ? 150 : CANVAS_W - 150;
    }

    updateMyControls();
    sendLobbyUpdate();
}

function setColor(c) {
    myColor = c;
    // Host Logic: If I change color, I change TEAM color (because I am authoritative source of truth for now)
    // Client Logic: If I change color, I send to Host, Host updates Team, Host sends back LOBBY_STATE with new Team Color.
    // So for immediate feedback, we update local 'teams' tentatively?
    // No, better to wait for echo for consistency, BUT User complained "no se aplico".
    // Let's update local 'teams' immediately for responsiveness.
    if (teams[myTeam]) teams[myTeam].color = c;
    sendLobbyUpdate();
}

function toggleReady() {
    myReady = !myReady;
    const btn = document.getElementById('btn-ready');
    if (myReady) {
        btn.innerText = "ESPERANDO...";
        btn.style.background = "#aaa";
    } else {
        btn.innerText = "¡ESTOY LISTO!";
        btn.style.background = "#4ade80";
    }
    sendLobbyUpdate();
}

function updateConfig() {
    if (!isHost) return;
    config.maxScore = parseInt(document.getElementById('input-max-score').value);
    config.maxRounds = parseInt(document.getElementById('input-max-rounds').value);
    broadcastLobby();
}

function updateConfigUIDisp() {
    let roundsTxt = config.maxRounds === 0 ? "Única" : `Mejor de ${config.maxRounds}`;
    document.getElementById('config-text').innerText = `Meta: ${config.maxScore} pts | Rondas: ${roundsTxt}`;
    document.getElementById('goal-val').innerText = config.maxScore;

    if (config.maxRounds > 0) document.getElementById('hud-rounds').classList.remove('hidden');
    else document.getElementById('hud-rounds').classList.add('hidden');
}

function sendLobbyUpdate() {
    // ALWAYS update local player state immediately for responsiveness
    if (players[myId]) {
        players[myId].team = myTeam;
        players[myId].color = myColor;
        players[myId].ready = myReady;
    }

    if (isHost) {
        broadcastLobby(); // Host self-update
    } else if (hostConn) {
        hostConn.send({ type: 'LOBBY_UPDATE', team: myTeam, color: myColor, ready: myReady });
    }
}

function renderLobbyUI(list) {
    const el = document.getElementById('lobby-players-list');
    el.innerHTML = '';
    list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'player-item';
        const readyIcon = p.ready ? '✅' : '⏳';
        div.innerHTML = `
            <span>
                <span class="team-badge badge-${p.team.toLowerCase()}">${p.team}</span> 
                ${p.nick} 
                <span style="margin-left:5px">${readyIcon}</span>
            </span>
            <div style="width:20px; height:20px; background:${p.color}; border-radius:50%"></div>
        `;
        el.appendChild(div);
    });
}

function startGameRequest() {
    if (!isHost) return;
    // Broadcast start
    clientConns.forEach(c => c.conn.send({ type: 'START' }));
    startGame();
}

function startGame() {
    gameState = 'PLAYING';
    document.getElementById('screen-lobby').classList.add('hidden');
    document.getElementById('screen-game').classList.remove('hidden');
    // Reset puck
    if (isHost) resetPuck();
}

// --- GAME LOGIC ---
function updatePhysics() {
    if (!isHost) return;

    // 1. Mover Puck
    puck.x += puck.vx;
    puck.y += puck.vy;

    // Fricción
    puck.vx *= FRICTION;
    puck.vy *= FRICTION;

    // Paredes (Rebote)
    if (puck.y < PUCK_R) { puck.y = PUCK_R; puck.vy *= -WALL_BOUNCE; }
    if (puck.y > CANVAS_H - PUCK_R) { puck.y = CANVAS_H - PUCK_R; puck.vy *= -WALL_BOUNCE; }

    // Goles (Izquierda / Derecha)
    // Goal range: Center Y +/- GOAL_SIZE/2
    const goalTop = CANVAS_H / 2 - GOAL_SIZE / 2;
    const goalBot = CANVAS_H / 2 + GOAL_SIZE / 2;

    // Left Wall
    if (puck.x < PUCK_R) {
        if (puck.y > goalTop && puck.y < goalBot) {
            // GOAL B! (Puck entró a la izq)
            score('B');
        } else {
            puck.x = PUCK_R;
            puck.vx *= -WALL_BOUNCE;
        }
    }

    // Right Wall
    if (puck.x > CANVAS_W - PUCK_R) {
        if (puck.y > goalTop && puck.y < goalBot) {
            // GOAL A! (Puck entró a la der)
            score('A');
        } else {
            puck.x = CANVAS_W - PUCK_R;
            puck.vx *= -WALL_BOUNCE;
        }
    }

    // Colisiones con Jugadores
    // Colisiones con Jugadores (Fisica Elastic Choque)
    for (const pid in players) {
        const p = players[pid];
        const dx = puck.x - p.x;
        const dy = puck.y - p.y;
        const dist = Math.hypot(dx, dy);
        const minDist = PUCK_R + PADDLE_R;

        if (dist < minDist) {
            // 1. Position Correction (Evitar Sticking)
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;

            // Mover Puck fuera del jugador inmediatamente
            puck.x += Math.cos(angle) * overlap;
            puck.y += Math.sin(angle) * overlap;

            // 2. Velocidad Relativa
            // Vector Normal (n)
            const nx = Math.cos(angle);
            const ny = Math.sin(angle);

            // Vector Tangente (t)
            const tx = -ny;
            const ty = nx;

            // Proyectar velocidades en Normal y Tangente
            // Puck
            const v1n = puck.vx * nx + puck.vy * ny;
            const v1t = puck.vx * tx + puck.vy * ty;

            // Player (Tiene masa infinita efectivamente, pero le transferimos su momento)
            const v2n = p.vx * nx + p.vy * ny;
            // Player tangent velocity doesn't matter for 1D collision along normal

            // 3. Choque Elástico 1D (Masa Player >> Masa Puck)
            // Si el jugador fuera estático: v1n_new = -v1n
            // Con jugador moviéndose: v1n_new = 2*v2n - v1n
            // Agregamos coeficiente de restitución (bounciness) + Extra Power

            // Si el brazo se mueve HACIA el puck (v2n < 0 relativo a n?), n apunta de Player a Puck.
            // Asi que si v2n > 0, el player empuja al puck. 

            const restitution = 1.0; // Perfectamente elástico
            const boost = 1.2; // Extra arcade speed

            // Formula simplificada para "Pared Móvil con Masa Infinita":
            let v1n_final = (2 * v2n - v1n) * restitution;

            // Limitar la velocidad transferida del mouse para que no rompa la fisica
            // A veces el mouse se mueve MUY rapido (teletransportación)
            if (v1n_final > 40) v1n_final = 40;
            if (v1n_final < -40) v1n_final = -40;

            // Forzar rebote minimo si están muy pegados y v2n es bajo
            if (Math.abs(v1n_final) < 2) {
                v1n_final += 5; // Min push away
            }

            // Convertir escalar normal/tangente de vuelta a vectores x/y
            // La tangente se mantiene igual (sin fricción de superficie)
            puck.vx = (v1n_final * nx + v1t * tx) * boost;
            puck.vy = (v1n_final * ny + v1t * ty) * boost;

            // Cap final de velocidad absoluta
            const speed = Math.hypot(puck.vx, puck.vy);
            if (speed > 35) {
                puck.vx = (puck.vx / speed) * 35;
                puck.vy = (puck.vy / speed) * 35;
            }
        }
    }

    // Listado optimizado para transmisión (Solicitud User Step 3166)
    // [0] = Puck, [1..N] = Jugadores
    const gameList = [];

    // 1. Disco (Siempre primero)
    gameList.push({ id: 'PUCK', x: Math.round(puck.x), y: Math.round(puck.y) });

    // 2. Jugadores
    // Envio ID para mapping rápido, y Nick por si acaso visual
    for (const pid in players) {
        gameList.push({
            id: pid,
            x: Math.round(players[pid].x),
            y: Math.round(players[pid].y),
            nick: players[pid].nick
        });
    }

    // Enviar estado a clientes
    const state = {
        list: gameList,
        scores: scores,
        roundWins: roundWins,
        round: currentRound,
        gameOver: isGameOver,
        winner: isGameOver ? (roundWins.A > roundWins.B ? 'A' : 'B') : null,
        teams: teams
    };
    clientConns.forEach(c => c.conn.send({ type: 'GAME_UPDATE', ...state }));
}

function score(team) {
    scores[team]++;
    updateScores(scores);
    resetPuck();

    // Check Round/Game Win
    if (scores[team] >= config.maxScore) {
        // Round WIN
        roundWins[team]++;

        // Check Match WIN
        let won = false;
        if (config.maxRounds === 0) {
            won = true; // Single round match
        } else {
            // "5 puntos y 2 rondas" -> First to win 2 rounds?
            // User requested "selecionar rondas". Usually "Best of 3" or "First to 2".
            // Let's implement "First to X wins".
            if (roundWins[team] >= config.maxRounds) won = true;
        }

        if (won) {
            isGameOver = true;
            gameState = 'GAMEOVER';
            showGameOver(team);
        } else {
            // Next Round
            currentRound++;
            scores = { A: 0, B: 0 };
            updateScores(scores);
            // Maybe small pause?
        }
    }
}

function updateHUDOverlay() {
    const elA = document.querySelector('#hud-rounds .score-a');
    elA.innerText = roundWins.A;
    elA.style.color = teams.A.color;

    const elB = document.querySelector('#hud-rounds .score-b');
    elB.innerText = roundWins.B;
    elB.style.color = teams.B.color;
}

function showGameOver(winner) {
    alert(`¡JUEGO TERMINADO! GANADOR: EQUIPO ${winner}`);
    location.reload();
}

function updateScores(s) {
    scores = s;
    const elA = document.querySelector('#hud-score .score-a');
    elA.innerText = s.A;
    elA.style.color = teams.A.color;

    const elB = document.querySelector('#hud-score .score-b');
    elB.innerText = s.B;
    elB.style.color = teams.B.color;
}

function resetPuck() {
    puck.x = CANVAS_W / 2;
    puck.y = CANVAS_H / 2;
    puck.vx = (Math.random() > 0.5 ? 5 : -5);
    puck.vy = (Math.random() - 0.5) * 5;
}

// --- CLIENT INPUT LOOP ---
function clientInput() {
    // Enviar mi posición al host
    if (isHost) {
        // Direct update local
        // Calculate velocity for self (Host)
        const dx = mouse.x - players[myId].x;
        const dy = mouse.y - players[myId].y;
        players[myId].vx = dx;
        players[myId].vy = dy;

        players[myId].x = mouse.x;
        players[myId].y = mouse.y;

        // Broadcast movement in Lobby
        if (gameState === 'LOBBY') {
            // Send light visual update (positions)
            // Clean players object to minimal needing sending? No, send all for now.
            const state = { players: players };
            clientConns.forEach(c => c.conn.send({ type: 'GAME_UPDATE', ...state }));
        }

    } else if (hostConn && (gameState === 'PLAYING' || gameState === 'LOBBY')) {
        // Send to host
        hostConn.send({ type: 'INPUT', x: mouse.x, y: mouse.y });
        // Predicción local (visual)
        if (players[myId]) {
            players[myId].x = mouse.x;
            players[myId].y = mouse.y;
        }
    }
}

// --- RENDER ---
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 0, b: 0 };
}

// Helper to get ephemeral team colors
function getTeamColors() { return { A: teams.A ? teams.A.color : "#ff4757", B: teams.B ? teams.B.color : "#3742fa" }; }

function updateTeamColorsDOM() {
    const colors = getTeamColors();
    const btnA = document.querySelector('.btn-team.team-a');
    const btnB = document.querySelector('.btn-team.team-b');

    if (btnA) {
        btnA.style.background = colors.A;
        btnA.innerText = `EQUIPO A (Izquierda)`;
    }
    if (btnB) {
        btnB.style.background = colors.B;
        btnB.innerText = `EQUIPO B (Derecha)`;
    }

    // Also update badges in list
    document.querySelectorAll('.badge-a').forEach(el => el.style.background = colors.A);
    document.querySelectorAll('.badge-b').forEach(el => el.style.background = colors.B);

    // Update Score colors
    const sA = document.querySelector('.score-a');
    const sB = document.querySelector('.score-b');
    if (sA) sA.style.color = colors.A;
    if (sB) sB.style.color = colors.B;
}

function draw() {
    // Determine Team Colors based on players
    const colors = getTeamColors();
    const colorAStr = colors.A;
    const colorBStr = colors.B;

    const rgbA = hexToRgb(colorAStr);
    const rgbB = hexToRgb(colorBStr);

    // Sync UI occasionally? Doing it every frame is heavy but ensures instant feedback.
    // Let's do it every frame for now, DOM diffing is fast enough for 2 buttons.
    updateTeamColorsDOM();

    // 1. Fondo "Mesa de Aire" (Negro Azulado Profundo + Grid sutil)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid (Patrón de agujeros de aire)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < CANVAS_W; i += 40) {
        for (let j = 0; j < CANVAS_H; j += 40) {
            ctx.beginPath();
            ctx.arc(i, j, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 2. Líneas del Campo (Neon)
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;

    // Línea Central
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.shadowColor = 'white';
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, 0); ctx.lineTo(CANVAS_W / 2, CANVAS_H);
    ctx.stroke();

    // Círculo Central
    ctx.beginPath();
    ctx.arc(CANVAS_W / 2, CANVAS_H / 2, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Zonas de Equipo (Dynamic Colors)

    // -- LADO A (Izquierda) --
    // Línea de Falta
    ctx.strokeStyle = colorAStr;
    ctx.shadowBlur = 20;
    ctx.shadowColor = colorAStr;
    ctx.beginPath();
    ctx.moveTo(300, 0); ctx.lineTo(300, CANVAS_H);
    // ctx.stroke(); 

    // Portería A (Resplandor Gradient)
    const gradA = ctx.createLinearGradient(0, 0, 400, 0);
    gradA.addColorStop(0, `rgba(${rgbA.r}, ${rgbA.g}, ${rgbA.b}, 0.3)`);
    gradA.addColorStop(1, `rgba(${rgbA.r}, ${rgbA.g}, ${rgbA.b}, 0)`);
    ctx.fillStyle = gradA;
    ctx.fillRect(0, 0, 400, CANVAS_H);

    // Arco A
    ctx.strokeStyle = colorAStr;
    ctx.lineWidth = 8;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colorAStr;
    ctx.beginPath();
    ctx.arc(0, CANVAS_H / 2, 150, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // -- LADO B (Derecha) --
    // Portería B (Resplandor Gradient)
    const gradB = ctx.createLinearGradient(CANVAS_W - 400, 0, CANVAS_W, 0);
    gradB.addColorStop(0, `rgba(${rgbB.r}, ${rgbB.g}, ${rgbB.b}, 0)`);
    gradB.addColorStop(1, `rgba(${rgbB.r}, ${rgbB.g}, ${rgbB.b}, 0.3)`);
    ctx.fillStyle = gradB;
    ctx.fillRect(CANVAS_W - 400, 0, 400, CANVAS_H);

    // Arco B
    ctx.strokeStyle = colorBStr;
    ctx.shadowColor = colorBStr;
    ctx.beginPath();
    ctx.arc(CANVAS_W, CANVAS_H / 2, 150, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 3. Puck (Disco)
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'white';
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, PUCK_R, 0, Math.PI * 2);
    ctx.fill();
    // Detalle Puck
    ctx.fillStyle = '#ced6e0';
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, PUCK_R * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Jugadores (Paddles)
    for (const pid in players) {
        const p = players[pid];

        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;

        // Base Paddle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, PADDLE_R, 0, Math.PI * 2);
        ctx.fill();

        // Handle (Mango 3D effect)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, PADDLE_R * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(p.x - 5, p.y - 5, PADDLE_R * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Nickname Tag
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(p.nick, p.x, p.y - PADDLE_R - 15);
        // Team Indicator triangle if needed
    }
}

function gameLoop() {
    clientInput(); // Run input always (Menu/Lobby/Game) for responsiveness
    if (gameState === 'PLAYING') {
        if (isHost) updatePhysics();
    }
    draw();
    requestAnimationFrame(gameLoop);
}
