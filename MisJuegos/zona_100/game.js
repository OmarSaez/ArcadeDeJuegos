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

// Entidades Globales
let bullets = [];
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
    'weapon_pistol': { name: 'Pistola', type: 'weapon', icon: '🔫', ammoType: 'ammo_pistol' },

    // Ammo
    'ammo_pistol': { name: 'Balas Pequeñas', type: 'ammo', icon: '🔸' },
    'ammo_shotgun': { name: 'Cartuchos', type: 'ammo', icon: '🛑' },
    'ammo_rifle': { name: 'Balas Largas', type: 'ammo', icon: '🦴' },
    'ammo_fuel': { name: 'Combustible', type: 'ammo', icon: '🔥' },

    // Buildings
    'wall_wood': { name: 'Muro Madera', type: 'build', icon: '🪵' },
    'wall_door': { name: 'Puerta', type: 'build', icon: '🚪' },
    'chest_basic': { name: 'Cofre Pequeño', type: 'build', icon: '📦' },

    // Meds
    'medkit_small': { name: 'Venda', type: 'med', icon: '🩹', heal: 15 },
    'medkit_large': { name: 'Botiquín', type: 'med', icon: '🧰', heal: 40 }
};

const SHOP_ITEMS = [
    { id: 'ammo_pistol', price: 10, amount: 40 },
    { id: 'ammo_shotgun', price: 20, amount: 10 },
    { id: 'ammo_rifle', price: 50, amount: 30 },
    { id: 'wall_wood', price: 10, amount: 1 },
    { id: 'wall_door', price: 20, amount: 1 },
    { id: 'chest_basic', price: 100, amount: 1 },
    { id: 'medkit_small', price: 10, amount: 1 },
    { id: 'medkit_large', price: 20, amount: 1 }
];

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
        { id: 'ammo_pistol', count: 250 },
        null,
        null,
        null
    ],
    backpack: new Array(25).fill(null),
    stats: { hp: 100, money: 0 },
    selectedSlot: 0,
    lastShot: 0,
    pickupRadius: 60
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

    pCtx.fillStyle = '#8d6e63';
    pCtx.fillRect(0, 0, 100, 100);
    // Angle Math.PI/2 means facing "Down" (Front) after the adjustment
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
        context.arc(0, 0, radius * 0.85, Math.PI, Math.PI * 2);
        context.fill();
    } else if (visual.hairStyle === 'long') {
        context.beginPath();
        context.arc(0, 0, radius * 0.9, Math.PI * 0.8, Math.PI * 2.2);
        context.fill();
        context.fillRect(-radius * 0.8, -radius * 0.8, radius * 1.6, radius * 1.8);
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

    if (isHost) setInterval(spawnZombie, 2000);
    gameLoop();
    renderInventoryUI();
    renderShopUI();
    updateAmmoUI();
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
    if (e.key === 'Escape') togglePause();
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
        target.isOpen = !target.isOpen;
    }
}

function placeStructure(item) {
    // Calculate Grid Position
    const mx = mouse.x + camera.x;
    const my = mouse.y + camera.y;
    const gx = Math.floor(mx / TILE_SIZE) * TILE_SIZE;
    const gy = Math.floor(my / TILE_SIZE) * TILE_SIZE;

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
    walls.push({ x: gx, y: gy, type: item.id, hp: 200, isOpen: false });

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
    bullets.push({
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 15,
        life: 100
    });
}

function spawnZombie() {
    let zx, zy;
    if (Math.random() < 0.5) {
        zx = Math.random() < 0.5 ? 0 : WORLD_W * TILE_SIZE;
        zy = Math.random() * (WORLD_H * TILE_SIZE);
    } else {
        zx = Math.random() * (WORLD_W * TILE_SIZE);
        zy = Math.random() < 0.5 ? 0 : WORLD_H * TILE_SIZE;
    }
    zombies.push({ x: zx, y: zy, hp: 30, speed: 1 + Math.random(), radius: 15, color: '#4caf50' });
}

function update() {
    if (gameState !== 'PLAYING') return;

    // Player Move
    const speed = 4;
    let dx = 0; let dy = 0;
    if (keys['w']) dy = -speed;
    if (keys['s']) dy = speed;
    if (keys['a']) dx = -speed;
    if (keys['d']) dx = speed;

    // X Axis
    if (!checkWallCollision(player.x + dx, player.y)) {
        player.x += dx;
    }
    // Y Axis
    if (!checkWallCollision(player.x, player.y + dy)) {
        player.y += dy;
    }

    // Angle
    const screenPlayerX = player.x - camera.x;
    const screenPlayerY = player.y - camera.y;
    player.angle = Math.atan2(mouse.y - screenPlayerY, mouse.x - screenPlayerX);

    // Camera
    const targetCamX = player.x - canvas.width / 2;
    const targetCamY = player.y - canvas.height / 2;
    camera.x += (targetCamX - camera.x) * 0.1;
    camera.y += (targetCamY - camera.y) * 0.1;

    // Zombies
    // Zombies
    zombies.forEach((z, i) => {
        const distToPlayer = Math.hypot(player.x - z.x, player.y - z.y);
        const distToBonfire = Math.hypot(bonfire.x - z.x, bonfire.y - z.y);
        let target = (distToPlayer < distToBonfire) ? player : bonfire;

        // Collision logic
        let pushX = 0;
        let pushY = 0;

        // 1. Zombie - Zombie Collision
        zombies.forEach((other, j) => {
            if (i === j) return;
            const dz = Math.hypot(z.x - other.x, z.y - other.y);
            const minDist = z.radius + other.radius; // Minimal overlap allowed
            if (dz < minDist && dz > 0) {
                const pushAngle = Math.atan2(z.y - other.y, z.x - other.x);
                const force = (minDist - dz) / 2; // Separate half each
                pushX += Math.cos(pushAngle) * force * 0.1;
                pushY += Math.sin(pushAngle) * force * 0.1;
            }
        });

        // 2. Zombie - Player Collision & Damage
        const dp = Math.hypot(z.x - player.x, z.y - player.y);
        if (dp < z.radius + 20) { // 20 is player radius
            // Damage Player
            if (!z.lastAttack || Date.now() - z.lastAttack > 1000) {
                player.stats.hp -= 10;
                document.getElementById('ui-hp').innerText = `HP: ${Math.floor(player.stats.hp)}%`;
                z.lastAttack = Date.now();
                if (player.stats.hp <= 0) alert("GAME OVER"); // Placeholder
            }

            const pushAngle = Math.atan2(z.y - player.y, z.x - player.x);
            pushX += Math.cos(pushAngle) * 2;
            pushY += Math.sin(pushAngle) * 2;
        }

        const angle = Math.atan2(target.y - z.y, target.x - z.x);
        let nextZX = z.x + Math.cos(angle) * z.speed + pushX;
        let nextZY = z.y + Math.sin(angle) * z.speed + pushY;

        // Apply Wall Collision & Damage
        // X Check
        let colX = getWallCollision(nextZX, z.y, z.radius);
        if (colX) {
            if (colX.type === 'wall_door' && colX.isOpen) {
                z.x = nextZX; // Pass through
            } else {
                damageWall(colX);
            }
        } else {
            z.x = nextZX;
        }

        // Y Check
        let colY = getWallCollision(z.x, nextZY, z.radius);
        if (colY) {
            if (colY.type === 'wall_door' && colY.isOpen) {
                z.y = nextZY; // Pass through
            } else {
                damageWall(colY);
            }
        } else {
            z.y = nextZY;
        }

        // Bonfire Interaction (2x2 area -> radius ~50-60 effective stop)
        // Bonfire is at center, physically drawn radius 40.
        // If we want them to stop at "2x2" perimeter (100px width), distance center-to-edge is 50.
        // User wants "around this 2x2".
        const attackRange = 50 + z.radius + 5;

        if (target === bonfire) {
            if (distToBonfire < attackRange) {
                bonfire.hp -= 0.1;
                // Push back slightly to prevent overlapping bonfire visually
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

        zombies.forEach((z, j) => {
            const dist = Math.hypot(b.x - z.x, b.y - z.y);
            if (dist < z.radius + 5) {
                z.hp -= 10;
                b.life = 0;
                if (z.hp <= 0) {
                    // Drop Money
                    drops.push({ x: z.x, y: z.y, value: 1, life: 600 });
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
                // If open door, bullet passes? Maybe. Let's say yes.
                if (w.type === 'wall_door' && w.isOpen) continue;

                b.life = 0;
                damageWall(w);
                break;
            }
        }
    });
    bullets = bullets.filter(b => b.life > 0);

    // Drops & Magnet
    drops.forEach((d, i) => {
        const dist = Math.hypot(player.x - d.x, player.y - d.y);
        // Magnet
        if (dist < player.pickupRadius) {
            d.x += (player.x - d.x) * 0.1;
            d.y += (player.y - d.y) * 0.1;
        }
        // Collect
        if (dist < 20) {
            player.stats.money += d.value;
            document.getElementById('ui-money').innerText = player.stats.money;
            drops.splice(i, 1);
        }
    });

    // Clean old drops (optional if we want them to despawn)
    // currently life is not decremented, so they stay forever.
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
            if ((c + r) % 2 === 0) ctx.fillStyle = '#8d6e63'; else ctx.fillStyle = '#795548';
            ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Walls
    walls.forEach(w => {
        // Color based on HP
        const hpRatio = w.hp / 200;
        ctx.fillStyle = `rgb(${80 * hpRatio}, ${60 * hpRatio}, ${50 * hpRatio})`;
        if (w.type === 'wall_door') ctx.fillStyle = '#795548'; // Door color

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
                // Open door visuals (flat against wall or transparent)
                ctx.strokeStyle = '#5d4037';
                ctx.lineWidth = 2;
                ctx.strokeRect(w.x, w.y, TILE_SIZE, TILE_SIZE);

                // Door leaf open
                ctx.fillStyle = 'rgba(121, 85, 72, 0.5)';
                ctx.fillRect(w.x, w.y, 10, TILE_SIZE);
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
            ctx.lineTo(w.x + TILE_SIZE, w.y + TILE_SIZE); // Fix visual
            ctx.stroke();
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
    zombies.forEach(z => {
        ctx.fillStyle = z.color;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // Bullets
    ctx.fillStyle = 'yellow';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Player
    // Pass active item for rendering
    const activeItem = player.inventory[player.selectedSlot];
    const visualWithItem = { ...player.visual, activeItem: activeItem };

    drawCharacter(ctx, player.x, player.y, player.angle, visualWithItem, 20);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.visual.nick, player.x, player.y - 35);

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
        iconDiv.innerText = item ? ITEMS[item.id].icon : '';
        if (item) {
            iconDiv.innerHTML += `<div style="position:absolute; bottom:2px; right:2px; font-size:10px; color:white;">${item.count}</div>`;
        }
    });

    // Render Backpack
    const bpGrid = document.getElementById('backpack-grid');
    bpGrid.innerHTML = '';
    player.backpack.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        if (item) {
            slot.innerText = ITEMS[item.id].icon;
            slot.innerHTML += `<div style="position:absolute; bottom:2px; right:2px; font-size:10px; color:white;">${item.count}</div>`;
            slot.title = ITEMS[item.id].name;
            slot.style.position = 'relative';
        }
        bpGrid.appendChild(slot);
    });
}

function renderShopUI() {
    const grid = document.getElementById('shop-items');
    grid.innerHTML = '';
    SHOP_ITEMS.forEach((item, i) => {
        const meta = ITEMS[item.id];
        const el = document.createElement('div');
        el.className = 'shop-item';
        el.innerHTML = `
            <div style="font-size:2rem;">${meta.icon}</div>
            <h4>${meta.name} x${item.amount}</h4>
            <div class="price">$${item.price}</div>
        `;
        el.onclick = () => buyItem(i);
        grid.appendChild(el);
    });
}

/* --- UI HELPERS --- */
function toggleBackpack() { document.getElementById('backpack-panel').classList.toggle('hidden'); }
function togglePause() {
    gameState = (gameState === 'PLAYING') ? 'PAUSED' : 'PLAYING';
    document.getElementById('pause-menu').classList.toggle('hidden');
}
function toggleShop() {
    isShopOpen = !isShopOpen;
    document.getElementById('shop-panel').classList.toggle('hidden');
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
