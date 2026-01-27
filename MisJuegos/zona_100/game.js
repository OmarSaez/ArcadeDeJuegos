/* --- MOTOR BÁSICO Y PERSONALIZACIÓN --- */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let gameState = 'MENU'; // MENU, PLAYING, PAUSED
let isHost = false;
let myId = null;

// Configuración visual y Mundo
const TILE_SIZE = 50;
const WORLD_W = 100;
const WORLD_H = 100;

// Game Cycles
let gameRound = 1;
let isDay = true; // Odd rounds are Day, Even are Night
let cycleTimer = 30; // Prep time start (30s)
let isPrepPhase = true;
let roundDuration = 120; // 2 minutes active round

// Entidades Globales
let bullets = [];
let acidProjectiles = []; // {x, y, vx, vy, life}
let firePatches = []; // {x, y, radius, life}
let zombies = [];
let drops = []; // {x, y, value, life}
let walls = []; // {x, y, type, hp}
let bonfire = {
    x: (WORLD_W * TILE_SIZE) / 2,
    y: (WORLD_H * TILE_SIZE) / 2,
    hp: 1000,
    maxHp: 1000,
    radius: 40
};

// Item Database
const ITEMS = {
    // Weapons
    'weapon_pistol': { name: 'Pistola', type: 'weapon', icon: '🔫', ammoType: 'ammo_pistol', dmg: 10, rate: 400 },
    'weapon_smg': { name: 'Subfusil', type: 'weapon', icon: '🖊️', ammoType: 'ammo_smg', dmg: 6, rate: 100 },
    'weapon_ar': { name: 'Metralleta', type: 'weapon', icon: '︻', ammoType: 'ammo_rifle', dmg: 15, rate: 150 },
    'weapon_shotgun': { name: 'Escopeta', type: 'weapon', icon: '💥', ammoType: 'ammo_shotgun', dmg: 10, rate: 800 }, // Needs logic for spread
    'weapon_sniper': { name: 'Francotirador', type: 'weapon', icon: '🔭', ammoType: 'ammo_rifle', dmg: 50, rate: 1500 },
    'weapon_grenade': { name: 'Granada', type: 'weapon', icon: '💣', ammoType: null }, // Needs throw logic
    'tool_hammer': { name: 'Martillo', type: 'tool', icon: '🔨' },

    // Ammo
    'ammo_pistol': { name: 'Balas Pequeñas', type: 'ammo', icon: '🔸' },
    'ammo_smg': { name: 'Balas Medianas', type: 'ammo', icon: '🔹' },
    'ammo_shotgun': { name: 'Cartuchos', type: 'ammo', icon: '🛑' },
    'ammo_rifle': { name: 'Balas Largas', type: 'ammo', icon: '🦴' },
    'ammo_fuel': { name: 'Combustible', type: 'ammo', icon: '🔥' },

    // Buildings
    'wall_wood': { name: 'Pared Madera', type: 'build', icon: '🪵' },
    'wall_door': { name: 'Puerta', type: 'build', icon: '🚪' },
    'chest_basic': { name: 'Cofre', type: 'build', icon: '📦' },
    'barrel_explosive': { name: 'Barril Expl.', type: 'build', icon: '🛢️' },
    'bed': { name: 'Cama', type: 'build', icon: '�️' },

    // Meds
    'medkit_small': { name: 'Venda (Botiquín Pequeño)', type: 'med', icon: '🩹', heal: 15 },
    'medkit_large': { name: 'Botiquín Grande', type: 'med', icon: '🧰', heal: 40 }
};

const SHOP_ITEMS = [
    { id: 'ammo_pistol', price: 10, amount: 40 },
    { id: 'ammo_smg', price: 15, amount: 40 },
    { id: 'ammo_shotgun', price: 20, amount: 10 },
    { id: 'ammo_rifle', price: 50, amount: 30 },
    { id: 'weapon_pistol', price: 100, amount: 1 },
    { id: 'weapon_smg', price: 300, amount: 1 },
    { id: 'weapon_shotgun', price: 250, amount: 1 },
    { id: 'weapon_ar', price: 500, amount: 1 },
    { id: 'wall_wood', price: 10, amount: 1 },
    { id: 'wall_door', price: 20, amount: 1 },
    { id: 'chest_basic', price: 100, amount: 1 },
    { id: 'medkit_small', price: 10, amount: 1 },
    { id: 'medkit_large', price: 20, amount: 1 }
];

// ASSETS CONFIGURATION
// Add your 200x200 png files to the 'assets' folder with these names:
const ASSETS_MAP = {
    // Entities
    'zombie_normal': 'assets/zombies/zombie_normal.png',
    'zombie_fast': 'assets/zombies/zombie_fast.png',
    'zombie_strong': 'assets/zombies/zombie_strong.png',
    'zombie_tank': 'assets/zombies/zombie_tank.png',
    'zombie_spitter': 'assets/zombies/zombie_spitter.png',
    'zombie_explosive': 'assets/zombies/zombie_explosive.png',
    'zombie_fire': 'assets/zombies/zombie_fire.png',
    'zombie_giant': 'assets/zombies/zombie_gigant.png',

    // Generic fallback
    'zombie': 'assets/zombies/zombie_normal.png',

    'money': 'assets/coin.png',
    'money_stack': 'assets/coin_stack.png',

    // Weapons
    'weapon_pistol': 'assets/weapon_pistol.png',
    'weapon_smg': 'assets/weapon_smg.png',
    'weapon_ar': 'assets/weapon_ar.png',
    'weapon_shotgun': 'assets/weapon_shotgun.png',
    'weapon_sniper': 'assets/weapon_sniper.png',
    'weapon_grenade': 'assets/grenade.png',
    'tool_hammer': 'assets/hammer.png',

    // Ammo
    'ammo_pistol': 'assets/ammo_pistol.png',
    'ammo_smg': 'assets/ammo_medium.png',
    'ammo_shotgun': 'assets/ammo_shotgun.png',
    'ammo_rifle': 'assets/ammo_rifle.png',
    'ammo_fuel': 'assets/fuel_can.png',

    // Buildings
    'wall_wood': 'assets/wall_wood.png',
    'wall_door_closed': 'assets/door_closed.png',
    'wall_door_open': 'assets/door_open.png',
    'chest_basic': 'assets/chest.png',
    'barrel_explosive': 'assets/barrel_explosive.png',
    'bed': 'assets/bed.png', // Respawn point?

    // Meds
    'medkit_small': 'assets/medkit_small.png',
    'medkit_large': 'assets/medkit_large.png'
};

// ZOMBIE CONFIGURATION (STATS)
// Adjust these values to balance the game!
// radius: Collision size (hitbox).
// visualScale: How big the image looks (multiplier of radius).
const ZOMBIE_STATS = {
    'normal': { hp: 30, speed: 1.2, radius: 15, damage: 10, value: 1, visualScale: 3.5, color: '#4caf50' },
    'fast': { hp: 15, speed: 3.0, radius: 12, damage: 5, value: 2, visualScale: 3.5, color: '#ff9800' },
    'strong': { hp: 60, speed: 0.9, radius: 20, damage: 20, value: 3, visualScale: 3.5, color: '#795548' },
    'tank': { hp: 200, speed: 0.6, radius: 35, damage: 30, value: 10, visualScale: 4.0, color: '#3e2723' },
    'spitter': { hp: 40, speed: 1.2, radius: 16, damage: 15, value: 3, visualScale: 3.5, color: '#cddc39' },
    'explosive': { hp: 20, speed: 1.5, radius: 16, damage: 50, value: 2, visualScale: 3.5, color: '#f44336' },
    'fire': { hp: 50, speed: 1.2, radius: 18, damage: 10, value: 3, visualScale: 3.5, color: '#ff5722' },
    'giant': { hp: 800, speed: 0.4, radius: 50, damage: 45, value: 50, visualScale: 6.0, color: '#212121' }
};

// Global State
const loadedAssets = {}; // Stores Image objects

function loadAssets() {
    console.log("Loading assets...");
    const promises = Object.keys(ASSETS_MAP).map(key => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = ASSETS_MAP[key];
            img.onload = () => {
                loadedAssets[key] = img;
                console.log(`Loaded: ${key}`);
                resolve();
            };
            img.onerror = () => {
                // Not fatal, just won't have image
                console.log(`Missing asset: ${key} (Using default)`);
                resolve();
            };
        });
    });
    // We don't strictly wait for all to start game, assets pop in when loaded.
    // But for "polish", we could wait. For now, non-blocking is better for dev.
    Promise.all(promises).then(() => console.log("All assets processed."));
}

// Call immediately or in init
loadAssets();

// Vista (Cámara)
let camera = { x: 0, y: 0 };
let isShopOpen = false;

// Jugador Local
let player = {
    x: WORLD_W * TILE_SIZE / 2,
    y: WORLD_H * TILE_SIZE / 2 + 100,
    angle: 0,
    visual: {
        skin: '#ffdbac',
        shirt: '#3b82f6',
        hairStyle: 'short',
        hairColor: '#000000',
        nick: 'Sobreviviente'
    },
    // Inicializar con Pistola y Municion
    inventory: [
        { id: 'weapon_pistol', count: 1 },
        { id: 'ammo_pistol', count: 100 },
        { id: 'ammo_pistol', count: 100 },
        { id: 'ammo_pistol', count: 50 },
        null
    ],
    backpack: new Array(25).fill(null),
    stats: { hp: 100, money: 100, skillPoints: 0 },
    selectedSlot: 0,
    selectedSlot: 0,
    lastShot: 0,
    pickupRadius: 60,
    isDead: false
};

/* --- 1. PERSONALIZACIÓN / PREVIEW (Igual) --- */
const previewCanvas = document.getElementById('preview-canvas');
const pCtx = previewCanvas.getContext('2d');

function updatePreview() {
    const skin = document.getElementById('p-skin').value;
    const shirt = document.getElementById('p-shirt').value;
    const hairStyle = document.getElementById('p-hair-style').value;
    const hairColor = document.getElementById('p-hair-color').value;

    player.visual.skin = skin;
    player.visual.shirt = shirt;
    player.visual.hairStyle = hairStyle;
    player.visual.hairColor = hairColor;
    player.visual.nick = document.getElementById('p-nick').value;
    // Add HP to visual for rendering convenience (though logic uses stats)
    player.visual.hp = player.stats.hp;
    player._lastUpdateSent = 0;

    // Draw Preview
    pCtx.clearRect(0, 0, 100, 100);
    pCtx.fillStyle = '#333'; // Background
    pCtx.fillRect(0, 0, 100, 100);

    // Draw centered character in preview
    drawCharacter(pCtx, 50, 50, Math.PI / 2, player.visual, 20);
}



function drawCharacter(context, x, y, angle, visual, radius) {
    context.save();
    context.translate(x, y);
    context.rotate(angle - Math.PI / 2); // Correction: -90 degrees so 0 radians = Right

    // Polera
    context.fillStyle = visual.shirt;
    context.fillRect(-radius, -radius, radius * 2, radius * 2);

    // Cabeza
    context.beginPath();
    context.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
    context.fillStyle = visual.skin;
    context.fill();
    context.stroke();

    // Pelo
    context.fillStyle = visual.hairColor;
    if (visual.hairStyle === 'short') {
        context.beginPath();
        // Top half only (Math.PI to 2*Math.PI)
        context.arc(0, 0, radius * 0.9, Math.PI, Math.PI * 2);
        context.fill();
    } else if (visual.hairStyle === 'long') {
        context.beginPath();
        // Top half base
        context.arc(0, 0, radius * 1.0, Math.PI, Math.PI * 2);
        context.fill();
        // Long Sides (avoiding center face)
        context.beginPath();
        // Left Side
        context.moveTo(-radius * 0.9, 0);
        context.lineTo(-radius * 1.1, radius * 1.5);
        context.lineTo(-radius * 0.5, radius * 1.5);
        context.lineTo(-radius * 0.4, 0);
        context.fill();
        // Right Side
        context.beginPath();
        context.moveTo(radius * 0.9, 0);
        context.lineTo(radius * 1.1, radius * 1.5);
        context.lineTo(radius * 0.5, radius * 1.5);
        context.lineTo(radius * 0.4, 0);
        context.fill();
    } else if (visual.hairStyle === 'punk') {
        context.beginPath();
        // Strip from Back (-R) to Forehead (0.3R)
        const w = radius * 0.4;
        const h = radius * 1.3;
        const x = -w / 2;
        const y = -radius;
        context.roundRect ? context.roundRect(x, y, w, h, 5) : context.fillRect(x, y, w, h);
        context.fill();
    } else if (visual.hairStyle === 'afro') {
        context.beginPath();
        // Big circle shifted UP to expose face bottom
        context.arc(0, -radius * 0.55, radius * 1.1, 0, Math.PI * 2);
        context.fill();
    }

    // Manos y Arma
    context.fillStyle = visual.skin;

    // Calcular posición de las manos (al frente)
    // Mano Izquierda
    context.beginPath();
    context.arc(radius * 0.4, radius * 0.8, radius * 0.25, 0, Math.PI * 2);
    context.fill();

    // Mano Derecha
    context.beginPath();
    context.arc(-radius * 0.4, radius * 0.8, radius * 0.25, 0, Math.PI * 2);
    context.fill();

    // HP Bar (Above Head)
    if (visual.hp !== undefined) {
        const barW = 40;
        const barH = 5;
        const pct = Math.max(0, visual.hp / 100);

        context.save();
        context.translate(0, -radius - 15);
        // Rotate back to be horizontal regardless of player rotation?
        // Player is rotated by `angle` in context. We want bar to be relative to screen or player?
        // If we want it "floating above head" aligned with player, keep it here.
        // But `drawCharacter` has rotated context! So bar will rotate with player.
        // Usually bars stay horizontal.
        context.rotate(-(angle - Math.PI / 2)); // Counter-rotate to keep bar horizontal

        context.fillStyle = 'red';
        context.fillRect(-barW / 2, 0, barW, barH);
        context.fillStyle = '#4caf50';
        context.fillRect(-barW / 2, 0, barW * pct, barH);

        // Nickname
        context.fillStyle = 'white';
        context.font = '10px Arial';
        context.textAlign = 'center';
        context.fillText(visual.nick, 0, -5);

        context.restore();
    }

    // Arma / Item en mano
    if (visual.activeItem) {
        context.save();
        context.translate(0, radius * 1.0); // Al frente

        // Si es un arma o item visible
        if (ITEMS[visual.activeItem.id]) {
            const itemData = ITEMS[visual.activeItem.id];

            // Dibujar algo representativo (rectángulo simple o icono)
            context.fillStyle = '#555';
            if (itemData.type === 'weapon') {
                context.fillRect(-5, -5, 10, 25); // Cañón del arma
            } else if (itemData.type === 'build') {
                context.fillStyle = '#8d6e63';
                context.fillRect(-8, -8, 16, 16); // Bloque pequeño
            }

            // Opcional: Dibujar el icono (emoji)
            context.font = '15px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(itemData.icon, 0, 0);
        }
        context.restore();
    }

    context.restore();
}


updatePreview();

/* --- 2. GAME LOGIC --- */
function initGame(mode) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    gameState = 'PLAYING';
    isHost = (mode === 'HOST');
    resize();
    window.addEventListener('resize', resize);

    if (isHost) {
        myId = generateId(); // Helper or random string
        setupHost();
    } else {
        setupClient();
    }
}

function generateId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O/0 or I/1 to avoid confusion
    let result = 'Z100-';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// --- P2P NETWORK ---
let peer;
let connections = []; // Host: list of client conns
let serverConn; // Client: conn to host
let remotePlayers = {}; // Dictionary of other players
let lastSlowUpdate = 0;



function setupHost() {
    const shortId = generateId(); // Z100-XXXX
    peer = new Peer(shortId, { debug: 1 });
    peer.on('open', (id) => {
        myId = id;
        console.log('Host ID:', id);
        document.getElementById('ui-money').innerText = player.stats.money;
        // Display in HUD
        // HUD Code removed as requested
        // const codeDisplay = document.getElementById('room-code-display');

        // Add self to players list if managing server-side state logic

        // Add self to players list if managing server-side state logic
        remotePlayers[myId] = player;

        // Start Broadcast Loop
        setInterval(broadcastState, 50); // 20 updates/sec
        // Start Game Loop logic
        setInterval(gameCycleLoop, 1000);
        gameLoop();
    });

    peer.on('connection', (conn) => {
        connections.push(conn);
        conn.on('data', (data) => {
            handleClientData(conn.peer, data);
        });
        conn.on('close', () => {
            console.log("Client disconnected", conn.peer);
            delete remotePlayers[conn.peer];
            connections = connections.filter(c => c !== conn);
        });
    });
}

function setupClient() {
    const hostId = document.getElementById('join-code').value;
    if (!hostId) { alert("Ingresa un código"); return; }

    // Prefix lookup
    const fullId = 'Z100-' + hostId.toUpperCase().replace('Z100-', '');

    peer = new Peer(null, { debug: 1 });
    peer.on('open', (id) => {
        myId = id;
        document.getElementById('ui-money').innerText = player.stats.money;
        serverConn = peer.connect(fullId);

        serverConn.on('open', () => {
            console.log("Connected to Host");
            // HUD Code removed as requested
            gameLoop(); // Start Render Loop
        });

        serverConn.on('data', (data) => {
            handleServerData(data);
        });
    });
}

function broadcastState() {
    const now = Date.now();
    // 1. FAST UPDATE (50ms, 20FPS) - Movement & Combat

    // Prepare Players
    const packedPlayers = {};
    const allIds = Object.keys(remotePlayers);
    allIds.push(myId); // inclusive self

    allIds.forEach(pid => {
        const p = (pid === myId) ? player : remotePlayers[pid];
        if (!p) return;
        packedPlayers[pid] = {
            x: Math.round(p.x),
            y: Math.round(p.y),
            angle: parseFloat(p.angle.toFixed(2)),
            visual: p.visual,
            isDead: p.isDead
        };
    });

    const fastState = {
        type: 'FAST_UPDATE',
        p: packedPlayers,
        z: zombies.map(z => ({
            x: Math.round(z.x),
            y: Math.round(z.y),
            hp: z.hp,
            maxHp: 30, // assuming standard for bar
            c: z.color || '#4caf50',
            r: z.radius || 15
        })),
        b: bullets.map(b => ({ x: Math.round(b.x), y: Math.round(b.y) })),
        t: now
    };

    connections.forEach(c => { if (c.open) c.send(fastState); });

    // 2. SLOW UPDATE (1000ms, 1FPS) - World/Entitites/Sync
    if (now - lastSlowUpdate > 1000) {
        lastSlowUpdate = now;
        const slowState = {
            type: 'SLOW_UPDATE',
            walls: walls,
            drops: drops,
            cycle: { round: gameRound, timer: cycleTimer, phase: isPrepPhase, isDay: isDay },
            bonfireHp: bonfire.hp,
            isPaused: (gameState === 'PAUSED')
        };
        connections.forEach(c => { if (c.open) c.send(slowState); });
    }
}

function handleClientData(clientId, data) {
    // Host receives Actions/Inputs from Client
    if (data.type === 'ACTION_REVIVE') {
        const targetId = data.targetId;
        revivePlayer(targetId);
    }

    if (data.type === 'PLAYER_UPDATE') {
        remotePlayers[clientId] = data.player; // Naive sync: Trust client position
        // Ideally: Client sends inputs, Host simulates. 
        // For simple Arcade: Trust client coords ok for now.
    }
    // Handle other events like 'SHOOT', 'BUILD' if logic needs to be central
    if (data.type === 'ACTION_SHOOT') {
        const b = data.bullet;
        // Validate?
        bullets.push(b);
    }
    if (data.type === 'ACTION_BUILD') {
        const { item, x, y } = data;
        // Check collisions on Host
        const existing = walls.find(w => w.x === x && w.y === y);
        if (!existing) {
            let initHp = 200;
            if (item === 'wall_wood') initHp = 400;
            if (item === 'wall_door') initHp = 300;
            walls.push({ x: x, y: y, type: item, hp: initHp, isOpen: false });
        }
    }
    if (data.type === 'REQUEST_PAUSE_TOGGLE') {
        togglePause(false);
    }
}

function handleServerData(data) {
    if (data.type === 'FAST_UPDATE') {
        if (data.zombies) zombies = data.zombies;
        if (data.bullets) bullets = data.bullets;
        if (data.drops) drops = data.drops;
        return;
    }

    if (data.type === 'SLOW_UPDATE') {
        // Sync Players
        if (data.p) {
            Object.keys(data.p).forEach(pid => {
                if (pid !== myId) {
                    if (!remotePlayers[pid]) remotePlayers[pid] = {};
                    Object.assign(remotePlayers[pid], data.p[pid]);
                }
            });
        }
        // Sync World
        if (data.walls) walls = data.walls;
        if (data.drops) drops = data.drops; // Sync drops too
        if (data.bonfireHp !== undefined) bonfire.hp = data.bonfireHp; // Sync bonfireHP

        // Sync Cycle
        if (data.cycle) {
            gameRound = data.cycle.round;
            cycleTimer = data.cycle.timer;
            isPrepPhase = data.cycle.phase;
            isDay = data.cycle.isDay;

            const uiDay = document.getElementById('ui-day');
            if (uiDay) uiDay.innerText = Math.ceil(gameRound / 2);
            if (window.updateCycleUI) window.updateCycleUI();
        } else if (data.day !== undefined) {
            gameRound = data.day;
        }

        // Pause Sync
        if (data.isPaused !== undefined) {
            const serverState = data.isPaused ? 'PAUSED' : 'PLAYING';
            if (gameState !== serverState) {
                gameState = serverState;
                updatePauseUI();
            }
        }
        return;
    }

    if (data.type === 'EVENT_DAMAGE') {
        const dmg = data.amount;
        player.stats.hp = Math.max(0, player.stats.hp - dmg);
        // Visual Update
        document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
        if (player.stats.hp <= 0) {
            player.isDead = true;
            document.getElementById('ui-hp').innerText = "MUERTO - Espera rescate";
        }
        return;
    }

    if (data.type === 'EVENT_GAMEOVER') {
        alert("GAME OVER - EL EQUIPO HA CAÍDO");
        location.reload();
        return;
    }

    if (data.type === 'EVENT_RESPAWN') {
        player.isDead = false;
        player.stats.hp = 100;
        document.getElementById('ui-hp').innerText = `HP: 100%`;
        alert("¡HAS SIDO REVIVIDO!");
        return;
    }
}




function gameCycleLoop() {
    if (gameState !== 'PLAYING') return;

    if (cycleTimer > 0) {
        cycleTimer--;
    } else {
        // Timer ended
        if (isPrepPhase) {
            // End Prep -> Start Round
            isPrepPhase = false;
            cycleTimer = roundDuration;
            showTitle(`HORDA ${gameRound} SE ACERCA`, '#ff5252'); // Red
            spawnZombie(); // First spawn
        } else {
            // End Round -> Start Prep for Next Round
            isPrepPhase = true;
            cycleTimer = 30;
            showTitle(`RONDA ${gameRound} COMPLETADA`, '#4caf50'); // Green
            gameRound++;
            isDay = (gameRound % 2 !== 0);

            // Adjust Day Number (Every 2 rounds = 1 full day)
            // Round 1 (Day), Round 2 (Night) -> Day 1
            // Round 3 (Day) -> Day 2

            const dayNum = Math.ceil(gameRound / 2);
            document.getElementById('ui-day').innerText = dayNum;

            // Grant Skill Point if a full day completed (after even rounds)
            // If we just became Round 3 (Odd), we finished R1 & R2.
            if (gameRound % 2 !== 0) {
                player.stats.skillPoints++;
                showTitle(`¡DÍA COMPLETADO!\n+1 PUNTO DE HABILIDAD`, '#ffd700'); // Gold
                // Removed alert to avoid pausing game flow
            }
        }
    }

    // Auto Spawn during active round
    if (!isPrepPhase) {
        if (cycleTimer % 2 === 0) spawnZombie(); // Spawn every 2s
    }

    updateCycleUI();
    updateZombieCounter();
}

function updateZombieCounter() {
    let el = document.getElementById('zombie-counter');
    if (!el) {
        el = document.createElement('div');
        el.id = 'zombie-counter';
        el.style.position = 'fixed';
        el.style.bottom = '20px';
        el.style.right = '20px';
        el.style.color = '#2e7d32'; // Dark Green
        el.style.fontSize = '20px';
        el.style.fontWeight = 'bold';
        el.style.backgroundColor = 'rgba(0,0,0,0.5)';
        el.style.padding = '10px';
        el.style.borderRadius = '5px';
        document.body.appendChild(el);
    }
    el.innerText = `ZOMBIES VIVOS: ${zombies.length}`;
}

function showTitle(text, color = 'white') {
    const el = document.createElement('div');
    el.innerText = text;
    el.style.position = 'fixed';
    el.style.top = '20%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.fontSize = '40px';
    el.style.color = color;
    el.style.fontWeight = 'bold';
    el.style.textShadow = '2px 2px 4px black';
    el.style.zIndex = '2000';
    el.style.pointerEvents = 'none';
    el.style.animation = 'fadeOut 3s forwards';
    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 3000);
}

// CSS Animation for fadeOut
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeOut {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
}`;
document.head.appendChild(style);

function updateCycleUI() {
    const timeDisplay = document.getElementById('ui-time');
    const overlay = document.getElementById('darkness-overlay');

    // Cycle Text
    let phaseText = "";
    if (isPrepPhase) {
        phaseText = `PREPARACIÓN: ${cycleTimer}s`;
        overlay.style.opacity = isDay ? 0 : 0.5; // Keep night/day bg during prep? 
        // Logic: Prep allows visibility. Let's make prep always bright or keep previous?
        // User wants: Prep -> Round.
        // Let's Keep Day/Night visual consistent with the upcoming round or current?
        // "30 segundos por cada ronda para poder preparar las cosas"
        overlay.style.opacity = isDay ? 0 : 0.3; // Lighter night during prep
    } else {
        // Active Round
        phaseText = isDay ? `DÍA (R${gameRound}): ${cycleTimer}s` : `NOCHE (R${gameRound}): ${cycleTimer}s`;
        overlay.style.opacity = isDay ? 0 : 0.7; // Darker night
    }
    timeDisplay.innerText = phaseText;
}

function skipPrep() {
    if (isPrepPhase) {
        cycleTimer = 0;
        updateCycleUI();
        // gameCycleLoop will handle transition on next tick or force it?
        // Let's force it to feel instant
        gameCycleLoop(); // Trigger transition immediately
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Input
const keys = {};
const mouse = { x: 0, y: 0 };

window.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.code === 'Tab') { e.preventDefault(); toggleBackpack(); }
    if (e.key === 't' || e.key === 'T') toggleShop();
    if (e.key === 'Escape') togglePause(false);
    if (['1', '2', '3', '4', '5'].includes(e.key)) selectHotbar(parseInt(e.key) - 1);
});
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mousedown', (e) => {
    if (gameState === 'PLAYING' && !isShopOpen) {
        if (e.button === 0) useItem();
        if (e.button === 2) interactWorld();
    }
});
window.addEventListener('contextmenu', e => e.preventDefault());

function selectHotbar(index) {
    player.selectedSlot = index;
    renderInventoryUI();
    updateAmmoUI();
}

function getAmmoCount(type) {
    let count = 0;
    // Check Hotbar
    player.inventory.forEach(item => {
        if (item && item.id === type) count += item.count;
    });
    // Check Backpack
    player.backpack.forEach(item => {
        if (item && item.id === type) count += item.count;
    });
    return count;
}

function consumeAmmo(type) {
    // Consume from Hotbar first, then Backpack
    const lists = [player.inventory, player.backpack];
    for (let list of lists) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].id === type) {
                list[i].count--;
                if (list[i].count <= 0) list[i] = null;
                renderInventoryUI();
                updateAmmoUI();
                return true;
            }
        }
    }
    return false;
}

function updateAmmoUI() {
    const heldItem = player.inventory[player.selectedSlot];
    const uiAmmo = document.getElementById('ui-ammo');

    if (heldItem && ITEMS[heldItem.id].type === 'weapon') {
        const ammoType = ITEMS[heldItem.id].ammoType;
        const total = getAmmoCount(ammoType);
        const typeName = ITEMS[ammoType].name;
        // Cortar nombre si es muy largo
        const shortName = typeName.split(' ')[1] || typeName;
        uiAmmo.innerText = `${total} (${shortName})`;
    } else {
        uiAmmo.innerText = '-';
    }
}

function useItem() {
    // Priority: Interaction (Doors)
    if (interactWorld()) return;

    const heldItem = player.inventory[player.selectedSlot];
    if (!heldItem) return;

    const data = ITEMS[heldItem.id];
    if (data.type === 'weapon') shoot();
    else if (data.type === 'build') placeStructure(heldItem);
    else if (data.type === 'med') useMed(heldItem, data);
}

function useMed(item, data) {
    if (player.stats.hp >= 100) return;
    player.stats.hp = Math.min(100, player.stats.hp + data.heal);
    document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;

    item.count--;
    if (item.count <= 0) player.inventory[player.selectedSlot] = null;
    renderInventoryUI();
}

function interactWorld() {
    // Toggle Doors
    const mx = mouse.x + camera.x;
    const my = mouse.y + camera.y;

    // Check if clicking on a door within range
    const range = 100;
    const target = walls.find(w => {
        const dist = Math.hypot(w.x + TILE_SIZE / 2 - (player.x), w.y + TILE_SIZE / 2 - (player.y));
        return dist < range &&
            mx > w.x && mx < w.x + TILE_SIZE &&
            my > w.y && my < w.y + TILE_SIZE &&
            w.type === 'wall_door';
    });



    if (target) {
        if (isHost) {
            target.isOpen = !target.isOpen;
        } else if (serverConn && serverConn.open) {
            // Client Request
            serverConn.send({
                type: 'ACTION_INTERACT',
                x: target.x,
                y: target.y
            });
            // Predict? Maybe wait for server to prevent "ghost open"
            // target.isOpen = !target.isOpen; 
        } else {
            // Offline
            target.isOpen = !target.isOpen;
        }
        return true; // Interaction successful
    }
    return false; // No interaction
}


function placeStructure(item) {
    // Calculate Grid Position
    const mx = mouse.x + camera.x;
    const my = mouse.y + camera.y;
    const gx = Math.floor(mx / TILE_SIZE) * TILE_SIZE;
    const gy = Math.floor(my / TILE_SIZE) * TILE_SIZE;

    // Send Build Request if Client
    if (!isHost && serverConn && serverConn.open) {
        // Optimistic: Deduct item locally? Yes, for responsive UI.
        // But actual wall creation happens on Host.

        serverConn.send({
            type: 'ACTION_BUILD',
            item: item.id,
            x: gx,
            y: gy
        });

        // Consume locally too
        item.count--;
        if (item.count <= 0) player.inventory[player.selectedSlot] = null;
        renderInventoryUI();
        return;
    }


    // Host Logic checks



    // Check Range (e.g., 200px)
    const dist = Math.hypot(gx + TILE_SIZE / 2 - player.x, gy + TILE_SIZE / 2 - player.y);
    if (dist > 200) return;

    // Check if Wall exists
    const existing = walls.find(w => w.x === gx && w.y === gy);
    if (existing) return;

    // Check Collision with Player (prevent getting stuck)
    const pRect = { x: player.x - 20, y: player.y - 20, w: 40, h: 40 };
    // Wall rect
    if (
        pRect.x < gx + TILE_SIZE &&
        pRect.x + pRect.w > gx &&
        pRect.y < gy + TILE_SIZE &&
        pRect.y + pRect.h > gy
    ) {
        return; // Cannot build on self
    }

    // Place
    // Base HP 200 -> Double to 400 for walls
    let initHp = 200;
    if (item.id === 'wall_wood') initHp = 400;
    if (item.id === 'wall_door') initHp = 300;

    walls.push({ x: gx, y: gy, type: item.id, hp: initHp, isOpen: false });

    // Consume Item
    item.count--;
    if (item.count <= 0) player.inventory[player.selectedSlot] = null;
    renderInventoryUI();
}

function shoot() {
    if (Date.now() - player.lastShot < 200) return;

    const heldItem = player.inventory[player.selectedSlot];
    if (!heldItem || ITEMS[heldItem.id].type !== 'weapon') return;

    // Check Ammo
    const ammoType = ITEMS[heldItem.id].ammoType;
    if (getAmmoCount(ammoType) <= 0) {
        // Click sound or something?
        return;
    }

    consumeAmmo(ammoType);
    player.lastShot = Date.now();

    // Spawn Bullet
    const bullet = {
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 15,
        life: 100,
        owner: myId
    };

    if (isHost) {
        bullets.push(bullet);
    } else if (serverConn && serverConn.open) {
        // Client: Send Shoot Action
        serverConn.send({
            type: 'ACTION_SHOOT',
            bullet: bullet
        });
        // Optional: Local visual prediction (ghost bullet)? 
        // For accurate sync, better to wait for server update or add "local only" bullet that disappears?
        // Let's rely on Fast Update (50ms is quick enough to see bullet spawn)
    }
}

function spawnZombie() {
    if (gameState !== 'PLAYING') return;
    if (isPrepPhase) return; // Strict check

    let zx, zy;
    if (Math.random() < 0.5) {
        zx = Math.random() < 0.5 ? 0 : WORLD_W * TILE_SIZE;
        zy = Math.random() * (WORLD_H * TILE_SIZE);
    } else {
        zx = Math.random() * (WORLD_W * TILE_SIZE);
        zy = Math.random() < 0.5 ? 0 : WORLD_H * TILE_SIZE;
    }
    // Use configuration
    const keys = Object.keys(ZOMBIE_STATS);
    const typeId = keys[Math.floor(Math.random() * keys.length)];
    const stats = ZOMBIE_STATS[typeId];

    zombies.push({
        x: zx,
        y: zy,
        hp: stats.hp,
        speed: stats.speed * (0.8 + Math.random() * 0.4), // Slight speed var
        radius: stats.radius,
        color: stats.color,
        type: typeId,
        lastAttack: 0
    });
}

function update() {
    if (gameState !== 'PLAYING') return;

    // Movement Logic (Everyone runs this for themselves)
    if (player.isDead) return;

    const speed = 4;
    let dx = 0; let dy = 0;
    if (keys['w']) dy = -speed;
    if (keys['s']) dy = speed;
    if (keys['a']) dx = -speed;
    if (keys['d']) dx = speed;

    if (!checkWallCollision(player.x + dx, player.y)) player.x += dx;
    if (!checkWallCollision(player.x, player.y + dy)) player.y += dy;

    const screenPlayerX = player.x - camera.x;
    const screenPlayerY = player.y - camera.y;
    player.angle = Math.atan2(mouse.y - screenPlayerY, mouse.x - screenPlayerX);

    // Send Update to Server if Client
    if (!isHost && serverConn && serverConn.open) {
        // Throttle to ~35 FPS (approx 28ms)
        const now = Date.now();
        if (now - (player._lastUpdateSent || 0) > 28) {
            player._lastUpdateSent = now;

            // Update local visual HP for sending
            player.visual.hp = player.stats.hp;
            const held = player.inventory[player.selectedSlot];
            player.visual.activeItem = held ? { id: held.id } : null;

            serverConn.send({
                type: 'PLAYER_UPDATE',
                player: {
                    x: Math.round(player.x), // Send rounded to save bytes
                    y: Math.round(player.y),
                    angle: parseFloat(player.angle.toFixed(2)),
                    visual: player.visual,
                    isDead: player.isDead
                }
            });
        }
    }

    // Host Only Logic: Zombies, Bullets, Collisions
    if (isHost) {
        player.visual.hp = player.stats.hp; // Ensure host visual has HP too
        const held = player.inventory[player.selectedSlot];
        player.visual.activeItem = held ? { id: held.id } : null;

        // ... (Existing update logic for zombies, bullets, etc)
        updateGameWorld();
    }

    // Camera always follows self
    const targetCamX = player.x - canvas.width / 2;
    const targetCamY = player.y - canvas.height / 2;
    camera.x += (targetCamX - camera.x) * 0.1;
    camera.y += (targetCamY - camera.y) * 0.1;
}

function updateGameWorld() {
    // Spitter Logic
    zombies.forEach((z, i) => {
        if (z.isDead) { // Remove dead marked
            zombies.splice(i, 1);
            return;
        }

        if (z.type === 'spitter') {
            // Find target
            // Reuse closestTarget logic or just use global target ref if calculated
            // We'll recalculate closest simple distance
            let target = player; // Default
            // Check remotes... (Simplified for now, aims at Host or closest found in loop)

            const dist = Math.hypot(target.x - z.x, target.y - z.y);
            if (dist < 400 && (!z.lastAttack || Date.now() - z.lastAttack > 3000)) {
                // Spit!
                const angle = Math.atan2(target.y - z.y, target.x - z.x);
                acidProjectiles.push({
                    x: z.x, y: z.y,
                    vx: Math.cos(angle) * 6,
                    vy: Math.sin(angle) * 6,
                    life: 100 // frames
                });
                z.lastAttack = Date.now();
            }
        }
    });

    // Update Projectiles
    acidProjectiles.forEach((a, i) => {
        a.x += a.vx;
        a.y += a.vy;
        a.life--;
        // Hit Player?
        if (Math.hypot(a.x - player.x, a.y - player.y) < 20) {
            player.stats.hp -= 15;
            document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
            a.life = 0;
            // Visual Splat code?
        }
        // Hit Walls?
        if (checkWallCollision(a.x, a.y, 5)) a.life = 0;
    });
    acidProjectiles = acidProjectiles.filter(a => a.life > 0);

    firePatches.forEach((f, i) => {
        f.life--;
        // Damage player standing in it
        if (Math.hypot(f.x - player.x, f.y - player.y) < f.radius) {
            player.stats.hp -= 0.1; // Fast tick damage
            document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
        }
    });
    firePatches = firePatches.filter(f => f.life > 0);

    // Zombies
    zombies.forEach((z, i) => {
        // Aggro Logic: Find closest player (or bonfire)
        let closestTarget = bonfire;
        let minD = Math.hypot(bonfire.x - z.x, bonfire.y - z.y);

        // Check Host
        const distToHost = Math.hypot(player.x - z.x, player.y - z.y);
        if (distToHost < minD) {
            minD = distToHost;
            closestTarget = player;
        }

        // Check Remote Players
        // Using `remotePlayers` dict from Host
        Object.keys(remotePlayers).forEach(pid => {
            const rp = remotePlayers[pid];
            if (rp) {
                const d = Math.hypot(rp.x - z.x, rp.y - z.y);
                if (d < minD) {
                    minD = d;
                    closestTarget = rp;
                    // We need to know WHO this is to damage them
                    closestTarget._id = pid;
                }
            }
        });

        let target = closestTarget;


        // Collision logic with other zombies
        let pushX = 0;
        let pushY = 0;

        zombies.forEach((other, j) => {
            if (i === j) return;
            const dz = Math.hypot(z.x - other.x, z.y - other.y);
            const minDist = z.radius + other.radius;
            if (dz < minDist && dz > 0) {
                const pushAngle = Math.atan2(z.y - other.y, z.x - other.x);
                const force = (minDist - dz) / 2;
                pushX += Math.cos(pushAngle) * force * 0.1;
                pushY += Math.sin(pushAngle) * force * 0.1;
            }
        });

        // Zombie - Player Collision & Damage
        // Check collision with ALL targets (Host + Clients)
        // We already determined `target` above, but let's check basic collision circle

        // 1. Check Host Collision (Local Player)
        const dp = Math.hypot(z.x - player.x, z.y - player.y);

        // EXPLOSIVE ZOMBIE CHECK
        if (z.type === 'explosive' && dp < z.radius + 40) {
            triggerExplosion(z.x, z.y);
            z.hp = 0;
            z.isDead = true;
        }

        // Normal Attack Logic
        if (!z.isDead && dp < z.radius + 20) {
            if (!z.lastAttack || Date.now() - z.lastAttack > 1000) {
                const zStat = ZOMBIE_STATS[z.type || 'normal'];
                const dmg = zStat ? zStat.damage : 10;
                player.stats.hp -= dmg;
                document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
                z.lastAttack = Date.now();
                if (player.stats.hp <= 0) {
                    player.isDead = true;
                    document.getElementById('ui-hp').innerText = "MUERTO - Espera rescate";
                    checkGameOver();
                }
            }
            // Pushback
            const pushAngle = Math.atan2(z.y - player.y, z.x - player.x);
            pushX += Math.cos(pushAngle) * 2;
            pushY += Math.sin(pushAngle) * 2;
        }

        // 2. Check Remote Players Collision
        Object.keys(remotePlayers).forEach(pid => {
            const rp = remotePlayers[pid];
            if (rp) {
                const d = Math.hypot(z.x - rp.x, z.y - rp.y);
                if (d < z.radius + 20) {
                    const conn = connections.find(c => c.peer === pid);
                    if (conn && conn.open) {
                        conn.send({ type: 'EVENT_DAMAGE', amount: 0.5 });
                    }
                }
            }
        });

        const angle = Math.atan2(target.y - z.y, target.x - z.x);
        let nextZX = z.x + Math.cos(angle) * z.speed + pushX;
        let nextZY = z.y + Math.sin(angle) * z.speed + pushY;

        // Wall Collision
        let colX = getWallCollision(nextZX, z.y, z.radius);
        if (colX) {
            if (colX.type === 'wall_door' && colX.isOpen) z.x = nextZX;
            else damageWall(colX);
        } else {
            z.x = nextZX;
        }

        let colY = getWallCollision(z.x, nextZY, z.radius);
        if (colY) {
            if (colY.type === 'wall_door' && colY.isOpen) z.y = nextZY;
            else damageWall(colY);
        } else {
            z.y = nextZY;
        }

        // Bonfire Attack
        const attackRange = 50 + z.radius + 5;
        if (target === bonfire) {
            // Use minD (distance to target) if target is bonfire
            if (minD < attackRange) {
                bonfire.hp -= 0.1;
                const pushOut = Math.atan2(z.y - bonfire.y, z.x - bonfire.x);
                z.x += Math.cos(pushOut) * 0.5;
                z.y += Math.sin(pushOut) * 0.5;
            }
        }
    });

    // Bullets
    bullets.forEach(b => {
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        b.life--;

        // Zombie Collision
        // Zombie Collision collision logic...
        // ... (Inside Bullet Loop)
        zombies.forEach((z, j) => {
            const dist = Math.hypot(b.x - z.x, b.y - z.y);
            if (dist < z.radius + 5) {
                z.hp -= (b.dmg || 10);
                b.life = 0;
                if (z.hp <= 0) {
                    // Death Logic
                    if (z.type === 'explosive') triggerExplosion(z.x, z.y);
                    if (z.type === 'fire' || z.type === 'zombie_fire') spawnFirePatch(z.x, z.y);

                    const dropVal = ZOMBIE_STATS[z.type] ? ZOMBIE_STATS[z.type].value : 1;
                    drops.push({ x: z.x, y: z.y, value: dropVal, life: 600 });
                    zombies.splice(j, 1);
                }
            }
        });

        // Wall Collision
        for (let w of walls) {
            if (
                b.x > w.x && b.x < w.x + TILE_SIZE &&
                b.y > w.y && b.y < w.y + TILE_SIZE
            ) {
                if (w.type === 'wall_door' && w.isOpen) continue;
                b.life = 0;
                damageWall(w);
                break;
            }
        }
    });
    bullets = bullets.filter(b => b.life > 0);

    // Drops Magnet
    drops.forEach((d, i) => {
        const dist = Math.hypot(player.x - d.x, player.y - d.y);
        if (dist < player.pickupRadius) {
            d.x += (player.x - d.x) * 0.1;
            d.y += (player.y - d.y) * 0.1;
        }
        if (dist < 20) {
            player.stats.money += d.value;
            document.getElementById('ui-money').innerText = player.stats.money;
            drops.splice(i, 1);
        }
    });
}

function checkWallCollision(x, y, radius = 20) {
    for (let w of walls) {
        // Circle vs AABB (Simplified to AABB vs AABB for now or closest point)
        // Check simple bounding box
        if (
            x + radius > w.x &&
            x - radius < w.x + TILE_SIZE &&
            y + radius > w.y &&
            y - radius < w.y + TILE_SIZE
        ) {
            // Should return wall object for detailed logic
            if (w.type === 'wall_door' && w.isOpen) return false;
            return true;
        }
    }
    return false;
}

function getWallCollision(x, y, radius = 20) {
    for (let w of walls) {
        if (
            x + radius > w.x &&
            x - radius < w.x + TILE_SIZE &&
            y + radius > w.y &&
            y - radius < w.y + TILE_SIZE
        ) {
            return w;
        }
    }
    return null;
}

function damageWall(w) {
    w.hp -= 1; // Slow break
    if (w.hp <= 0) {
        walls.splice(walls.indexOf(w), 1);
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameState !== 'PLAYING') return;

    // Viewport Culling
    const startCol = Math.floor(camera.x / TILE_SIZE);
    const endCol = startCol + (canvas.width / TILE_SIZE) + 1;
    const startRow = Math.floor(camera.y / TILE_SIZE);
    const endRow = startRow + (canvas.height / TILE_SIZE) + 1;

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Floor
    for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
            if ((c + r) % 2 === 0) ctx.fillStyle = '#b8815d88'; else ctx.fillStyle = '#b8825d8e';
            ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Walls
    walls.forEach(w => {
        // Color based on HP
        let maxHp = 200;
        if (w.type === 'wall_wood') maxHp = 400;
        if (w.type === 'wall_door') maxHp = 300;
        if (w.type === 'chest_basic') maxHp = 150;
        if (w.type === 'barrel_explosive') maxHp = 50;

        const hpRatio = w.hp / maxHp;

        // Image Drawing
        let wallImg = null;
        if (w.type === 'wall_door') {
            wallImg = w.isOpen ? loadedAssets['wall_door_open'] : loadedAssets['wall_door_closed'];
        } else if (loadedAssets[w.type]) {
            wallImg = loadedAssets[w.type];
        }

        if (wallImg) {
            ctx.drawImage(wallImg, w.x, w.y, TILE_SIZE, TILE_SIZE);
            // Optional: visual damage overlay?
        } else {
            // Fallback Drawing
            ctx.fillStyle = `rgb(${80 * hpRatio}, ${60 * hpRatio}, ${50 * hpRatio})`;
            if (w.type === 'wall_door') ctx.fillStyle = '#795548';

            if (w.type === 'wall_door') {
                if (!w.isOpen) {
                    ctx.fillRect(w.x, w.y, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#4e342e';
                    ctx.fillRect(w.x + 5, w.y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
                    // Knob
                    ctx.fillStyle = 'gold';
                    ctx.beginPath();
                    ctx.arc(w.x + TILE_SIZE - 10, w.y + TILE_SIZE / 2, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Open door visuals (Just the frame)
                    ctx.strokeStyle = '#5d4037';
                    ctx.lineWidth = 4; // Thicker frame
                    ctx.strokeRect(w.x, w.y, TILE_SIZE, TILE_SIZE);
                }
            } else {
                // Normal Wall
                ctx.fillRect(w.x, w.y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#3e2723';
                ctx.strokeRect(w.x, w.y, TILE_SIZE, TILE_SIZE);
                ctx.beginPath();
                ctx.moveTo(w.x, w.y);
                ctx.lineTo(w.x + TILE_SIZE, w.y + TILE_SIZE);
                ctx.moveTo(w.x + TILE_SIZE, w.y);
                ctx.lineTo(w.x + TILE_SIZE, w.y + TILE_SIZE);
                ctx.stroke();
            }
        }
    });

    // Preview Placement
    if (gameState === 'PLAYING') {
        const heldItem = player.inventory[player.selectedSlot];
        if (heldItem && ITEMS[heldItem.id].type === 'build') {
            const mx = mouse.x + camera.x;
            const my = mouse.y + camera.y;
            const gx = Math.floor(mx / TILE_SIZE) * TILE_SIZE;
            const gy = Math.floor(my / TILE_SIZE) * TILE_SIZE;

            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#4caf50';
            const dist = Math.hypot(gx + TILE_SIZE / 2 - player.x, gy + TILE_SIZE / 2 - player.y);
            if (dist > 200) ctx.fillStyle = '#f44336';

            ctx.fillRect(gx, gy, TILE_SIZE, TILE_SIZE);
            ctx.globalAlpha = 1.0;
        }
    }

    // Drops
    drops.forEach(d => {
        if (loadedAssets['money']) {
            ctx.drawImage(loadedAssets['money'], d.x - 12, d.y - 12, 24, 24);
        } else {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#daa520';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText('$', d.x - 3, d.y + 4);
        }
    });

    // Acid Projectiles
    ctx.fillStyle = '#76ff03';
    acidProjectiles.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#76ff03';
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Fire Patches
    firePatches.forEach(f => {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#ff5722';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        // Particle effect (simple)
        if (Math.random() < 0.2) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(f.x - 10 + Math.random() * 20, f.y - 10 + Math.random() * 20, 4, 4);
        }
    });

    // Bonfire
    // Bonfire Visuals (Emojis)
    ctx.save();
    ctx.translate(bonfire.x, bonfire.y);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '50px Arial';

    // Log 1 (Rotated)
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillText('🪵', 0, 0);
    ctx.restore();

    // Log 2 (Rotated)
    ctx.save();
    ctx.rotate(-Math.PI / 4);
    ctx.fillText('🪵', 0, 0);
    ctx.restore();

    // Fire (On top)
    ctx.fillText('🔥', 0, -15);

    ctx.restore();
    // HP Bar
    ctx.fillStyle = 'red';
    ctx.fillRect(bonfire.x - 40, bonfire.y - 60, 80, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(bonfire.x - 40, bonfire.y - 60, 80 * (bonfire.hp / bonfire.maxHp), 10);

    // Zombies
    // Zombies
    zombies.forEach(z => {
        // Determine asset based on type
        const zKey = 'zombie_' + (z.type || 'normal');
        const zImg = loadedAssets[zKey] || loadedAssets['zombie'];

        if (zImg) {
            ctx.save();
            ctx.translate(z.x, z.y);
            // Face local player
            const angle = Math.atan2(player.y - z.y, player.x - z.x);
            ctx.rotate(angle - Math.PI / 2);

            // Draw Scaled Visual
            const stats = ZOMBIE_STATS[z.type || 'normal'];
            const visualScale = stats ? stats.visualScale : 2.5;

            // Walking Animation (Flip X every 1 second)
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(zImg, -z.radius * visualScale, -z.radius * visualScale, z.radius * 2 * visualScale, z.radius * 2 * visualScale);
            ctx.restore();
        } else {
            ctx.fillStyle = z.color;
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });

    // Bullets
    ctx.fillStyle = 'yellow';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fill();
    });

    // Draw Remote Players
    Object.keys(remotePlayers).forEach(pid => {
        if (pid === myId) return; // Don't draw self from remote list (Host logic)
        // For Client, myId is NOT in the remotePlayers list usually? 
        // Host sends { ...remote, [hostId]: hostPlayer }.
        // Client has myId = "UUID". Host is "Z100-XXX".
        // Host has myId = "Z100-XXX".
        // So yes, exclude self.

        const p = remotePlayers[pid];
        if (p) drawCharacter(ctx, p.x, p.y, p.angle, p.visual || {}, 20);
    });

    // Player
    // Pass active item for rendering
    const activeItem = player.inventory[player.selectedSlot];
    const visualWithItem = { ...player.visual, activeItem: activeItem };

    drawCharacter(ctx, player.x, player.y, player.angle, visualWithItem, 20);
    // Name tag moved to drawCharacter

    ctx.restore();
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

/* --- INVENTORY & SHOP SYSTEM --- */

function addToInventory(itemId, amount) {
    const maxStack = 100;
    let remaining = amount;

    // 1. Try to fill existing stacks in Hotbar then Backpack
    // Helper to traverse both arrays
    const lists = [player.inventory, player.backpack];

    for (let list of lists) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].id === itemId && list[i].count < maxStack) {
                const space = maxStack - list[i].count;
                const add = Math.min(space, remaining);
                list[i].count += add;
                remaining -= add;
                if (remaining <= 0) break;
            }
        }
        if (remaining <= 0) break;
    }

    // 2. If needed, create new stacks
    if (remaining > 0) {
        for (let list of lists) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === null) {
                    const add = Math.min(maxStack, remaining);
                    list[i] = { id: itemId, count: add };
                    remaining -= add;
                    if (remaining <= 0) break;
                }
            }
            if (remaining <= 0) break;
        }
    }

    renderInventoryUI();
    return remaining <= 0; // True if fully added
}

function buyItem(idx) {
    const item = SHOP_ITEMS[idx];
    if (player.stats.money >= item.price) {
        player.stats.money -= item.price;
        document.getElementById('ui-money').innerText = player.stats.money;
        addToInventory(item.id, item.amount);
    } else {
        alert("¡No tienes suficiente dinero!");
    }
}

function renderInventoryUI() {
    // Render Hotbar
    document.querySelectorAll('.hotbar-slot').forEach((slot, i) => {
        const item = player.inventory[i];
        if (i === player.selectedSlot) slot.className = 'hotbar-slot active';
        else slot.className = 'hotbar-slot';

        const iconDiv = slot.querySelector('.icon');
        iconDiv.innerHTML = ''; // Clear previous

        if (item) {
            if (loadedAssets[item.id]) {
                iconDiv.innerHTML = `<img src="${ASSETS_MAP[item.id]}" style="width:100%; height:100%; object-fit:contain;">`;
            } else {
                iconDiv.innerText = ITEMS[item.id].icon;
            }
            // Quantity overlay
            iconDiv.innerHTML += `<div style="position:absolute; bottom:-5px; right:0px; font-size:12px; color:white; font-weight:bold; text-shadow:1px 1px 0 #000;">${item.count}</div>`;
        }
    });

    // Render Backpack
    const bpGrid = document.getElementById('backpack-grid');
    bpGrid.innerHTML = '';
    player.backpack.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        if (item) {
            // Check for image asset
            if (loadedAssets[item.id]) {
                slot.innerHTML = `<img src="${ASSETS_MAP[item.id]}" style="width:100%; height:100%; object-fit:contain;">`;
            } else {
                slot.innerText = ITEMS[item.id].icon;
            }
            slot.innerHTML += `<div style="position:absolute; bottom:2px; right:2px; font-size:10px; color:white; text-shadow:1px 1px 0 #000;">${item.count}</div>`;
            slot.title = ITEMS[item.id].name;
            slot.style.position = 'relative';
        }
        bpGrid.appendChild(slot);
    });
}


function renderShopUI(tab = 'buy') {
    const grid = document.getElementById('shop-items');
    grid.innerHTML = '';

    // Tabs container
    const tabsContainer = document.querySelector('.shop-tabs');
    // Force reset tabs if they are not ours (e.g. from HTML template)
    if (!tabsContainer.querySelector('[data-type="custom-tab"]')) {
        tabsContainer.innerHTML = '';

        const btnBuy = document.createElement('button');
        btnBuy.innerText = '🛒 COMPRAR';
        btnBuy.setAttribute('data-type', 'custom-tab');
        btnBuy.onclick = () => renderShopUI('buy');

        const btnSkill = document.createElement('button');
        btnSkill.innerText = '⭐ HABILIDADES';
        btnSkill.setAttribute('data-type', 'custom-tab');
        btnSkill.onclick = () => renderShopUI('skills');

        const btnRevive = document.createElement('button');
        btnRevive.innerText = '🚑 RESCATE';
        btnRevive.setAttribute('data-type', 'custom-tab');
        btnRevive.onclick = () => renderShopUI('revive');

        tabsContainer.appendChild(btnBuy);
        tabsContainer.appendChild(btnSkill);
        tabsContainer.appendChild(btnRevive);
    }

    // Highlight active tab
    tabsContainer.querySelectorAll('button').forEach(b => {
        b.classList.remove('active');
        if ((tab === 'buy' && b.innerText.includes('COMPRAR')) ||
            (tab === 'skills' && b.innerText.includes('HABILIDADES'))) {
            b.classList.add('active');
        }
    });



    if (tab === 'buy') {
        SHOP_ITEMS.forEach((item, i) => {
            const meta = ITEMS[item.id];
            const el = document.createElement('div');
            el.className = 'shop-item';

            let iconHtml = `<div style="font-size:2rem;">${meta.icon}</div>`;
            if (loadedAssets[item.id]) {
                iconHtml = `<img src="${ASSETS_MAP[item.id]}" style="width:50px; height:50px; object-fit:contain; margin:auto;">`;
            }

            el.innerHTML = `
                ${iconHtml}
                <h4>${meta.name} x${item.amount}</h4>
                <div class="price">$${item.price}</div>
            `;
            el.onclick = () => buyItem(i);
            grid.appendChild(el);
        });
    } else if (tab === 'revive') {
        const deadPlayers = [];
        // Detect Dead Players (Host and Clients)
        // If I am Host, check remotePlayers + my dead state? 
        // No, shop is for buying OTHERS. Can't buy self.

        // Add Host if I am client and Host is dead
        // (Host info is in remotePlayers[hostId]?)
        // Wait, remotePlayers only contains peers.
        // If I am Client, does remotePlayers contain Host?
        // handleServerData syncs ALL players including [myId] (which is Host's ID from Host perspective)
        // Host sends: players: { ...remote, [hostId]: hostPlayer }
        // Client receives: data.p.
        // Client updates remotePlayers with ALL others.
        // So yes, remotePlayers includes everyone else.

        Object.keys(remotePlayers).forEach(pid => {
            const p = remotePlayers[pid];
            if (p && p.isDead) {
                deadPlayers.push({ id: pid, name: p.visual.nick, shirt: p.visual.shirt });
            }
        });

        if (deadPlayers.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #aaa;">No hay nadie muerto... por ahora.</div>`;
        } else {
            deadPlayers.forEach(p => {
                const el = document.createElement('div');
                el.className = 'shop-item';
                el.style.borderColor = 'red';
                el.innerHTML = `
                    <div style="font-size:2rem; background:${p.shirt}; border-radius:50%; width:50px; height:50px; line-height:50px; margin:auto;">💀</div>
                    <h4>REVIVIR: ${p.name}</h4>
                    <div class="price">$25</div>
                `;
                el.onclick = () => buyRevive(p.id);
                grid.appendChild(el);
            });
        }

    } else if (tab === 'skills') {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #aaa;">Puntos de Habilidad: ${player.stats.skillPoints}<br>(Próximamente: Mejoras de Velocidad, Daño, etc.)</div>`;
    }
}

/* --- UI HELPERS --- */
function toggleBackpack() { document.getElementById('backpack-panel').classList.toggle('hidden'); }

function togglePause(isRemote = false) {
    if (gameState === 'MENU') return;

    // Local Toggle Request
    if (!isRemote) {
        if (isHost) {
            // Host toggles logic directly
            gameState = (gameState === 'PLAYING') ? 'PAUSED' : 'PLAYING';
            // Broadcast will happen in next tick
        } else if (serverConn && serverConn.open) {
            // Client requests toggle
            serverConn.send({ type: 'REQUEST_PAUSE_TOGGLE' });
            return; // Wait for server to confirm via Update
        }
    }

    // If triggered by Remote Packet (Host telling Client, or Logic above)
    // Update UI
    updatePauseUI();
}

function updatePauseUI() {
    const menu = document.getElementById('pause-menu');
    if (gameState === 'PAUSED') {
        menu.classList.remove('hidden');
        // Show Code
        let codeToShow = "";
        if (isHost && myId) codeToShow = myId.replace('Z100-', '');
        else if (!isHost && serverConn && serverConn.peer) codeToShow = serverConn.peer.replace('Z100-', '');

        if (codeToShow) document.getElementById('pause-code-display').innerText = `CÓDIGO DE SALA: ${codeToShow}`;
    } else {
        menu.classList.add('hidden');
        gameLoop();
    }
}
function toggleShop() {
    isShopOpen = !isShopOpen;
    const panel = document.getElementById('shop-panel');
    panel.classList.toggle('hidden');
    if (isShopOpen) {
        renderShopUI();
        document.getElementById('ui-money').innerText = player.stats.money;
    }
}

function buyRevive(pid) {
    if (player.stats.money >= 25) {
        player.stats.money -= 25;
        document.getElementById('ui-money').innerText = player.stats.money;

        if (isHost) {
            revivePlayer(pid);
        } else {
            if (serverConn && serverConn.open) {
                serverConn.send({ type: 'ACTION_REVIVE', targetId: pid });
            }
        }
        alert("¡Has revivido al jugador!");
        renderShopUI('revive');
    } else {
        alert("Necesitas $25 para revivir.");
    }
}

function revivePlayer(pid) {
    // Only Host calls this
    const rp = remotePlayers[pid];
    if (rp) {
        rp.isDead = false;
        const conn = connections.find(c => c.peer === pid);
        if (conn && conn.open) {
            conn.send({ type: 'EVENT_RESPAWN' });
        }
    }
}

function checkGameOver() {
    if (!isHost) return;
    if (!player.isDead) return; // Host is alive

    // Check Clients
    const allClientsDead = Object.values(remotePlayers).every(p => p.isDead);

    if (allClientsDead) {
        // Broadcast
        connections.forEach(c => { if (c.open) c.send({ type: 'EVENT_GAMEOVER' }); });
        setTimeout(() => {
            if (player.isDead) { // Double check
                alert("GAME OVER - TODOS HAN MUERTO");
                location.reload();
            }
        }, 500);
    }
}

/* --- MULTIPLAYER DATA --- */
let knownPeers = {}; // { "Nickname": { inventory, visual, stats } }

function saveToFile() {
    // 1. Update own entry in knownPeers (just in case)
    knownPeers[player.visual.nick] = {
        inventory: player.inventory,
        backpack: player.backpack,
        stats: player.stats,
        visual: player.visual
    };

    // 2. Collect Game State
    const saveData = {
        version: "1.1",
        timestamp: Date.now(),
        player: {
            x: player.x,
            y: player.y,
            visual: player.visual,
            inventory: player.inventory,
            backpack: player.backpack,
            stats: player.stats
        },
        bonfire: { hp: bonfire.hp },
        day: 1,
        money: player.stats.money,
        walls: walls,
        // Save Other Players Data
        knownPeers: knownPeers
    };

    // 3. Convert to JSON Blob
    const dataStr = JSON.stringify(saveData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 4. Trigger Download
    const a = document.createElement('a');
    a.href = url;
    a.download = `zona100_save_${player.visual.nick}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Partida (incluyendo datos de amigos) exportada correctamente.");
}

function loadFromFile(inputResult) {
    const file = inputResult.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            // Validate Basic
            if (!data.player) throw new Error("Archivo corrupto");

            // Restore Local Player
            player.x = data.player.x;
            player.y = data.player.y;
            player.visual = data.player.visual;
            player.inventory = data.player.inventory;
            player.backpack = data.player.backpack;
            player.stats = data.player.stats;

            if (data.bonfire) bonfire.hp = data.bonfire.hp;

            if (data.walls) walls = data.walls;

            // Restore Known Peers Database
            if (data.knownPeers) {
                knownPeers = data.knownPeers;
                console.log("Datos de jugadores restaurados:", Object.keys(knownPeers));
            }

            // UI Updates
            updatePreview();

            // If loading from menu, start game
            if (gameState === 'MENU') {
                initGame('HOST');
            } else {
                renderInventoryUI();
                updateAmmoUI();
                document.getElementById('ui-money').innerText = player.stats.money;
                document.getElementById('ui-hp').innerText = player.stats.hp;
                alert("Partida cargada.");
                togglePause();
            }

        } catch (err) {
            console.error(err);
            alert("Error al cargar: " + err.message);
        }
    };
    reader.readAsText(file);
}

function triggerExplosion(x, y) {
    // Explosion Visuals
    firePatches.push({ x: x, y: y, radius: 40, life: 100 }); // Short lived intense fire

    // Damage P2P (Host)
    // Damage Local Player
    const d = Math.hypot(x - player.x, y - player.y);
    if (d < 150) {
        player.stats.hp -= 40 * (1 - d / 150);
        document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
    }

    // Damage Remote Players
    Object.keys(remotePlayers).forEach(pid => {
        const rp = remotePlayers[pid];
        if (rp) {
            const dr = Math.hypot(x - rp.x, y - rp.y);
            if (dr < 150) {
                const conn = connections.find(c => c.peer === pid);
                if (conn) conn.send({ type: 'EVENT_DAMAGE', amount: 40 * (1 - dr / 150) });
            }
        }
    });

    // Damage Zombies
    zombies.forEach(z => {
        if (z.isDead) return;
        const dz = Math.hypot(x - z.x, y - z.y);
        if (dz < 150) {
            z.hp -= 100 * (1 - dz / 150);
        }
    });
}

function spawnFirePatch(x, y) {
    firePatches.push({
        x: x, y: y,
        radius: 30,
        life: 500 // ~8 seconds
    });
}
