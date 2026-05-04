// --- CONSTANTES LÓGICAS (Mundo interno siempre es VERTICAL) ---
// Así no importa si juegas en PC (Horizontal) o Móvil (Vertical), 
// las matemáticas son exactamente iguales para todos.
const LOGICAL_W = 800;
const LOGICAL_H = 1200;

// Elementos HTML
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// --- ESTADO GLOBAL ---
let myNick = localStorage.getItem('hockey_nick') || "Jugador" + Math.floor(Math.random()*100);
let myId = null;
let isHost = false;
let peer = null;
let hostConn = null;
let clientConns = {}; // Solo Host

// Estado del juego sincronizado
let myTeam = 'A';
let teamColors = { A: '#ff4757', B: '#3742fa' };
let myColor = teamColors.A;
let scores = { A: 0, B: 0 };
let players = {}; // id -> { nick, team, color, x, y }
let puckState = { x: LOGICAL_W/2, y: LOGICAL_H/2 };
let drawnPaths = []; // Trazos de obstáculos dibujados por el Host

let gameState = 'LOBBY'; // LOBBY, PLAYING, GAMEOVER
let maxScore = 5;
let matchStartTime = 0;
let lastPuckTouch = null;
let matchStats = { durationStr: "00:00", playerStats: {}, timeline: [] };

// --- FÍSICAS (Solo Host) ---
let engine, world;
let puckBody;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Inicializar UI
document.getElementById('input-nick').value = myNick;

function updateMaxScore(val) {
    maxScore = parseInt(val);
    document.getElementById('disp-max-score').innerText = maxScore;
    if (isHost) broadcastLobby();
}

// ==========================================
// SELECCIÓN DE EQUIPO Y COLOR (LOBBY)
// ==========================================
function setTeam(team) {
    myTeam = team;
    myColor = teamColors[team];
    document.getElementById('input-color').value = myColor;
    sendLobbyUpdate();
}

function setColor(color) {
    myColor = color;
    teamColors[myTeam] = color;
    sendLobbyUpdate();
}

function sendLobbyUpdate() {
    if (players[myId]) {
        players[myId].team = myTeam;
        players[myId].color = myColor;
    }
    if (isHost) {
        broadcastLobby();
    } else if (hostConn) {
        hostConn.send({ type: 'LOBBY_UPDATE', team: myTeam, color: myColor });
    }
}

// ==========================================
// RED: INICIALIZACIÓN
// ==========================================
function createRoom() {
    myNick = document.getElementById('input-nick').value || myNick;
    localStorage.setItem('hockey_nick', myNick);
    
    // Generar un ID de 4 caracteres
    const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
    peer = new Peer(shortId);
    
    peer.on('open', id => {
        isHost = true;
        myId = id;
        document.getElementById('lobby-code').innerText = id;
        document.getElementById('host-controls').classList.remove('hidden');
        showScreen('screen-lobby');
        
        initHostPhysics();
        addPlayer(myId, myNick);
        sendLobbyUpdate(); // Registra localmente
    });
    
    peer.on('connection', conn => {
        conn.on('open', () => {
            clientConns[conn.peer] = conn;
            conn.on('data', data => handleHostData(conn.peer, data));
        });
        conn.on('close', () => {
            if (players[conn.peer] && players[conn.peer].body) {
                Matter.World.remove(world, players[conn.peer].body);
            }
            delete players[conn.peer];
            delete clientConns[conn.peer];
            broadcastLobby();
        });
    });

    peer.on('error', err => {
        if (err.type === 'unavailable-id') {
            createRoom(); // Reintentar con otro código
        } else {
            alert("Error de red: " + err);
        }
    });
}

function joinRoom() {
    myNick = document.getElementById('input-nick').value || myNick;
    localStorage.setItem('hockey_nick', myNick);
    const code = document.getElementById('input-code').value.trim().toUpperCase();
    if (!code) return;
    
    peer = new Peer();
    peer.on('open', id => {
        myId = id;
        isHost = false;
        hostConn = peer.connect(code);
        hostConn.on('open', () => {
            document.getElementById('lobby-code').innerText = code;
            document.getElementById('wait-msg').classList.remove('hidden');
            showScreen('screen-lobby');
            
            hostConn.send({ type: 'JOIN', nick: myNick, team: myTeam, color: myColor });
            hostConn.on('data', handleClientData);
        });
    });
}

// ==========================================
// RED: HOST
// ==========================================
function handleHostData(peerId, data) {
    if (data.type === 'JOIN') {
        addPlayer(peerId, data.nick);
        players[peerId].team = data.team;
        players[peerId].color = data.color;
        broadcastLobby();
    } else if (data.type === 'INPUT') {
        if (players[peerId]) {
            players[peerId].targetX = Math.max(45, Math.min(LOGICAL_W - 45, data.x));
            players[peerId].targetY = Math.max(45, Math.min(LOGICAL_H - 45, data.y));
        }
    } else if (data.type === 'LOBBY_UPDATE') {
        if (players[peerId]) {
            players[peerId].team = data.team;
            players[peerId].color = data.color;
            teamColors[data.team] = data.color;
            
            // Forzar actualización de color a todos los miembros del equipo
            for (let id in players) {
                if (players[id].team === data.team) {
                    players[id].color = data.color;
                }
            }
            broadcastLobby();
        }
    }
}

function broadcastLobby() {
    const list = Object.keys(players).map(k => ({ 
        id: k, 
        nick: players[k].nick, 
        color: players[k].color, 
        team: players[k].team 
    }));
    updateLobbyUI(list);
    Object.values(clientConns).forEach(c => c.send({ type: 'LOBBY_SYNC', list, teamColors, maxScore }));
}

function broadcastGameState() {
    const pData = {};
    for (let id in players) {
        if (players[id].body) {
            pData[id] = { 
                x: players[id].body.position.x, 
                y: players[id].body.position.y 
            };
        }
    }
    const state = {
        puck: { x: puckBody.position.x, y: puckBody.position.y },
        players: pData,
        scores: scores,
        teamColors: teamColors
    };
    Object.values(clientConns).forEach(c => c.send({ type: 'SYNC', state }));
}

// ==========================================
// RED: CLIENTE
// ==========================================
function handleClientData(data) {
    if (data.type === 'LOBBY_SYNC') {
        if (data.teamColors) teamColors = data.teamColors;
        if (data.maxScore) {
            maxScore = data.maxScore;
            document.getElementById('disp-max-score').innerText = maxScore;
        }
        
        myColor = teamColors[myTeam];
        document.getElementById('input-color').value = myColor;
        
        updateLobbyUI(data.list);
        
        // Actualizar datos locales
        data.list.forEach(p => {
            if (!players[p.id]) players[p.id] = {};
            players[p.id].nick = p.nick;
            players[p.id].color = p.color;
            players[p.id].team = p.team;
        });
        
    } else if (data.type === 'START') {
        if (data.drawnPaths) drawnPaths = data.drawnPaths;
        showScreen('screen-game');
        document.getElementById('score-display').classList.remove('hidden');
        startGameLoop();
    } else if (data.type === 'SYNC') {
        puckState = data.state.puck;
        scores = data.state.scores;
        if (data.state.teamColors) teamColors = data.state.teamColors;
        
        document.getElementById('score-a').innerText = scores.A;
        document.getElementById('score-b').innerText = scores.B;

        for (let id in data.state.players) {
            if (players[id]) {
                players[id].x = data.state.players[id].x;
                players[id].y = data.state.players[id].y;
            }
        }
    } else if (data.type === 'GAME_OVER') {
        showGameOverScreen(data.winner, data.stats);
    } else if (data.type === 'RETURN_LOBBY') {
        resetMatchState();
        showScreen('screen-lobby');
    }
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:(R>0?R:0);
    G = (G<255)?G:(G>0?G:0);
    B = (B<255)?B:(B>0?B:0);

    let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function updateLobbyUI(list) {
    // Actualizar colores de UI
    document.getElementById('btn-team-a').style.background = teamColors.A;
    document.getElementById('btn-team-a').style.boxShadow = `0 4px 0 ${shadeColor(teamColors.A, -20)}`;
    document.getElementById('title-team-a').style.color = teamColors.A;
    document.getElementById('score-a').style.color = teamColors.A;

    document.getElementById('btn-team-b').style.background = teamColors.B;
    document.getElementById('btn-team-b').style.boxShadow = `0 4px 0 ${shadeColor(teamColors.B, -20)}`;
    document.getElementById('title-team-b').style.color = teamColors.B;
    document.getElementById('score-b').style.color = teamColors.B;

    const listA = document.getElementById('list-team-a');
    const listB = document.getElementById('list-team-b');
    
    listA.innerHTML = list.filter(p => p.team === 'A')
        .map(p => `<div class="player-item" style="border-left: 5px solid ${p.color || '#fff'}; margin-bottom: 5px;">${p.nick}</div>`).join('');
        
    listB.innerHTML = list.filter(p => p.team === 'B')
        .map(p => `<div class="player-item" style="border-left: 5px solid ${p.color || '#fff'}; margin-bottom: 5px;">${p.nick}</div>`).join('');
}

// ==========================================
// FÍSICAS MATER.JS (Solo Host)
// ==========================================
function initHostPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;
    engine.gravity.y = 0; // Vista desde arriba

    const wallOptions = { isStatic: true, restitution: 1.0, friction: 0 };
    
    // Paredes con hueco de 300px en el centro para las porterías
    // 800 ancho total -> Centro es 400 -> Hueco va de 250 a 550.
    // Pared Izq Superior (0 a 250): Centro 125, ancho 250
    // Pared Der Superior (550 a 800): Centro 675, ancho 250
    const walls = [
        // Arriba (Equipo A defiende)
        Matter.Bodies.rectangle(125, -25, 250, 50, wallOptions),
        Matter.Bodies.rectangle(675, -25, 250, 50, wallOptions),
        // Abajo (Equipo B defiende)
        Matter.Bodies.rectangle(125, LOGICAL_H+25, 250, 50, wallOptions),
        Matter.Bodies.rectangle(675, LOGICAL_H+25, 250, 50, wallOptions),
        // Laterales
        Matter.Bodies.rectangle(-25, LOGICAL_H/2, 50, LOGICAL_H, wallOptions), // Izquierda
        Matter.Bodies.rectangle(LOGICAL_W+25, LOGICAL_H/2, 50, LOGICAL_H, wallOptions) // Derecha
    ];
    
    // Sensores de Portería (invisibles)
    const goalA = Matter.Bodies.rectangle(LOGICAL_W/2, -50, 300, 50, { isStatic: true, isSensor: true, label: 'goalA' });
    const goalB = Matter.Bodies.rectangle(LOGICAL_W/2, LOGICAL_H+50, 300, 50, { isStatic: true, isSensor: true, label: 'goalB' });

    // Disco
    puckBody = Matter.Bodies.circle(LOGICAL_W/2, LOGICAL_H/2, 30, {
        restitution: 0.9, 
        friction: 0.001,
        frictionAir: 0.015,
        density: 0.001
    });

    Matter.World.add(world, [...walls, goalA, goalB, puckBody]);

    // Detección de Goles
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            if (pair.bodyA === puckBody || pair.bodyB === puckBody) {
                const other = pair.bodyA === puckBody ? pair.bodyB : pair.bodyA;
                
                // Rastrear último toque
                for (let id in players) {
                    if (players[id].body === other) {
                        lastPuckTouch = id;
                        break;
                    }
                }
                
                if (other.label === 'goalA') {
                    handleGoal('B');
                } else if (other.label === 'goalB') {
                    handleGoal('A');
                }
            }
        });
    });

    // Bucle de Físicas
    setInterval(() => {
        if (gameState !== 'PLAYING') return;

        // Mover jugadores hacia donde apuntan
        for (let id in players) {
            const p = players[id];
            if (p.body && p.targetX !== undefined) {
                // Fuerzas elásticas suaves
                let dx = p.targetX - p.body.position.x;
                let dy = p.targetY - p.body.position.y;
                
                Matter.Body.setVelocity(p.body, { 
                    x: dx * 0.15, 
                    y: dy * 0.15 
                });

                // Anti-Bug: Si por lag el cuerpo atraviesa la pared exterior, forzarlo adentro
                if (p.body.position.x < 0 || p.body.position.x > LOGICAL_W || 
                    p.body.position.y < 0 || p.body.position.y > LOGICAL_H) {
                    Matter.Body.setPosition(p.body, {
                        x: Math.max(45, Math.min(LOGICAL_W - 45, p.body.position.x)),
                        y: Math.max(45, Math.min(LOGICAL_H - 45, p.body.position.y))
                    });
                }
            }
        }

        // Anti-Bug: Si el disco sale disparado a hipervelocidad y sale del mapa
        if (puckBody.position.x < -300 || puckBody.position.x > LOGICAL_W + 300 ||
            puckBody.position.y < -300 || puckBody.position.y > LOGICAL_H + 300) {
            resetPuck();
        }

        Matter.Engine.update(engine, 1000 / 60);
        broadcastGameState();
    }, 1000 / 60);
}

function resetPuck() {
    let spawnX = LOGICAL_W / 2;
    let spawnY = LOGICAL_H / 2;
    
    // Evitar aparecer dentro de un obstáculo dibujado
    let maxAttempts = 50;
    while (maxAttempts > 0) {
        // Verificar colisión en el punto de spawn
        let bodies = Matter.Composite.allBodies(world).filter(b => b !== puckBody && !b.isSensor);
        let collisions = Matter.Query.point(bodies, { x: spawnX, y: spawnY });
        
        if (collisions.length === 0) break; // Lugar libre!
        
        // Mover el punto de spawn buscando espacio
        spawnY += 40;
        if (spawnY > LOGICAL_H - 100) {
            spawnY = 100;
            spawnX += 40; // Cambiar de columna
            if (spawnX > LOGICAL_W - 100) spawnX = 100;
        }
        maxAttempts--;
    }

    Matter.Body.setPosition(puckBody, { x: spawnX, y: spawnY });
    Matter.Body.setVelocity(puckBody, { x: 0, y: 0 });
    
    // Alguien anotó, actualizamos el UI en el Host inmediatamente
    document.getElementById('score-a').innerText = scores.A;
    document.getElementById('score-b').innerText = scores.B;
}

function handleGoal(scoringTeam) {
    if (gameState !== 'PLAYING') return;
    scores[scoringTeam]++;
    
    let elapsedSecs = Math.floor((Date.now() - matchStartTime) / 1000);
    let mins = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
    let secs = String(elapsedSecs % 60).padStart(2, '0');
    let timeStr = `${mins}:${secs}`;
    
    let isAuto = false;
    let scorerId = lastPuckTouch;
    
    if (scorerId && players[scorerId] && matchStats.playerStats[scorerId]) {
        if (players[scorerId].team !== scoringTeam) {
            isAuto = true;
            matchStats.playerStats[scorerId].autogoals++;
        } else {
            matchStats.playerStats[scorerId].goals++;
        }
    }
    
    matchStats.timeline.push({
        team: scoringTeam,
        time: timeStr,
        scorerId: scorerId,
        isAuto: isAuto
    });
    
    lastPuckTouch = null;
    resetPuck();
    
    if (scores[scoringTeam] >= maxScore) {
        endGame(scoringTeam);
    }
}

function endGame(winningTeam) {
    gameState = 'GAMEOVER';
    
    let elapsedSecs = Math.floor((Date.now() - matchStartTime) / 1000);
    let mins = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
    let secs = String(elapsedSecs % 60).padStart(2, '0');
    matchStats.durationStr = `${mins}:${secs}`;
    
    // Limpiar cuerpos fisicos de los jugadores para que no interfieran
    for (let id in players) {
        if (players[id].body) {
            Matter.World.remove(world, players[id].body);
            players[id].body = null;
        }
    }
    
    Object.values(clientConns).forEach(c => c.send({ 
        type: 'GAME_OVER', 
        winner: winningTeam, 
        stats: matchStats 
    }));
    
    showGameOverScreen(winningTeam, matchStats);
}

function showGameOverScreen(winner, stats) {
    document.getElementById('score-display').classList.add('hidden');
    showScreen('screen-gameover');
    
    let titleColor = winner === 'A' ? teamColors.A : teamColors.B;
    document.getElementById('winner-title').innerText = `¡EQUIPO ${winner} GANA!`;
    document.getElementById('winner-title').style.color = titleColor;
    document.getElementById('stat-duration').innerText = stats.durationStr;
    
    let bestPlayer = null;
    let maxG = -1;
    let htmlPlayers = "";
    
    for (let id in stats.playerStats) {
        if (!players[id]) continue;
        let g = stats.playerStats[id].goals;
        let ag = stats.playerStats[id].autogoals;
        
        if (g > maxG) { maxG = g; bestPlayer = players[id]; }
        
        let color = players[id].color || '#fff';
        htmlPlayers += `<div style="margin-bottom: 5px;"><span style="color:${color}">${players[id].nick}</span>: ${g} Goles${ag > 0 ? ` <span style="color:#ef4444; font-size:0.8rem;">(${ag} autogoles)</span>` : ''}</div>`;
    }
    
    if (bestPlayer && maxG > 0) {
        htmlPlayers = `<div style="margin-bottom:15px; font-weight:bold; font-size:1.1rem; color:var(--accent);">👑 MVP: <span style="color:${bestPlayer.color}">${bestPlayer.nick}</span> (${maxG} Goles)</div>` + htmlPlayers;
    } else {
        htmlPlayers = `<div style="margin-bottom:15px; color:#aaa;">Nadie anotó activamente.</div>` + htmlPlayers;
    }
    document.getElementById('stats-players').innerHTML = htmlPlayers;
    
    let htmlTime = "";
    if (stats.timeline.length === 0) {
        htmlTime = "Sin goles registrados.";
    } else {
        stats.timeline.forEach(ev => {
            let pNick = ev.scorerId && players[ev.scorerId] ? players[ev.scorerId].nick : "Desconocido/Rebote";
            let tColor = ev.team === 'A' ? teamColors.A : teamColors.B;
            let autoTxt = ev.isAuto ? " <span style='color:#ef4444'>(Autogol)</span>" : "";
            htmlTime += `<div style="margin-bottom: 5px;">[${ev.time}] <span style="color:${tColor}">Gol de ${ev.team}</span> - ${pNick}${autoTxt}</div>`;
        });
    }
    document.getElementById('stats-timeline').innerHTML = htmlTime;
    
    if (isHost) {
        document.getElementById('gameover-host-controls').classList.remove('hidden');
        document.getElementById('gameover-wait-msg').classList.add('hidden');
    } else {
        document.getElementById('gameover-host-controls').classList.add('hidden');
        document.getElementById('gameover-wait-msg').classList.remove('hidden');
    }
}

function returnToLobby() {
    if (isHost) {
        Object.values(clientConns).forEach(c => c.send({ type: 'RETURN_LOBBY' }));
        resetMatchState();
        showScreen('screen-lobby');
    }
}

function resetMatchState() {
    gameState = 'LOBBY';
    scores = { A: 0, B: 0 };
    document.getElementById('score-a').innerText = '0';
    document.getElementById('score-b').innerText = '0';
}

function addPlayer(id, nick) {
    players[id] = { 
        nick: nick, 
        team: 'A', // Default, se actualizará
        color: '#fff', 
        x: LOGICAL_W/2, 
        y: LOGICAL_H/2, 
        targetX: LOGICAL_W/2, 
        targetY: LOGICAL_H/2, 
        body: null 
    };
}

function startGame() {
    if (isHost) {
        gameState = 'PLAYING';
        scores = { A: 0, B: 0 };
        matchStartTime = Date.now();
        lastPuckTouch = null;
        matchStats = { durationStr: "00:00", playerStats: {}, timeline: [] };
        
        // Instanciar cuerpos y resetear stats
        for (let id in players) {
            matchStats.playerStats[id] = { goals: 0, autogoals: 0 };
            
            let p = players[id];
            let startY = p.team === 'A' ? 200 : LOGICAL_H - 200;
            
            p.body = Matter.Bodies.circle(LOGICAL_W/2, startY, 45, {
                restitution: 0.5,
                frictionAir: 0.1,
                density: 0.05
            });
            Matter.World.add(world, p.body);
            p.targetY = startY;
        }

        // Remover viejos obstáculos si ya había
        // No es estrictamente necesario ya que limpiamos todo, wait! 
        // drawnPaths se acumulan. Deberíamos dejar que se acumulen o borrarlos en clearDraw.
        const obstacleOptions = { isStatic: true, restitution: 0.8, friction: 0 };
        drawnPaths.forEach(path => {
            for (let i = 0; i < path.length - 1; i++) {
                let p1 = path[i];
                let p2 = path[i+1];
                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let length = Math.hypot(dx, dy);
                let cx = p1.x + dx / 2;
                let cy = p1.y + dy / 2;
                let angle = Math.atan2(dy, dx);
                
                let rect = Matter.Bodies.rectangle(cx, cy, length + 15, 15, { ...obstacleOptions, angle: angle });
                Matter.World.add(world, rect);
            }
            // Suavizar uniones con círculos para que el disco no se atasque en esquinas
            for (let i = 0; i < path.length; i++) {
                let circle = Matter.Bodies.circle(path[i].x, path[i].y, 7.5, obstacleOptions);
                Matter.World.add(world, circle);
            }
        });

        Object.values(clientConns).forEach(c => c.send({ type: 'START', drawnPaths: drawnPaths }));
        showScreen('screen-game');
        document.getElementById('score-display').classList.remove('hidden');
        startGameLoop();
    }
}

// ==========================================
// INPUT Y CÁMARA (CUALQUIER CLIENTE)
// ==========================================

function sendInput(e) {
    const isLandscape = window.innerWidth > window.innerHeight;
    let scale = isLandscape ? 
        Math.min(canvas.width / LOGICAL_H, canvas.height / LOGICAL_W) :
        Math.min(canvas.width / LOGICAL_W, canvas.height / LOGICAL_H);

    let rect = canvas.getBoundingClientRect();
    let sx = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    let sy = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    let cx = sx - canvas.width / 2;
    let cy = sy - canvas.height / 2;

    let lx, ly;
    if (isLandscape) {
        let rx = -cy;
        let ry = cx;
        lx = (rx / scale) + LOGICAL_W / 2;
        ly = (ry / scale) + LOGICAL_H / 2;
    } else {
        lx = (cx / scale) + LOGICAL_W / 2;
        ly = (cy / scale) + LOGICAL_H / 2;
    }

    // Limitar entrada a los bordes de la cancha (impide salir con el mouse/dedo)
    lx = Math.max(45, Math.min(LOGICAL_W - 45, lx));
    ly = Math.max(45, Math.min(LOGICAL_H - 45, ly));

    if (isHost) {
        if (players[myId]) {
            players[myId].targetX = lx;
            players[myId].targetY = ly;
        }
    } else {
        if (hostConn) {
            hostConn.send({ type: 'INPUT', x: lx, y: ly });
        }
    }
}

canvas.addEventListener('pointermove', sendInput);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); sendInput(e); }, { passive: false });

// ==========================================
// RENDER LOOP
// ==========================================
function startGameLoop() {
    requestAnimationFrame(render);
}

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isLandscape = window.innerWidth > window.innerHeight;
    let scale = isLandscape ? 
        Math.min(canvas.width / LOGICAL_H, canvas.height / LOGICAL_W) :
        Math.min(canvas.width / LOGICAL_W, canvas.height / LOGICAL_H);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (isLandscape) {
        ctx.rotate(-Math.PI / 2);
    }
    ctx.scale(scale, scale);
    ctx.translate(-LOGICAL_W / 2, -LOGICAL_H / 2);

    // 1. DIBUJAR PISTA LOGICA
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    
    // Borde iluminado
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, LOGICAL_W, LOGICAL_H);

    // Línea central
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, LOGICAL_H/2);
    ctx.lineTo(LOGICAL_W, LOGICAL_H/2);
    ctx.stroke();

    // Circulo central
    ctx.beginPath();
    ctx.arc(LOGICAL_W/2, LOGICAL_H/2, 100, 0, Math.PI * 2);
    ctx.stroke();

    // 2. DIBUJAR PORTERÍAS (Ancho: 300px)
    ctx.fillStyle = teamColors.A; // Arriba Equipo A
    ctx.fillRect(250, -20, 300, 40);
    
    ctx.fillStyle = teamColors.B; // Abajo Equipo B
    ctx.fillRect(250, LOGICAL_H - 20, 300, 40);

    // 3. DIBUJAR DISCO
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    let px = isHost && puckBody ? puckBody.position.x : puckState.x;
    let py = isHost && puckBody ? puckBody.position.y : puckState.y;
    ctx.arc(px, py, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'white';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. DIBUJAR JUGADORES
    for (let id in players) {
        let p = players[id];
        let ppx, ppy;
        
        if (isHost && p.body) {
            ppx = p.body.position.x;
            ppy = p.body.position.y;
        } else {
            ppx = p.x || -100;
            ppy = p.y || -100;
        }

        // Ficha Base
        ctx.fillStyle = p.color || '#fff';
        ctx.beginPath();
        ctx.arc(ppx, ppy, 45, 0, Math.PI * 2);
        ctx.fill();
        
        // Anillo Interno Decorativo
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(ppx, ppy, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    // 5. DIBUJAR TRAZOS/OBSTÁCULOS
    ctx.strokeStyle = '#eab308'; // Amarillo Arcade
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawnPaths.forEach(path => {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for(let i=1; i<path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#eab308';
        ctx.stroke();
        ctx.shadowBlur = 0;
    });

    ctx.restore();
    requestAnimationFrame(render);
}

// ==========================================
// LÓGICA DE DIBUJO DE PISTAS (SOLO HOST)
// ==========================================
let isDrawing = false;
let mirrorMode = true;
let currentPath = [];
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas.getContext('2d');

function openDrawScreen() {
    showScreen('screen-draw');
    renderDrawCanvas();
}

function toggleMirror() {
    mirrorMode = !mirrorMode;
    document.getElementById('btn-mirror').innerText = mirrorMode ? "ESPEJO: ON" : "ESPEJO: OFF";
    document.getElementById('btn-mirror').style.background = mirrorMode ? "#3b82f6" : "#64748b";
    document.getElementById('btn-mirror').style.boxShadow = mirrorMode ? "0 4px 0 #2563eb" : "0 4px 0 #475569";
    renderDrawCanvas();
}

function clearDraw() {
    drawnPaths = [];
    renderDrawCanvas();
}

function saveDraw() {
    if (mirrorMode) {
        let mirroredPaths = [];
        drawnPaths.forEach(path => {
            // Rotación simétrica perfecta
            let mPath = path.map(p => ({ x: LOGICAL_W - p.x, y: LOGICAL_H - p.y }));
            mirroredPaths.push(mPath);
        });
        drawnPaths = drawnPaths.concat(mirroredPaths);
        // Desactivamos espejo visualmente porque ya baked
        mirrorMode = false;
        document.getElementById('btn-mirror').innerText = "ESPEJO: OFF";
        document.getElementById('btn-mirror').style.background = "#64748b";
        document.getElementById('btn-mirror').style.boxShadow = "0 4px 0 #475569";
    }
    showScreen('screen-lobby');
}

function getDrawCanvasPoint(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    let clientX = e.clientX || (e.touches && e.touches[0].clientX);
    let clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

drawCanvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    currentPath = [getDrawCanvasPoint(e)];
    drawnPaths.push(currentPath);
    renderDrawCanvas();
});

drawCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const pt = getDrawCanvasPoint(e);
    const lastPt = currentPath[currentPath.length - 1];
    // Evitar sobrecargar de puntos (mejor rendimiento en físicas)
    if (Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y) > 10) {
        currentPath.push(pt);
        renderDrawCanvas();
    }
});

drawCanvas.addEventListener('pointerup', () => isDrawing = false);
drawCanvas.addEventListener('pointercancel', () => isDrawing = false);
drawCanvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
drawCanvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

function renderDrawCanvas() {
    drawCtx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    
    // Dibujar fondo de referencia
    drawCtx.fillStyle = '#1e293b';
    drawCtx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    
    // Linea central
    drawCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    drawCtx.lineWidth = 5;
    drawCtx.beginPath(); drawCtx.moveTo(0, LOGICAL_H/2); drawCtx.lineTo(LOGICAL_W, LOGICAL_H/2); drawCtx.stroke();
    
    // Porterías referencia (300px en el centro)
    drawCtx.fillStyle = 'rgba(255, 71, 87, 0.3)'; drawCtx.fillRect(250, 0, 300, 40);
    drawCtx.fillStyle = 'rgba(55, 66, 250, 0.3)'; drawCtx.fillRect(250, LOGICAL_H-40, 300, 40);

    drawCtx.strokeStyle = '#eab308';
    drawCtx.lineWidth = 15;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    function drawPathsList(paths) {
        paths.forEach(path => {
            if (path.length < 2) return;
            drawCtx.beginPath();
            drawCtx.moveTo(path[0].x, path[0].y);
            for(let i=1; i<path.length; i++) drawCtx.lineTo(path[i].x, path[i].y);
            drawCtx.stroke();
        });
    }

    drawPathsList(drawnPaths);

    // Si espejo está ON, dibujar fantasma simétrico
    if (mirrorMode) {
        drawCtx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
        let mirrored = drawnPaths.map(path => path.map(p => ({ x: LOGICAL_W - p.x, y: LOGICAL_H - p.y })));
        drawPathsList(mirrored);
    }
}
