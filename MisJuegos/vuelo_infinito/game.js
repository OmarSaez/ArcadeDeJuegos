const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const uiOverlay = document.getElementById('ui-overlay');
const mainMenu = document.getElementById('main-menu');
const shopMenu = document.getElementById('shop-menu');
const launchScreen = document.getElementById('launch-screen');
const resultsScreen = document.getElementById('results-screen');
const hud = document.getElementById('hud');
const shieldDisplay = document.getElementById('shield-display');
const powerBar = document.getElementById('power-bar');
const skyLayers = document.getElementById('sky-layers');

// Stats Displays
const distVal = document.getElementById('dist-val');
const altVal = document.getElementById('alt-val');
const coinVal = document.getElementById('coin-val');
const boostBar = document.getElementById('boost-bar');
const bestDistDisplay = document.getElementById('best-dist');
const totalCoinsDisplays = document.querySelectorAll('.total-coins, #shop-coins-val');
const timeWarpControls = document.getElementById('time-warp-controls');
const warpBtns = document.querySelectorAll('.warp-btn');
let timeScale = 1;
let hasShowedWinBannerThisRun = false;

// Results Displays
const resDist = document.getElementById('res-dist');
const resAlt = document.getElementById('res-alt');
const resCoins = document.getElementById('res-coins');

// Game State
let gameState = 'MENU'; // MENU, SHOP, LAUNCHING, FLYING, RESULTS
let lastTime = 0;
let distance = 0;
let maxAltitude = 0;
let sessionCoins = 0;
let launchPower = 0;
let powerDirection = 1;
let isHoldingPower = false;
let frames = 0;
let cameraY = 0;
let worldY = 0;
let boosters = [];
let trampolines = [];
let fuelItems = [];
let planets = [];
let attemptMarker = null;
let activeShields = 0;
let shieldCooldown = 0;
let screenShake = 0;
let isLaunchingPerfect = false;
let perfectParticlesTimer = 0;

// Persistent Data
let playerData = {
    totalCoins: 0,
    bestDistance: 0,
    upgrades: {
        thrust: 0,
        aero: 0,
        fuel: 0,
        boost: 0,
        magnet: 0,
        coinValue: 0,
        trampoline: 0,
        shield: 0,
        luck: 0,
        precision: 0,
        legendary: 0
    }
};

// Upgrade Constants
const UPGRADE_COSTS = {
    thrust: [20, 50, 100, 200, 500],
    aero: [20, 50, 100, 200, 500],
    fuel: [20, 50, 100, 200, 500],
    boost: [20, 50, 100, 200, 500],
    magnet: [20, 50, 100, 200, 500],
    coinValue: [20, 50, 100, 200, 500],
    trampoline: [100, 150, 200, 250, 300],
    shield: [100, 150, 200, 250, 300],
    luck: [150, 300, 600, 1000, 2000],
    precision: [50, 100, 200, 400, 800],
    legendary: [5000]
};

// Plane Constants & Physics
const plane = {
    x: 100,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    width: 60,
    height: 30,
    gravity: 0.15,
    drag: 0.005,
    lift: 0.015,
    boostActive: false,
    fuel: 100,
    maxFuel: 100
};

// World Objects
let coins = [];
let obstacles = [];
let particles = [];
let clouds = [];
let stars = []; // For space altitude

// --- Initialization ---

function init() {
    loadData();
    resize();
    window.addEventListener('resize', resize);
    attachEventListeners();
    updateUIStrings();

    requestAnimationFrame(gameLoop);
}

function loadData() {
    const saved = localStorage.getItem('vuelo_infinito_data');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge upgrades and other fields
        playerData.totalCoins = parsed.totalCoins || 0;
        playerData.bestDistance = parsed.bestDistance || 0;
        playerData.hasWon = parsed.hasWon || false;
        if (parsed.upgrades) {
            playerData.upgrades = { ...playerData.upgrades, ...parsed.upgrades };
        }
    }
    updateUIStrings();
}

function saveData() {
    localStorage.setItem('vuelo_infinito_data', JSON.stringify(playerData));
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    plane.y = canvas.height - 100;
}

function updateUIStrings() {
    bestDistDisplay.textContent = Math.floor(playerData.bestDistance);
    totalCoinsDisplays.forEach(el => {
        if (el) el.textContent = Math.floor(playerData.totalCoins);
    });

    // Update shop dots
    document.querySelectorAll('.upgrade-card').forEach(card => {
        const type = card.dataset.upgrade;
        if (playerData.upgrades[type] === undefined) playerData.upgrades[type] = 0;
        const level = playerData.upgrades[type];
        const maxLvl = UPGRADE_COSTS[type].length;
        const dots = card.querySelector('.level-dots');
        if (dots) {
            dots.innerHTML = '';
            // Don't show dots for legendary (it's a one-time thing)
            if (type !== 'legendary') {
                for (let i = 0; i < maxLvl; i++) {
                    const dot = document.createElement('span');
                    if (i < level) dot.classList.add('active');
                    dots.appendChild(dot);
                }
            }
        }

        const btn = card.querySelector('.buy-btn');
        if (level >= maxLvl) {
            btn.textContent = '👑 ADQUIRIDO 👑';
            btn.disabled = true;
            btn.style.background = 'linear-gradient(to right, #fbbf24, #f59e0b)';
            btn.style.color = 'black';
        } else {
            const cost = UPGRADE_COSTS[type][level] || 0;
            btn.innerHTML = `${cost} <span class="coin">💰</span>`;
            btn.disabled = playerData.totalCoins < cost;
        }
    });

    // Check for game completion
    const legendaryCard = document.getElementById('legendary-card');
    if (isGameMaxed()) {
        if (legendaryCard) legendaryCard.classList.remove('hidden');
        const title = document.querySelector('.shop-header h2');
        if (title) {
            if (hasLegendary()) {
                title.innerHTML = '✨ RECUERDO DEL LEYENDA ✨';
            } else {
                title.innerHTML = '✨ TALLER DEL LEYENDA ✨';
            }
            title.style.background = 'linear-gradient(to right, #fbbf24, #f59e0b)';
            title.style.webkitBackgroundClip = 'text';
            title.style.webkitTextFillColor = 'transparent';
        }
    }

    updateShieldHUD();
}

function isGameMaxed() {
    // Game is "maxed" for normal upgrades to reveal legendary
    const normalUpgrades = ['thrust', 'aero', 'fuel', 'boost', 'magnet', 'coinValue', 'trampoline', 'shield', 'luck', 'precision'];
    return normalUpgrades.every(key => (playerData.upgrades[key] || 0) >= 5);
}

function hasLegendary() {
    return (playerData.upgrades.legendary || 0) > 0;
}

function isLegendaryPowerActive() {
    return hasLegendary() && distance < 100000;
}

function updateShieldHUD() {
    if (!shieldDisplay) return;
    shieldDisplay.innerHTML = '';
    for (let i = 0; i < activeShields; i++) {
        const s = document.createElement('span');
        s.textContent = '🛡️';
        s.style.marginLeft = '5px';
        shieldDisplay.appendChild(s);
    }
}

// --- Logic ---

function attachEventListeners() {
    document.getElementById('btn-play').onclick = () => showScreen('LAUNCH');
    document.getElementById('btn-upgrades').onclick = () => showScreen('SHOP');
    document.getElementById('btn-back').onclick = () => showScreen('MENU');
    document.getElementById('btn-finish').onclick = () => showScreen('MENU');

    // Reset progress button
    document.getElementById('btn-reset').onclick = () => {
        if (confirm('¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('vuelo_infinito_data');
            // Re-initialize with default empty state
            playerData = {
                totalCoins: 0,
                bestDistance: 0,
                hasWon: false,
                upgrades: {
                    thrust: 0,
                    aero: 0,
                    fuel: 0,
                    boost: 0,
                    magnet: 0,
                    coinValue: 0,
                    trampoline: 0,
                    shield: 0,
                    luck: 0,
                    precision: 0,
                    legendary: 0
                }
            };
            saveData();
            location.reload();
        }
    };

    // Launch mechanism
    window.addEventListener('mousedown', handleInteractionStart);
    window.addEventListener('touchstart', handleInteractionStart, { passive: false });
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd, { passive: false });
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') handleInteractionStart(e);
    });
    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') handleInteractionEnd(e);
    });

    // Time Warp Handlers
    warpBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            timeScale = parseInt(btn.dataset.speed);
            warpBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
}

function handleInteractionStart(e) {
    if (e && e.target && (e.target.tagName === 'BUTTON' || e.target.closest('button'))) return;
    if (e && e.type === 'touchstart') e.preventDefault();
    if (e && e.type === 'keydown' && e.code !== 'Space') return;

    if (gameState === 'LAUNCHING') {
        isHoldingPower = true;
    } else if (gameState === 'FLYING' && plane.fuel > 0) {
        plane.boostActive = true;
    }
}

function handleInteractionEnd(e) {
    if (e && e.type === 'touchstart') e.preventDefault();
    if (e && e.type === 'keyup' && e.code !== 'Space') return;

    if (gameState === 'LAUNCHING' && isHoldingPower) {
        isHoldingPower = false;
        launch();
    } else if (gameState === 'FLYING') {
        plane.boostActive = false;
    }
}

function showScreen(screen) {
    mainMenu.classList.add('hidden');
    shopMenu.classList.add('hidden');
    launchScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    hud.classList.add('hidden');

    if (screen === 'MENU') {
        gameState = 'MENU';
        mainMenu.classList.remove('hidden');
        resetGame();
    } else if (screen === 'SHOP') {
        gameState = 'SHOP';
        shopMenu.classList.remove('hidden');
        updateUIStrings();
    } else if (screen === 'LAUNCH') {
        gameState = 'LAUNCHING';
        launchScreen.classList.remove('hidden');
        launchPower = 0;
        powerDirection = 1;
        if (powerBar) powerBar.style.width = '0%';
    } else if (screen === 'FLYING') {
        gameState = 'FLYING';
        hud.classList.remove('hidden');
        if (hasLegendary()) {
            timeWarpControls.classList.remove('hidden');
        } else {
            timeWarpControls.classList.add('hidden');
        }
        timeScale = 1;
        warpBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.speed === "1") b.classList.add('active');
        });
    } else if (screen === 'RESULTS') {
        gameState = 'RESULTS';
        resultsScreen.classList.remove('hidden');
        hud.classList.add('hidden');
        calculateResults();
    }
}

function buyUpgrade(type) {
    const level = playerData.upgrades[type];
    const cost = UPGRADE_COSTS[type][level];

    if (playerData.totalCoins >= cost && level < 5) {
        playerData.totalCoins -= cost;
        playerData.upgrades[type]++;
        saveData();
        updateUIStrings();
    }
}

// Global click handler for upgrades
shopMenu.addEventListener('click', (e) => {
    const card = e.target.closest('.upgrade-card');
    if (card && (e.target.classList.contains('buy-btn') || e.target.closest('.buy-btn'))) {
        buyUpgrade(card.dataset.upgrade);
    }
});

function resetGame() {
    distance = 0;
    maxAltitude = 0;
    sessionCoins = 0;
    worldY = 0;
    cameraY = 0;
    plane.x = 100;
    plane.y = canvas.height - 100;
    plane.vx = 0;
    launchPower = 0;
    powerDirection = 1;
    if (powerBar) powerBar.style.width = '0%';
    plane.vx = 0;
    plane.vy = 0;
    plane.angle = 0;
    plane.fuel = 100;
    const legendaryFuelMult = hasLegendary() ? 2 : 1;
    plane.maxFuel = (100 + (playerData.upgrades.fuel) * 50) * legendaryFuelMult;
    plane.fuel = plane.maxFuel;
    coins = [];
    obstacles = [];
    boosters = [];
    fuelItems = [];
    planets = [];
    trampolines = [];
    particles = [];
    clouds = [];
    stars = [];
    activeShields = playerData.upgrades.shield || 0;
    updateShieldHUD();
    shieldCooldown = 0;

    for (let i = 0; i < 10; i++) spawnCloud(Math.random() * canvas.width);
    for (let i = 0; i < 150; i++) spawnStar();
}

function spawnStar() {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        twinkle: Math.random()
    });
}

function spawnCloud(x = canvas.width + 100, worldYPos = Math.random() * 1000 + 100) {
    clouds.push({
        x: x,
        worldY: Math.max(100, worldYPos),
        size: 50 + Math.random() * 100,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.2
    });
}

function launch() {
    const thrustLvl = playerData.upgrades.thrust || 0;
    const powerMult = 5 + (thrustLvl * 6);
    let finalPower = (launchPower / 100) * powerMult;

    // Perfect Launch Check (Above 98%)
    if (launchPower > 98) {
        isLaunchingPerfect = true;
        screenShake = 15;

        const perfText = document.getElementById('perfect-text');
        perfText.classList.add('show');

        // Delay the actual takeoff for dramatic effect
        setTimeout(() => {
            isLaunchingPerfect = false;
            finalPower *= 1.5; // Bonus 50% for Perfect (buffed from 40%)
            screenShake = 40; // Massive impact shake

            plane.vx = finalPower;
            plane.vy = -finalPower * 0.5;
            perfectParticlesTimer = 180; // 3 seconds at 60fps

            showScreen('FLYING');
            setTimeout(() => perfText.classList.remove('show'), 1000);
        }, 1200);

    } else {
        screenShake = 10;
        plane.vx = finalPower;
        plane.vy = -finalPower * 0.5;
        showScreen('FLYING');
    }
}

function calculateResults() {
    const distanceBonus = Math.floor(distance / 10);
    const baseGained = sessionCoins + distanceBonus;

    const isNewRecord = distance > playerData.bestDistance;
    const banner = document.getElementById('new-record-banner');
    const winBanner = document.getElementById('game-won-banner');
    const bonusText = document.getElementById('multiplier-bonus');
    const resCoinsEl = document.getElementById('res-coins');

    // Reset UI
    if (banner) banner.classList.add('hidden');
    if (winBanner) winBanner.classList.add('hidden');
    if (bonusText) bonusText.classList.add('hidden');
    resDist.textContent = Math.floor(distance);
    resAlt.textContent = Math.floor(maxAltitude);
    resCoinsEl.textContent = `+${baseGained}`;

    // Game Win Message (Only first run after legendary)
    if (hasLegendary() && !playerData.hasWon) {
        if (winBanner) winBanner.classList.remove('hidden');
        playerData.hasWon = true; // Mark as won forever
    }

    let finalTotal = baseGained;

    if (isNewRecord) {
        playerData.bestDistance = distance;
        finalTotal = Math.floor(baseGained * 1.5);

        // Step 1: Show base coins
        // Step 2: After 800ms, show record banner and bonus badge
        setTimeout(() => {
            if (banner) banner.classList.remove('hidden');
            if (bonusText) bonusText.classList.remove('hidden');

            // Step 3: Animate coins from base to final
            let currentDisplay = baseGained;
            const increment = Math.ceil((finalTotal - baseGained) / 20);
            const counterInterval = setInterval(() => {
                currentDisplay += increment;
                if (currentDisplay >= finalTotal) {
                    currentDisplay = finalTotal;
                    clearInterval(counterInterval);
                }
                resCoinsEl.textContent = `+${currentDisplay}`;
            }, 30);
        }, 800);
    }

    playerData.totalCoins += finalTotal;
    saveData();
    updateUIStrings();
}

// --- Game Loop ---

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    // Apply Time Warp: Run update multiple times or with scaled time
    // For physics stability, we run the update loop multiple times
    if (gameState === 'FLYING') {
        for (let i = 0; i < timeScale; i++) {
            update(dt);
        }
    } else {
        update(dt);
    }

    draw();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (gameState === 'LAUNCHING' && isHoldingPower) {
        const precisionLevel = playerData.upgrades.precision || 0;
        const speedFactor = Math.max(0.5, 4 - (precisionLevel * 0.7)); // Slower speed with higher level
        launchPower += speedFactor * powerDirection;
        if (launchPower >= 100 || launchPower <= 0) powerDirection *= -1;
        powerBar.style.width = launchPower + '%';
    }

    if (gameState === 'FLYING') {
        frames++;

        // --- STABLE PHYSICS ---
        const aeroLvl = playerData.upgrades.aero || 0;
        // Base drag reduction from Aero
        let dragAmount = plane.drag * Math.max(0.1, (1 - aeroLvl * 0.15));
        // Legendary Bonus reduces drag significantly and extends top speed
        // Only active for the first 100k of flight to allow ending the run
        const isGodMode = isLegendaryPowerActive();
        const legendaryDragMult = isGodMode ? 0.3 : 1.0;
        plane.vx *= (1 - dragAmount * legendaryDragMult);

        // Cap horizontal speed
        const maxVX = isGodMode ? 100 : 40;
        if (plane.vx > maxVX) plane.vx = maxVX;

        // SANITY CHECK: Anti-Glitch for existing massive numbers
        if (distance > 100000000) distance = 0;
        if (plane.vx > 1000) plane.vx = 80;

        // Apply legendary speed bonus directly to position (+30% distance per speed)
        const moveMult = isGodMode ? 1.3 : 1.0;
        distance += plane.vx * 0.1 * moveMult;

        // Vertical Gravity & Lift
        plane.vy += plane.gravity;

        // Lift based on speed
        // Legendary has more vertical power
        const maxLift = isGodMode ? 0.4 : 0.3;
        const currentLift = Math.min(maxLift, plane.vx * plane.lift * (isGodMode ? 1.5 : 1.0));
        plane.vy -= currentLift;

        // Hard cap vertical speed to prevent physics explosion
        const maxVY = isGodMode ? 30 : 15;
        if (plane.vy < -maxVY) plane.vy = -maxVY;
        if (plane.vy > maxVY) plane.vy = maxVY;

        // Perfect Particles during flight
        if (perfectParticlesTimer > 0) {
            perfectParticlesTimer--;
            if (frames % 2 === 0) {
                particles.push({
                    x: plane.x - 10,
                    y: plane.y + 5,
                    vx: -3 - Math.random() * 3,
                    vy: Math.random() * 4 - 2,
                    size: 6 + Math.random() * 8,
                    life: 1,
                    color: '#fbbf24'
                });
            }
        }

        // Extra Golden Trail for Legendary Players
        if (hasLegendary() && frames % 3 === 0) {
            particles.push({
                x: plane.x - 20,
                y: plane.y + (Math.random() * 10 - 5),
                vx: -2,
                vy: Math.random() * 2 - 1,
                size: 3 + Math.random() * 5,
                life: 1,
                color: '#f59e0b'
            });
        }

        // Boost
        const fuelLvl = playerData.upgrades.fuel || 0;
        const boostLvl = playerData.upgrades.boost || 0;

        if (plane.boostActive && plane.fuel > 0) {
            const boostPower = 0.2 + (boostLvl * 0.2); // Base boost + level scaling
            plane.vy -= boostPower;
            plane.vx += boostPower * 0.2;
            plane.fuel -= 1.5;

            // Thrust particles
            if (frames % 2 === 0) {
                particles.push({
                    x: plane.x - 10,
                    y: plane.y + 5,
                    vx: -2 - Math.random() * 2,
                    vy: Math.random() * 2 - 1,
                    size: 8 + Math.random() * 8,
                    life: 1,
                    color: '#f59e0b'
                });
            }
        } else {
            // Natural lift already handled in physics block above
        }

        worldY -= plane.vy; // Update world height

        // Camera Magic: Keep plane in view vertically
        const targetCameraY = worldY - (canvas.height * 0.5);
        cameraY += (targetCameraY - cameraY) * 0.1; // Smooth follow

        // Screen Shake Apply
        if (screenShake > 0) {
            screenShake *= 0.9;
            if (screenShake < 0.1) screenShake = 0;
        }

        // Update display Y (for drawing)
        plane.y = canvas.height - 100 - (worldY - cameraY);

        // Boundary / Ground check
        if (worldY < 0) {
            if (activeShields > 0) {
                activeShields--;
                updateShieldHUD();
                const shieldLvl = playerData.upgrades.shield || 1;
                const bounceMult = 1 + (shieldLvl * 0.05);
                plane.vy = -26 * bounceMult; // Double normal trampoline (+ level bonus)
                plane.vx += 3;
                createExplosion(plane.x, canvas.height - 100 + cameraY, '#38bdf8', 30);
                worldY = 1; // Kick off ground
            } else {
                worldY = 0;
                plane.vy *= -0.2; // Small bounce
                plane.vx -= 0.5; // Friction

                if (plane.vx < 0.5) {
                    showScreen('RESULTS');
                }
            }
        }

        // Tops out? 100k if legendary, else 20k
        const worldTop = hasLegendary() ? 1000000 : 200000;
        if (worldY > worldTop) worldY = worldTop;

        // Max altitude tracker
        const currentAlt = worldY / 10;
        if (currentAlt > maxAltitude) maxAltitude = currentAlt;

        // Feedback when Legendary Power ends
        if (hasLegendary() && distance >= 100000 && distance < 101000) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('SOBRECARGA FINALIZADA - RETORNO A VUELO NORMAL', canvas.width / 2, 150);
        }

        // Updates Displays
        distVal.textContent = Math.floor(distance);
        altVal.textContent = Math.max(0, Math.floor(maxAltitude));
        const distanceBonus = Math.floor(distance / 10);
        coinVal.textContent = sessionCoins + distanceBonus;
        boostBar.style.width = (plane.fuel / plane.maxFuel * 100) + '%';

        // Sky background transition based on height (Scaled to 20k)
        const skyHeightRatio = Math.min(1, Math.max(0, currentAlt / 20000));
        skyLayers.style.transform = `translateY(${skyHeightRatio * 95}%)`;

        // Spawn Decorative Clouds (Only if low/medium)
        if (frames % 40 === 0 && currentAlt < 2000) spawnCloud(canvas.width + 100, worldY + (Math.random() * 400 - 200));

        // Spawn Heavenly Clouds (High Altitude > 15k)
        if (frames % 30 === 0 && currentAlt > 15000) {
            clouds.push({
                x: plane.x + (canvas.width + Math.random() * 800),
                worldY: worldY - (Math.random() * 2000 - 1000) - (plane.vy * 50),
                size: 80 + Math.random() * 100,
                speed: 1 + Math.random() * 1.5,
                opacity: 0.6 + Math.random() * 0.4,
                isHeavenly: true
            });
        }

        // --- SPAWNING LOGIC with LUCK ---
        const luckLevel = playerData.upgrades.luck || 0;
        const luckBonus = luckLevel * 0.2; // 20% increase in frequency per level

        // Spawn Planets (Space only: 5k to 15k)
        if (frames % 300 === 0 && currentAlt > 5000 && currentAlt < 15000) {
            planets.push({
                x: plane.x + (canvas.width + 500 + Math.random() * 1000),
                worldY: worldY - (Math.random() * 2000 - 1000) - (plane.vy * 80),
                size: 80 + Math.random() * 150,
                type: Math.floor(Math.random() * 3) // 0: Mars-like, 1: Ringed, 2: Blue
            });
        }

        // --- RADIAL SPAWNING LOGIC (180 degrees ahead/up/down) ---
        // Generates things in a half-circle ahead of the player
        if (distance < 110000) { // Stop spawning powerups after 110k distance
            const spawnRadius = 800 + Math.random() * 400;
            const generatePoint = () => {
                const angle = (Math.random() - 0.5) * Math.PI; // -90 to 90 degrees
                return {
                    x: plane.x + Math.cos(angle) * spawnRadius,
                    worldY: worldY - Math.sin(angle) * spawnRadius
                };
            };

            // Spawn Coins relative to current position (Keep coins spawning!)
            if (frames % Math.max(10, Math.floor(40 / (1 + luckBonus))) === 0) {
                const p = generatePoint();
                coins.push({ x: p.x, worldY: Math.max(50, p.worldY), size: 15, angle: 0 });
            }

            // Spawn Obstacles (Only below heaven)
            if (frames % Math.max(20, Math.floor(80 / (1 + luckBonus * 0.5))) === 0 && currentAlt < 15000) {
                const isAtLowAlt = currentAlt < 1000;
                let type = 'bird';
                if (isAtLowAlt) {
                    const balloonProb = 0.3 + (luckLevel * 0.1);
                    type = Math.random() < balloonProb ? 'balloon' : 'bird';
                } else {
                    type = 'satellite';
                }

                const p = generatePoint();
                obstacles.push({
                    x: p.x,
                    worldY: Math.max(60, p.worldY),
                    size: 20 + Math.random() * 15,
                    type: type
                });
            }

            // Spawn & Update Boosters (Air)
            if (frames % Math.max(50, Math.floor(150 / (1 + luckBonus))) === 0) {
                const p = generatePoint();
                boosters.push({
                    x: p.x,
                    worldY: Math.max(100, p.worldY),
                    size: 30
                });
            }

            // Spawn & Update Fuel Items
            if (frames % Math.max(100, Math.floor(250 / (1 + luckBonus))) === 0) {
                const p = generatePoint();
                fuelItems.push({
                    x: p.x,
                    worldY: Math.max(150, p.worldY),
                    size: 25
                });
            }
        } else {
            // After 110k, only spawn coins sporadically so they can finish the run
            if (frames % 60 === 0) {
                coins.push({ x: plane.x + 1000, worldY: worldY + (Math.random() * 400 - 200), size: 15, angle: 0 });
            }
        }

        // Update Clouds
        for (let i = clouds.length - 1; i >= 0; i--) {
            clouds[i].x -= plane.vx * clouds[i].speed;
            // Clouds are background, so their Y is fixed relative to worldY, but they scroll with camera
            if (clouds[i].x < -200) clouds.splice(i, 1);
        }

        // Update Coins
        for (let i = coins.length - 1; i >= 0; i--) {
            coins[i].x -= plane.vx;
            coins[i].angle += 0.1;

            const coinScreenY = canvas.height - 100 - (coins[i].worldY - cameraY);
            const dx = plane.x - coins[i].x;
            const dy = plane.y - coinScreenY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Magnetism Logic - Disables after 100k
            const magnetLvl = playerData.upgrades.magnet || 0;
            const legendaryMagnetMult = isLegendaryPowerActive() ? 2 : 1;
            const magnetRadius = magnetLvl * 60 * legendaryMagnetMult; // Increased radius slightly
            if (magnetRadius > 0 && dist < magnetRadius) {
                // Aggressive pull: factor increases as distance decreases
                const pullFactor = 0.15 + (magnetLvl * 0.02);
                coins[i].x += dx * pullFactor;
                coins[i].worldY += (worldY - coins[i].worldY) * pullFactor;

                // Extra horizontal boost if the plane is going very fast
                if (plane.vx > 10) {
                    coins[i].x += (plane.vx * 0.5); // Counteract relative movement
                }
            }

            if (dist < 40) {
                const valueLvl = playerData.upgrades.coinValue || 0;
                const coinBonus = valueLvl * 5;
                sessionCoins += 10 + coinBonus;
                createExplosion(coins[i].x, coinScreenY, '#fbbf24', 5);
                coins.splice(i, 1);
            } else if (coins[i].x < -100) {
                coins.splice(i, 1);
            }
        }

        // Update Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= plane.vx + 2;

            // Collision
            const obsScreenY = canvas.height - 100 - (obstacles[i].worldY - cameraY);
            const dx = plane.x - obstacles[i].x;
            const dy = plane.y - obsScreenY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 35) {
                if (obstacles[i].type === 'balloon') {
                    plane.vy = isLegendaryPowerActive() ? -12 : -6; // Powerful boost if legendary and active
                    createExplosion(obstacles[i].x, obsScreenY, '#ef4444', 10);
                } else {
                    if (activeShields > 0 && shieldCooldown <= 0) {
                        activeShields--;
                        updateShieldHUD();
                        shieldCooldown = 60; // 1 second cooldown
                        createExplosion(obstacles[i].x, obsScreenY, '#38bdf8', 20); // Shield effect
                    } else {
                        plane.vx *= 0.5;
                        plane.vy += 2;
                        createExplosion(obstacles[i].x, obsScreenY, '#475569', 10);
                    }
                }
                obstacles.splice(i, 1);
            } else if (obstacles[i].x < -100) {
                obstacles.splice(i, 1);
            }
        }

        // Update shield cooldown
        if (shieldCooldown > 0) shieldCooldown--;

        for (let i = boosters.length - 1; i >= 0; i--) {
            boosters[i].x -= plane.vx;
            const bScreenY = canvas.height - 100 - (boosters[i].worldY - cameraY);
            const dist = Math.sqrt((plane.x - boosters[i].x) ** 2 + (plane.y - bScreenY) ** 2);
            if (dist < 50) {
                const isGodMode = isLegendaryPowerActive();
                plane.vx += isGodMode ? 10 : 5;
                plane.vy = isGodMode ? -10 : -5;
                createExplosion(boosters[i].x, bScreenY, '#38bdf8', 15);
                boosters.splice(i, 1);
            } else if (boosters[i].x < -100) boosters.splice(i, 1);
        }

        for (let i = fuelItems.length - 1; i >= 0; i--) {
            fuelItems[i].x -= plane.vx;
            const fScreenY = canvas.height - 100 - (fuelItems[i].worldY - cameraY);
            const dist = Math.sqrt((plane.x - fuelItems[i].x) ** 2 + (plane.y - fScreenY) ** 2);
            if (dist < 45) {
                plane.fuel = Math.min(plane.maxFuel, plane.fuel + plane.maxFuel * 0.15);
                createExplosion(fuelItems[i].x, fScreenY, '#ef4444', 8);
                fuelItems.splice(i, 1);
            } else if (fuelItems[i].x < -100) fuelItems.splice(i, 1);
        }

        // Spawn & Update Trampolines (Ground)
        const trampLevel = playerData.upgrades.trampoline || 0;
        const trampLuckFactor = 1 + (luckLevel * 0.1);
        if (trampLevel > 0 && frames % Math.max(60, Math.floor(180 / trampLuckFactor)) === 0 && currentAlt < 200) {
            const legendaryTrampMult = hasLegendary() ? 3 : 1;
            trampolines.push({
                x: canvas.width + 100,
                worldY: 0,
                width: (100 + (trampLevel - 1) * 40) * legendaryTrampMult
            });
        }
        for (let i = trampolines.length - 1; i >= 0; i--) {
            trampolines[i].x -= plane.vx;
            const tScreenY = canvas.height - 100 + cameraY;
            if (Math.abs(plane.x - trampolines[i].x) < (trampolines[i].width / 2) && Math.abs(plane.y - tScreenY) < 40) {
                plane.vy = -13;
                plane.vx += 2;
                createExplosion(trampolines[i].x, tScreenY, '#4ade80', 10);
                trampolines.splice(i, 1);
            } else if (trampolines[i].x < -200) trampolines.splice(i, 1);
        }

        // Update Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx - (plane.vx * 0.2);
            p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) particles.splice(i, 1);
        }

        // Star twinkling
        stars.forEach(s => s.twinkle += 0.05);
    }
}

function createExplosion(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: 2 + Math.random() * 5,
            life: 1,
            color: color
        });
    }
}

function draw() {
    ctx.save();

    // Apply Shake to entire scene
    if (screenShake > 0) {
        ctx.translate(Math.random() * screenShake - screenShake / 2, Math.random() * screenShake - screenShake / 2);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'FLYING' || gameState === 'RESULTS' || gameState === 'LAUNCHING') {
        const altitude = worldY / 10;

        // Draw Ground/Floor
        const floorY = canvas.height - 100 + cameraY;
        if (floorY < canvas.height + 200) {
            ctx.fillStyle = '#1a472a';
            ctx.fillRect(0, floorY, canvas.width, canvas.height);
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(0, floorY, canvas.width, 20); // Grass top
        }

        // Draw Record Line
        if (playerData.bestDistance > 0) {
            const recordX = plane.x + (playerData.bestDistance - distance) * 10;
            if (recordX > -100 && recordX < canvas.width + 100) {
                ctx.setLineDash([10, 10]);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(recordX, 0);
                ctx.lineTo(recordX, canvas.height);
                ctx.stroke();
                ctx.setLineDash([]);

                // Record Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '12px Outfit';
                ctx.textAlign = 'center';
                ctx.fillText('🏆 TU RÉCORD', recordX, 50);
            }
        }

        // Draw Stars (Space feel)
        if (altitude > 1000) {
            ctx.fillStyle = 'white';
            stars.forEach(s => {
                // Stars fade in from 1k to 3k, then fade out as we reach heaven (15k+)
                let starAlpha = Math.min(1, (altitude - 1000) / 2000);
                if (altitude > 15000) starAlpha *= Math.max(0, 1 - (altitude - 15000) / 3000);

                const opacity = (Math.sin(s.twinkle) + 1) * 0.5 * starAlpha;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }

        // Draw Clouds
        clouds.forEach(c => {
            const screenY = canvas.height - 100 - (c.worldY - cameraY);
            if (c.isHeavenly) {
                // Golden/Bright White clouds for heaven
                ctx.fillStyle = `rgba(255, 255, 250, ${c.opacity})`;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#fbbf24';
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.arc(c.x, screenY, c.size, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 0.5, screenY - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
            ctx.arc(c.x - c.size * 0.5, screenY - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Draw Coins
        coins.forEach(c => {
            const screenY = canvas.height - 100 - (c.worldY - cameraY);
            ctx.save();
            ctx.translate(c.x, screenY);
            ctx.rotate(c.angle);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(0, 0, c.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#d97706';
            ctx.font = '12px bold Arial';
            ctx.textAlign = 'center';
            ctx.fillText('$', 0, 4);
            ctx.restore();
        });

        // Draw Planets
        planets.forEach(p => {
            p.x -= plane.vx * 0.1; // Parallax
            const screenY = canvas.height - 100 - (p.worldY - cameraY);

            ctx.save();
            ctx.translate(p.x, screenY);

            const colors = [['#f87171', '#991b1b'], ['#fbbf24', '#92400e'], ['#60a5fa', '#1e3a8a']];
            const pColors = colors[p.type];

            const grad = ctx.createRadialGradient(-p.size * 0.2, -p.size * 0.2, 0, 0, 0, p.size);
            grad.addColorStop(0, pColors[0]);
            grad.addColorStop(1, pColors[1]);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.type === 1) { // Rings
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.3, Math.PI / 6, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            if (p.x < -800) planets.splice(planets.indexOf(p), 1);
        });

        // Draw Boosters
        boosters.forEach(b => {
            const screenY = canvas.height - 100 - (b.worldY - cameraY);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', b.x, screenY);
        });

        // Draw Fuel Items
        fuelItems.forEach(f => {
            const screenY = canvas.height - 100 - (f.worldY - cameraY);
            ctx.fillStyle = '#ef4444';
            ctx.font = '35px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⛽', f.x, screenY);
        });

        // Draw Trampolines
        trampolines.forEach(t => {
            const screenY = canvas.height - 100 + cameraY;
            const w = t.width;
            const h = 25;
            ctx.save();
            ctx.translate(t.x, screenY);

            // Legs
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-w / 2 + 10, 0); ctx.lineTo(-w / 2 + 10, 25);
            ctx.moveTo(w / 2 - 10, 0); ctx.lineTo(w / 2 - 10, 25);
            ctx.stroke();

            // Bed (Grey)
            ctx.fillStyle = '#64748b';
            ctx.fillRect(-w / 2, -5, w, 10);

            // Pulse effect
            ctx.fillStyle = '#4ade80';
            ctx.globalAlpha = 0.3;
            ctx.fillRect(-w / 2, -12, w, 7);
            ctx.restore();
            ctx.globalAlpha = 1;
        });

        // Draw Obstacles
        obstacles.forEach(o => {
            const screenY = canvas.height - 100 - (o.worldY - cameraY);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (o.type === 'bird') {
                ctx.font = `${o.size * 1.5}px Arial`;
                ctx.fillText('🐦', o.x, screenY);
            } else if (o.type === 'satellite') {
                ctx.font = `${o.size * 2}px Arial`;
                ctx.fillText('🛰️', o.x, screenY);
            } else { // balloon
                ctx.font = `${o.size * 1.5}px Arial`;
                ctx.fillText('🎈', o.x, screenY);
            }
        });

        // Draw Plane (Emoji)
        ctx.save();

        let displayX = plane.x;
        let displayY = plane.y;

        // Shake if perfect or boost
        let shake = (plane.boostActive && plane.fuel > 0) ? 2 : 0;
        if (isLaunchingPerfect) shake = 8; // Intense shake for perfect

        if (shake > 0) {
            displayX += (Math.random() - 0.5) * shake;
            displayY += (Math.random() - 0.5) * shake;
        }

        ctx.translate(displayX, displayY);

        const targetAngle = isLaunchingPerfect ? 0 : Math.atan2(plane.vy, plane.vx);
        plane.angle += (targetAngle - plane.angle) * 0.1;
        ctx.rotate(plane.angle);

        // Draw Shield Aura
        if (activeShields > 0) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Golden Aura (Legendary status)
        if (hasLegendary()) {
            ctx.shadowBlur = 35;
            ctx.shadowColor = '#fbbf24';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, 45, 0, Math.PI * 2);
            ctx.stroke();

            // Draw a slightly yellow tint over the plane if legendary
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.fillText('✈️', 0, 0);

        // Height label below plane
        const altText = Math.floor(worldY / 10) + " m";
        ctx.font = 'bold 14px Outfit';
        const textWidth = ctx.measureText(altText).width;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        const padding = 6;
        const rectW = textWidth + padding * 2;
        const rectH = 20;
        const rectX = -rectW / 2;
        const rectY = 40;
        ctx.roundRect(rectX, rectY, rectW, rectH, 5);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.fillText(altText, 0, rectY + rectH / 2);

        // Reset shadow
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    ctx.restore(); // Restore global shake
}

init();
