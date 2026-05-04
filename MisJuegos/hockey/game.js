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

// --- FÍSICAS (Solo Host) ---
let engine, world;
let puckBody;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Inicializar UI
document.getElementById('input-nick').value = myNick;

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
            players[peerId].targetX = data.x;
            players[peerId].targetY = data.y;
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
    Object.values(clientConns).forEach(c => c.send({ type: 'LOBBY_SYNC', list, teamColors }));
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
                
                if (other.label === 'goalA') {
                    scores.B++;
                    resetPuck();
                } else if (other.label === 'goalB') {
                    scores.A++;
                    resetPuck();
                }
            }
        });
    });

    // Bucle de Físicas
    setInterval(() => {
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
            }
        }

        Matter.Engine.update(engine, 1000 / 60);
        broadcastGameState();
    }, 1000 / 60);
}

function resetPuck() {
    Matter.Body.setPosition(puckBody, { x: LOGICAL_W/2, y: LOGICAL_H/2 });
    Matter.Body.setVelocity(puckBody, { x: 0, y: 0 });
    
    // Alguien anotó, actualizamos el UI en el Host inmediatamente
    document.getElementById('score-a').innerText = scores.A;
    document.getElementById('score-b').innerText = scores.B;
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
        // Instanciar los cuerpos físicos de todos los jugadores que están en el Lobby
        for (let id in players) {
            let p = players[id];
            // Equipo A defiende Arriba (y=0 a 600), Equipo B defiende Abajo (y=600 a 1200)
            let startY = p.team === 'A' ? 200 : LOGICAL_H - 200;
            
            p.body = Matter.Bodies.circle(LOGICAL_W/2, startY, 45, {
                restitution: 0.5,
                frictionAir: 0.1,
                density: 0.05 // Más pesado que el disco
            });
            Matter.World.add(world, p.body);
            p.targetY = startY; // Evitar que salgan volando al centro inicialmente
        }

        Object.values(clientConns).forEach(c => c.send({ type: 'START' }));
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

    ctx.restore();
    requestAnimationFrame(render);
}
