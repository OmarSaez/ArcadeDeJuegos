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
const speedValEl = document.getElementById('speed-val');
const bestSpeedDisplay = document.getElementById('best-speed');
const bestAltDisplay = document.getElementById('best-alt');
const hudBestSpeed = document.getElementById('hud-best-speed');
const statDistCont = document.getElementById('stat-dist');
const statAltCont = document.getElementById('stat-alt');
const statSpeedCont = document.getElementById('stat-speed');
const statCoinsCont = document.getElementById('stat-coins');
const bestCoinsDisplay = document.getElementById('best-coins');
let timeScale = 1;
let hasShowedWinBannerThisRun = false;
let sessionMaxSpeed = 0;

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
let speedBonusCoins = 0;
let ultraBonusCoins = 0;
let launchPower = 0;
let powerDirection = 1;
let launchPhase = 'ANGLE'; // ANGLE or POWER
let launchAngle = 0;
let angleDirection = 1;
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
    bestSpeed: 0,
    bestAltitude: 0,
    bestCoins: 0,
    hasUnlockedWarp: false,
    lastAngle: 45,
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
    thrust: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    aero: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    fuel: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    boost: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    magnet: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    coinValue: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    trampoline: [100, 200, 350, 550, 800, 1100, 1500, 1950, 2450, 3000],
    shield: [150, 300, 500, 800, 1200, 1600, 2000, 2400, 2700, 3000],
    luck: [200, 400, 800, 1400, 2100, 2900, 3700, 4300, 4700, 5000],
    precision: [100, 250, 450, 700, 1000, 1400, 1800, 2200, 2600, 3000],
    legendary: [10000]
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

const UPGRADE_DESCRIPTIONS = {
    thrust: "Aumenta la fuerza con la que sales disparado. ¡Imprescindible para empezar con buen pie!",
    aero: "Reduce la fricción con el viento. Cuanta más aerodinámica tengas, menos velocidad perderás al volar.",
    fuel: "Aumenta el tamaño total del tanque de combustible. Te permite usar el impulsor durante más tiempo.",
    boost: "Potencia la fuerza del impulsor. Subirás más rápido y ganarás más inercia con cada ráfaga.",
    magnet: "Aumenta el radio de atracción de las monedas. ¡No tendrás que pasar justo encima para recogerlas!",
    coinValue: "Multiplica el valor de cada moneda que recoges. Ideal para acelerar tu progreso económico.",
    trampoline: "Desbloquea trampolines en el suelo y aumenta su tamaño. Te dan un impulso extra si vas a ras de suelo.",
    shield: "Te protege de choques accidentales. Cada 2 niveles te otorga un escudo adicional que se regenera en cada vuelo.",
    luck: "Aumenta la probabilidad de que aparezcan objetos beneficiosos y reduce los obstáculos en tu camino.",
    precision: "Ralentiza el movimiento de la barra de lanzamiento, permitiéndote acertar el 'PERFECT' con mayor facilidad.",
    legendary: "El máximo honor. Dobla tu gasolina, imán y trampolines. Además, elimina el límite de altura del mundo. ¡Solo para leyendas!"
};

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
        playerData.bestSpeed = parsed.bestSpeed || 0;
        playerData.bestAltitude = parsed.bestAltitude || 0;
        playerData.bestCoins = parsed.bestCoins || 0;
        playerData.hasWon = parsed.hasWon || false;
        playerData.hasUnlockedWarp = parsed.hasUnlockedWarp || false;
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
    // Keep plane grounded on resize
    if (gameState === 'MENU' || gameState === 'LAUNCHING') {
        plane.y = canvas.height - 100;
        plane.x = Math.min(100, canvas.width * 0.1);
    }
}

function updateUIStrings() {
    if (bestDistDisplay) bestDistDisplay.textContent = Math.floor(playerData.bestDistance);
    if (bestSpeedDisplay) bestSpeedDisplay.textContent = Math.floor(playerData.bestSpeed);
    if (bestAltDisplay) bestAltDisplay.textContent = Math.floor(playerData.bestAltitude);
    if (bestCoinsDisplay) bestCoinsDisplay.textContent = Math.floor(playerData.bestCoins);
    if (hudBestSpeed) hudBestSpeed.textContent = Math.floor(playerData.bestSpeed);
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

    // Check for game completion and Legendary Card state
    const legendaryCard = document.getElementById('legendary-card');
    if (legendaryCard) {
        const isMaxed = isGameMaxed();
        const btn = legendaryCard.querySelector('.buy-btn');
        const icon = legendaryCard.querySelector('.up-icon');
        const title = legendaryCard.querySelector('h3');
        const desc = legendaryCard.querySelector('p');

        if (!isMaxed) {
            legendaryCard.classList.add('locked-legendary');
            icon.textContent = '❓';
            title.textContent = 'MISTERIO';
            desc.textContent = 'Debes comprar todas las mejoras anteriores primero para desbloquear este objeto...';
            btn.textContent = 'BLOQUEADO';
            btn.disabled = true;
            btn.style.background = '#334155';
        } else {
            legendaryCard.classList.remove('locked-legendary');
            icon.textContent = '👑';
            title.textContent = 'ALAS DE LEYENDA';
            desc.textContent = UPGRADE_DESCRIPTIONS.legendary;
            
            if (hasLegendary()) {
                btn.textContent = '👑 ADQUIRIDO 👑';
                btn.disabled = true;
                btn.style.background = 'linear-gradient(to right, #fbbf24, #f59e0b)';
                btn.style.color = 'black';
            } else {
                const cost = UPGRADE_COSTS.legendary[0];
                btn.innerHTML = `${cost} <span class="coin">💰</span>`;
                btn.disabled = playerData.totalCoins < cost;
                btn.style.background = ''; // Revert to default
                btn.style.color = '';
            }
        }
    }

    if (isGameMaxed()) {
        const titleEl = document.querySelector('.shop-header h2');
        if (titleEl) {
            if (hasLegendary()) {
                titleEl.innerHTML = '✨ RECUERDO DEL LEYENDA ✨';
            } else {
                titleEl.innerHTML = '✨ TALLER DEL LEYENDA ✨';
            }
            titleEl.style.background = 'linear-gradient(to right, #fbbf24, #f59e0b)';
            titleEl.style.webkitBackgroundClip = 'text';
            titleEl.style.webkitTextFillColor = 'transparent';
        }
    }

    updateShieldHUD();
}

function isGameMaxed() {
    // Game is "maxed" for normal upgrades to reveal legendary
    const normalUpgrades = ['thrust', 'aero', 'fuel', 'boost', 'magnet', 'coinValue', 'trampoline', 'shield', 'luck', 'precision'];
    return normalUpgrades.every(key => (playerData.upgrades[key] || 0) >= 10);
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
                bestSpeed: 0,
                bestAltitude: 0,
                bestCoins: 0,
                hasWon: false,
                hasUnlockedWarp: false,
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

    // Info buttons for upgrades
    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const type = btn.parentElement.dataset.upgrade;
            showUpgradeDetail(type);
        };
    });

    const closeBtnDetail = document.getElementById('btn-close-detail');
    if (closeBtnDetail) {
        closeBtnDetail.onclick = () => {
            document.getElementById('detail-modal').classList.add('hidden');
        };
    }
}

function showUpgradeDetail(type) {
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('detail-title');
    const text = document.getElementById('detail-text');
    const icon = document.getElementById('detail-icon');

    if (!UPGRADE_DESCRIPTIONS[type]) return;

    // Get info from card to match aesthetic
    const card = document.querySelector(`.upgrade-card[data-upgrade="${type}"]`);
    if (!card) return;

    const cardTitle = card.querySelector('h3').textContent;
    const cardIcon = card.querySelector('.up-icon').textContent;

    title.textContent = cardTitle.toUpperCase();
    text.textContent = UPGRADE_DESCRIPTIONS[type];
    icon.textContent = cardIcon;

    modal.classList.remove('hidden');
}

function lockLaunchAngle() {
    launchPhase = 'POWER';
    document.getElementById('phase-angle').classList.add('hidden');
    document.getElementById('phase-power').classList.remove('hidden');
    
    // Tiny delay to prevent the same tap from starting power charging immediately 
    // if the user is very fast or on some touch devices
    isHoldingPower = false; 
}

function handleInteractionStart(e) {
    if (e && e.target && (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.menu-content'))) return;
    if (e && e.type === 'touchstart' && (gameState === 'LAUNCHING' || gameState === 'FLYING')) e.preventDefault();
    if (e && e.type === 'keydown' && e.code !== 'Space') return;

    if (gameState === 'LAUNCHING') {
        if (launchPhase === 'ANGLE') {
            lockLaunchAngle();
        } else {
            isHoldingPower = true;
        }
    } else if (gameState === 'FLYING' && plane.fuel > 0) {
        plane.boostActive = true;
    }
}

function handleInteractionEnd(e) {
    if (e && e.type === 'touchstart' && (gameState === 'LAUNCHING' || gameState === 'FLYING')) e.preventDefault();
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
    } else if (screen === 'SHOP') {
        gameState = 'SHOP';
        shopMenu.classList.remove('hidden');
        updateUIStrings();
    } else if (screen === 'LAUNCH') {
        gameState = 'LAUNCHING';
        resetGame(); // Ensure new stats/width are applied
        launchPhase = 'ANGLE';
        launchScreen.classList.remove('hidden');
        document.getElementById('phase-angle').classList.remove('hidden');
        document.getElementById('phase-power').classList.add('hidden');
        
        launchPower = 0;
        powerDirection = 1;
        launchAngle = 0;
        angleDirection = 1;
        
        if (powerBar) powerBar.style.width = '0%';
        
        // Show last angle ghost arrow
        const ghost = document.getElementById('angle-arrow-last');
        if (ghost) ghost.style.transform = `rotate(${-playerData.lastAngle}deg)`;
    } else if (screen === 'FLYING') {
        gameState = 'FLYING';
        hud.classList.remove('hidden');
        
        // Time Warp Visibility
        const isLegendary = hasLegendary();
        const isUnlocked = playerData.hasUnlockedWarp;
        
        if (isLegendary || isUnlocked) {
            timeWarpControls.classList.remove('hidden');
            if (isLegendary) {
                document.querySelectorAll('.legendary-only').forEach(el => el.classList.remove('hidden'));
            } else {
                document.querySelectorAll('.legendary-only').forEach(el => el.classList.add('hidden'));
            }
        } else {
            timeWarpControls.classList.add('hidden'); 
            document.querySelectorAll('.legendary-only').forEach(el => el.classList.add('hidden'));
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

    if (playerData.totalCoins >= cost && level < 10) {
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
    speedBonusCoins = 0;
    ultraBonusCoins = 0;
    worldY = 0;
    cameraY = 0;
    plane.x = 100;
    plane.y = canvas.height - 100;
    plane.vx = 0;
    sessionMaxSpeed = 0;
    launchPower = 0;
    powerDirection = 1;
    if (powerBar) powerBar.style.width = '0%';
    if (hudBestSpeed) hudBestSpeed.textContent = '0';

    // Reset record feedback
    if (statDistCont) statDistCont.classList.remove('record-broken');
    if (statAltCont) statAltCont.classList.remove('record-broken');
    if (statSpeedCont) statSpeedCont.classList.remove('record-broken');
    if (statCoinsCont) statCoinsCont.classList.remove('record-broken');

    const resCoinsBase = document.getElementById('res-coins-base');
    const resCoinsEl = document.getElementById('res-coins');
    if (resCoinsBase) resCoinsBase.classList.add('hidden');
    if (resCoinsEl) resCoinsEl.classList.remove('final-glow');

    plane.vx = 0;
    plane.vy = 0;
    plane.angle = 0;
    plane.fuel = 100;
    const legendaryFuelMult = hasLegendary() ? 2 : 1;
    plane.maxFuel = (100 + (playerData.upgrades.fuel) * 12.5) * legendaryFuelMult;
    plane.fuel = plane.maxFuel;
    
    // Dynamic Boost Bar Width based on capacity
    const boostContainer = document.getElementById('boost-bar-container');
    if (boostContainer) {
        // Starts very small (approx 10-15% of original 200px) to show early limitation
        const baseWidth = 35; 
        const extraWidth = (plane.maxFuel - 100) * 2.5; // Dramatic expansion
        boostContainer.style.width = Math.min(1000, (baseWidth + extraWidth)) + 'px';
    }

    coins = [];
    obstacles = [];
    boosters = [];
    fuelItems = [];
    planets = [];
    trampolines = [];
    particles = [];
    clouds = [];
    stars = [];
    activeShields = Math.ceil((playerData.upgrades.shield || 0) / 2);
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
    const powerMult = 5 + (thrustLvl * 3);
    let finalPower = (launchPower / 100) * powerMult;
    
    // Save this angle as the last used
    playerData.lastAngle = launchAngle;
    saveData();

    // Convert angle to Radian (Invert because 0 is horizontal right, but our gauge 0 is ground)
    // Gauge: 0 is right (0deg), 90 is up (-90deg in canvas or -PI/2)
    const rad = -(launchAngle * Math.PI / 180);

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

            plane.vx = Math.cos(rad) * finalPower;
            plane.vy = Math.sin(rad) * finalPower;
            plane.angle = rad; // Set initial angle
            perfectParticlesTimer = 180; // 3 seconds at 60fps

            showScreen('FLYING');
            setTimeout(() => perfText.classList.remove('show'), 1000);
        }, 1200);

    } else {
        screenShake = 10;
        plane.vx = Math.cos(rad) * finalPower;
        plane.vy = Math.sin(rad) * finalPower;
        plane.angle = rad; // Set initial angle
        showScreen('FLYING');
    }
}

function calculateResults() {
    const distanceBonus = Math.floor(distance / 10);
    const initialBase = sessionCoins + distanceBonus; 

    const banner = document.getElementById('new-record-banner');
    const winBanner = document.getElementById('game-won-banner');
    const bonusList = document.getElementById('bonus-list');
    const resCoinsEl = document.getElementById('res-coins');
    const resCoinsBase = document.getElementById('res-coins-base');

    // Reset UI
    if (banner) banner.classList.add('hidden');
    if (winBanner) winBanner.classList.add('hidden');
    if (bonusList) {
        bonusList.innerHTML = '';
        bonusList.classList.add('hidden');
    }
    if (resCoinsBase) {
        resCoinsBase.classList.add('hidden');
        resCoinsBase.textContent = '';
    }
    resCoinsEl.classList.remove('final-glow');

    resDist.textContent = Math.floor(distance);
    resAlt.textContent = Math.floor(maxAltitude);
    const resTopSpeed = document.getElementById('res-top-speed');
    if (resTopSpeed) resTopSpeed.textContent = sessionMaxSpeed;

    // Determine Multiplier Records
    const records = [];
    if (distance > playerData.bestDistance) {
        records.push({ label: 'DISTANCIA', value: distance, key: 'bestDistance' });
    }
    if (maxAltitude > playerData.bestAltitude) {
        records.push({ label: 'ALTURA', value: maxAltitude, key: 'bestAltitude' });
    }
    if (sessionMaxSpeed > playerData.bestSpeed) {
        records.push({ label: 'VELOCIDAD', value: sessionMaxSpeed, key: 'bestSpeed' });
    }

    // Initial Display
    resCoinsEl.textContent = `+${initialBase}`;
    let currentTotal = initialBase;
    let delay = 600;

    // STEP 1: Speed Bonus (Additive)
    if (speedBonusCoins > 0) {
        setTimeout(() => {
            if (resCoinsBase) {
                resCoinsBase.textContent = `+${currentTotal}`;
                resCoinsBase.classList.remove('hidden');
            }
            if (bonusList) bonusList.classList.remove('hidden');

            const item = document.createElement('div');
            item.className = 'bonus-item';
            item.style.color = '#fbbf24';
            item.textContent = `¡BONO SUPERVELOCIDAD: +${speedBonusCoins}💰!`;
            bonusList.appendChild(item);

            const previousTotal = currentTotal;
            currentTotal += speedBonusCoins;

            animateCoinCounter(previousTotal, currentTotal);
        }, delay);
        delay += 1200;
    }

    // STEP 1.5: Ultra Speed Bonus (Additive)
    if (ultraBonusCoins > 0) {
        setTimeout(() => {
            if (resCoinsBase) {
                resCoinsBase.textContent = `+${currentTotal}`;
                resCoinsBase.classList.remove('hidden');
            }
            if (bonusList) bonusList.classList.remove('hidden');

            const item = document.createElement('div');
            item.className = 'bonus-item';
            item.style.color = '#f472b6'; // Fluorescent Pink
            item.textContent = `¡BONO ULTRAVELOCIDAD: +${ultraBonusCoins}💰!`;
            bonusList.appendChild(item);

            const previousTotal = currentTotal;
            currentTotal += ultraBonusCoins;

            animateCoinCounter(previousTotal, currentTotal, () => {
                if (records.length === 0) finalizeResults(currentTotal, []);
            });
        }, delay);
        delay += 1200;
    }

    // STEP 2: Record Multipliers (Multiplicative)
    if (records.length > 0) {
        records.forEach((rec, index) => {
            setTimeout(() => {
                if (banner) banner.classList.remove('hidden');
                if (bonusList) bonusList.classList.remove('hidden');

                // If no speed bonus happened, the strike-through starts here
                if (index === 0 && speedBonusCoins <= 0 && resCoinsBase) {
                    resCoinsBase.textContent = `+${currentTotal}`;
                    resCoinsBase.classList.remove('hidden');
                } else if (resCoinsBase) {
                    // Update strike-through to the previous total before this multiplier
                    resCoinsBase.textContent = `+${currentTotal}`;
                }

                const item = document.createElement('div');
                item.className = 'bonus-item';
                item.textContent = `¡Bono x1.5 por RECORD ${rec.label}!`;
                bonusList.appendChild(item);

                const previousTotal = currentTotal;
                currentTotal = Math.floor(currentTotal * 1.5);

                animateCoinCounter(previousTotal, currentTotal, () => {
                    if (index === records.length - 1) finalizeResults(currentTotal, records);
                });
            }, delay);
            delay += 1200;
        });
    } else if (speedBonusCoins <= 0) {
        finalizeResults(currentTotal, []);
    }

    // Show Win Banner
    if (hasLegendary() && !playerData.hasWon) {
        if (winBanner) winBanner.classList.remove('hidden');
        playerData.hasWon = true;
    }
}

function animateCoinCounter(start, end, onComplete) {
    let displayVal = start;
    const resCoinsEl = document.getElementById('res-coins');
    const increment = Math.ceil((end - start) / 15);
    const counterId = setInterval(() => {
        displayVal += increment;
        if (displayVal >= end) {
            displayVal = end;
            clearInterval(counterId);
            if (onComplete) onComplete();
        }
        resCoinsEl.textContent = `+${displayVal}`;
    }, 30);
}

function finalizeResults(finalCoins, brokenRecordsArray) {
    // Update historical records
    brokenRecordsArray.forEach(rec => {
        playerData[rec.key] = rec.value;
    });

    playerData.totalCoins += finalCoins;

    // Add final celebration glow
    const resCoinsEl = document.getElementById('res-coins');
    if (resCoinsEl) resCoinsEl.classList.add('final-glow');

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
    if (gameState === 'LAUNCHING') {
        if (launchPhase === 'ANGLE') {
            // Constant speed for angle selection, no upgrades affect it
            const speedFactor = 1.2;
            launchAngle += speedFactor * angleDirection;
            if (launchAngle >= 90 || launchAngle <= 0) angleDirection *= -1;
            
            const arrow = document.getElementById('angle-arrow-current');
            const display = document.getElementById('display-angle');
            if (arrow) arrow.style.transform = `rotate(${-launchAngle}deg)`;
            if (display) display.textContent = Math.floor(launchAngle);
        } else if (isHoldingPower) {
            const precisionLevel = playerData.upgrades.precision || 0;
            const speedFactor = Math.max(0.5, 4 - (precisionLevel * 0.35)); 
            launchPower += speedFactor * powerDirection;
            if (launchPower >= 100 || launchPower <= 0) powerDirection *= -1;

            const displayPower = launchPower > 98 ? 100 : launchPower;
            powerBar.style.width = displayPower + '%';
        }
    }

    if (gameState === 'FLYING') {
        frames++;

        // --- STABLE PHYSICS ---
        const aeroLvl = playerData.upgrades.aero || 0;
        // Base drag reduction from Aero
        let dragAmount = plane.drag * Math.max(0.1, (1 - aeroLvl * 0.075));
        // Legendary Bonus reduces drag significantly and extends top speed
        // Only active for the first 100k of flight to allow ending the run
        const isGodMode = isLegendaryPowerActive();
        const legendaryDragMult = isGodMode ? 0.3 : 1.0;
        // Natural air resistance
        plane.vx *= (1 - dragAmount * legendaryDragMult);

        // --- DIVE PHYSICS ---
        // Gravity helps horizontal speed when diving (vy > 0)
        // Subtler conversion for a gradual, challenging acceleration
        if (plane.vy > 0) {
            plane.vx += plane.vy * 0.003; // Reduced from 0.008 to make it more vertical
            // Stronger horizontal damping when falling to prevent excessive travel
            plane.vx *= 0.998;
            if (plane.vy > 10) plane.vx *= 0.99;
        }

        // Horizontal Speed Logic
        // In God Mode or high skill runs, we allow much higher speeds
        const maxVX = isGodMode ? 300 : 80; // Increased significantly
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
        // SMART LIFT: During the initial burst phase (perfectParticlesTimer), 
        // we use low lift (0.004) to respect the selected launch angle.
        // Once the burst ends or if you boost manually, we return to normal plane lift (0.015).
        const currentLiftCoeff = (perfectParticlesTimer > 0) ? 0.004 : plane.lift;
        
        // If the plane is falling (vy > 0), kill ALL lift to prevent gliding
        const currentLift = (plane.vy > 0) ? 0 : Math.min(0.4, plane.vx * currentLiftCoeff * (isGodMode ? 1.5 : 1.0));
        plane.vy -= currentLift;

        // Cap downward vertical speed to prevent physics explosion
        // (Upward speed is now unlimited by skill and luck!)
        // Cap downward vertical speed based on the historical record
        // We want it to be 15% less than the record so you don't break speed records just by falling
        const recordSpeedUnits = (playerData.bestSpeed || 350) / 10;
        const maxVY = Math.max(30, recordSpeedUnits * 0.85);
        if (plane.vy > maxVY) plane.vy = maxVY;
        // Note: No upward cap (plane.vy < -maxVY) as requested!

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
            const boostPower = 0.2 + (boostLvl * 0.05); // Halved increment (was 0.1)
            plane.vy -= boostPower;
            
            // If you boost during launch, end the "trajectory lock" phase immediately
            if (perfectParticlesTimer > 0) perfectParticlesTimer = 0;
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

        // Camera Logic: Keep plane in view even at extreme speeds
        const targetCameraY = worldY - (canvas.height * 0.6); // Adjusted offset

        // Dynamic Lerp: The faster we move vertically, the faster the camera snaps
        const vertSpeed = Math.abs(plane.vy);
        const lerpFactor = Math.min(0.5, 0.1 + (vertSpeed * 0.02));
        cameraY += (targetCameraY - cameraY) * lerpFactor;

        // Safety: Hard snap camera if plane is about to leave screen
        const relativeY = worldY - cameraY;
        if (relativeY > canvas.height * 0.8) cameraY = worldY - canvas.height * 0.8;
        if (relativeY < canvas.height * 0.2) cameraY = worldY - canvas.height * 0.2;

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
                const bounceMult = 1 + (shieldLvl * 0.025);
                plane.vy = -26 * bounceMult; // Double normal trampoline (+ level bonus)
                plane.vx += 3;
                createExplosion(plane.x, canvas.height - 100 + cameraY, '#38bdf8', 30);
                worldY = 1; // Kick off ground
            } else {
                worldY = 0;
                // High impact penalty: lose 70% of speed when hitting ground
                // This prevents bouncing forever at 400km/h
                plane.vx *= 0.3;
                plane.vy *= -0.1; // Minimal bounce

                if (plane.vx < 0.5) {
                    plane.vx = 0;
                    showScreen('RESULTS');
                }
            }
        }

        // Tops out? 50k if base, 200k if legendary
        const worldTop = hasLegendary() ? 2000000 : 500000;
        if (worldY > worldTop) worldY = worldTop;

        // Max altitude tracker
        const currentAlt = worldY / 10;
        if (currentAlt > maxAltitude) maxAltitude = currentAlt;

        // Feedback when reaching Space Thresholds
        if (currentAlt >= 15000 && currentAlt < 15500) {
            ctx.fillStyle = '#60a5fa';
            ctx.font = 'bold 28px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('✨ CIELO ALCANZADO ✨', canvas.width / 2, 200);
        } else if (currentAlt >= 25000 && currentAlt < 25500) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 28px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('☀️ EL ÉTER DORADO ☀️', canvas.width / 2, 200);
        } else if (currentAlt >= 40000 && currentAlt < 40500) {
            ctx.fillStyle = '#a855f7';
            ctx.font = 'bold 28px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('🔮 CREPÚSCULO PROFUNDO 🔮', canvas.width / 2, 200);
        } else if (currentAlt >= 50000 && currentAlt < 50500) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('🚀 FRONTERA ESPACIAL SUPERADA 🚀', canvas.width / 2, 200);
        }

        // Feedback when reaching the Black Hole (Edge of Reality)
        if (currentAlt >= 190000) {
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 32px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('🕳️ EL HORIZONTE DE SUCESOS 🕳️', canvas.width / 2, 250);
        }

        // Feedback when Legendary Power ends

        // Updates Displays
        distVal.textContent = Math.floor(distance);
        altVal.textContent = Math.max(0, Math.floor(maxAltitude));

        const distanceBonus = Math.floor(distance / 10);
        const totalCurrentCoins = sessionCoins + distanceBonus;

        // Visual Record Feedback: Turn yellow if global record is broken during this run
        if (distance > playerData.bestDistance && statDistCont) statDistCont.classList.add('record-broken');
        if (maxAltitude > playerData.bestAltitude && statAltCont) statAltCont.classList.add('record-broken');
        if (sessionMaxSpeed > playerData.bestSpeed && statSpeedCont) statSpeedCont.classList.add('record-broken');
        if (totalCurrentCoins > playerData.bestCoins && statCoinsCont) statCoinsCont.classList.add('record-broken');

        // Speed calculation - Now uses TOTAL VELOCITY (Magnitude)
        const totalVel = Math.sqrt(plane.vx ** 2 + plane.vy ** 2);
        const currentSpeed = Math.floor(totalVel * 10);
        if (currentSpeed > sessionMaxSpeed) {
            sessionMaxSpeed = currentSpeed;
            if (hudBestSpeed) hudBestSpeed.textContent = sessionMaxSpeed;
        }
        if (speedValEl) speedValEl.textContent = currentSpeed;

        // Reveal Warp Controls at 1500 km/h and UNLOCK PERMANENTLY
        if (currentSpeed >= 1500 && !playerData.hasUnlockedWarp) {
            playerData.hasUnlockedWarp = true;
            saveData();
            timeWarpControls.classList.remove('hidden');
        }

        // High Speed Effects (> 1000 km/h)
        if (currentSpeed > 1000) {
            const speedExcess = currentSpeed - 1000;
            // Add gradual screen shake
            screenShake = Math.max(screenShake, Math.min(12, speedExcess * 0.01));

            // Spawn fire particles
            const fireIntensity = Math.min(5, Math.floor(speedExcess / 200) + 1);
            const isUltra = currentSpeed >= 2000;
            for (let i = 0; i < fireIntensity; i++) {
                particles.push({
                    x: plane.x - 20 - (Math.random() * 20),
                    y: plane.y + (Math.random() * 20 - 10),
                    vx: -plane.vx * 0.2,
                    vy: (Math.random() - 0.5) * 5,
                    size: 10 + Math.random() * 15,
                    life: 0.6 + Math.random() * 0.4,
                    color: isUltra 
                        ? (Math.random() > 0.5 ? '#f472b6' : '#db2777') // Neon Pink or Magenta
                        : (Math.random() > 0.5 ? '#f97316' : '#ef4444') // Orange or Red
                });
            }
            
            // Speed Bonus: 2 coins per second (1 every 30 frames)
            if (frames % 30 === 0) {
                speedBonusCoins += 1;
                // Parallel Ultra Speed Bonus: additional 2 per second (Stacking)
                if (currentSpeed >= 2000) {
                    ultraBonusCoins += 1;
                }
            }
        }

        coinVal.textContent = totalCurrentCoins;
        boostBar.style.width = (plane.fuel / plane.maxFuel * 100) + '%';

        // Sky background transition based on height (Scaled to 50k)
        const skyHeightRatio = Math.min(1, Math.max(0, currentAlt / 50000));
        skyLayers.style.transform = `translateY(${skyHeightRatio * 95}%)`;

        // Spawn Decorative Clouds (Only if low/medium or HEAVEN 15k-20k)
        if (currentAlt < 10000 || (currentAlt >= 14000 && currentAlt <= 21000)) {
            const cloudProb = (currentAlt >= 14000) ? 0.08 : 0.04;
            if (Math.random() < cloudProb) {
                clouds.push({
                    x: canvas.width + 100,
                    y: Math.random() * canvas.height,
                    size: 50 + Math.random() * 100,
                    speed: 0.2 + Math.random() * 0.5
                });
            }
        }

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
        const luckBonus = luckLevel * 0.1; // 10% increase in frequency per level

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
                const isAtLowAlt = currentAlt < 2000;
                let type = 'bird';
                if (isAtLowAlt) {
                    const balloonProb = 0.3 + (luckLevel * 0.1);
                    type = Math.random() < balloonProb ? 'balloon' : 'bird';
                } else if (currentAlt >= 15000 && currentAlt < 25000) {
                    type = 'angel'; // Thematic obstacles for Heaven
                } else if (currentAlt >= 10000 && currentAlt < 40000) {
                    type = Math.random() < 0.6 ? 'meteor' : 'satellite';
                } else if (currentAlt >= 40000 && currentAlt < 100000) {
                    type = Math.random() < 0.5 ? 'ufo' : 'alien';
                } else if (currentAlt >= 100000) {
                    type = Math.random() < 0.8 ? 'meteor' : 'alien'; // Asteroid belt vibes
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
            const magnetRadius = magnetLvl * 30 * legendaryMagnetMult; // Increased radius slightly
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
                const coinBonus = valueLvl * 2.5;
                sessionCoins += 10 + coinBonus;
                createExplosion(coins[i].x, coinScreenY, '#fbbf24', 5);
                coins.splice(i, 1);
            } else if (coins[i].x < -100) {
                coins.splice(i, 1);
            }
        }

        // Update Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const o = obstacles[i];
            o.x -= plane.vx + 2;

            // UFO / Alien movement (Horizontal oscillation)
            if (o.type === 'ufo' || o.type === 'alien') {
                o.x += Math.sin(frames * 0.05) * 5;
            }
            
            // Angel movement (Gentle vertical floating)
            if (o.type === 'angel') {
                o.worldY += Math.sin(frames * 0.04) * 3;
            }

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
                const refillPercent = 0.2 + Math.random() * 0.2; // 20% to 40%
                plane.fuel = Math.min(plane.maxFuel, plane.fuel + plane.maxFuel * refillPercent);
                createExplosion(fuelItems[i].x, fScreenY, '#ef4444', 8);
                fuelItems.splice(i, 1);
            } else if (fuelItems[i].x < -100) fuelItems.splice(i, 1);
        }

        // Spawn & Update Trampolines (Ground)
        const trampLevel = playerData.upgrades.trampoline || 0;
        const trampLuckFactor = 1 + (luckLevel * 0.1);
        const isLegendary = hasLegendary();
        // legendary spawns less frequently to avoid ground coverage
        const spawnInterval = isLegendary ? 150 : Math.max(60, Math.floor(180 / trampLuckFactor));
        
        if (trampLevel > 0 && frames % spawnInterval === 0 && currentAlt < 150) {
            const legendaryTrampMult = isLegendary ? 1.5 : 1; // Reduced from 3x
            trampolines.push({
                x: canvas.width + 100,
                worldY: 0,
                width: (100 + (trampLevel - 1) * 17.7) * legendaryTrampMult
            });
        }
        for (let i = trampolines.length - 1; i >= 0; i--) {
            trampolines[i].x -= plane.vx;
            const tScreenY = canvas.height - 100 + cameraY;
            if (Math.abs(plane.x - trampolines[i].x) < (trampolines[i].width / 2) && Math.abs(plane.y - tScreenY) < 40) {
                plane.vy = -13;
                plane.vx += 2;
                createExplosion(trampolines[i].x, tScreenY, '#22d3ee', 10);
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

            // Pulse effect (Neon Cyan for contrast)
            ctx.fillStyle = '#22d3ee';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(-w / 2, -12, w, 7);
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            ctx.strokeRect(-w / 2, -12, w, 7);
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
            } else if (o.type === 'meteor') {
                ctx.font = `${o.size * 2.2}px Arial`;
                ctx.fillText('☄️', o.x, screenY);
            } else if (o.type === 'ufo') {
                ctx.font = `${o.size * 2}px Arial`;
                ctx.fillText('🛸', o.x, screenY);
                // Add a small neon glow for UFOs
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#4ade80';
            } else if (o.type === 'alien') {
                ctx.font = `${o.size * 1.8}px Arial`;
                ctx.fillText('👾', o.x, screenY);
            } else if (o.type === 'angel') {
                ctx.font = `${o.size * 2}px Arial`;
                ctx.fillText('👼', o.x, screenY);
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'white';
            } else { // balloon
                ctx.font = `${o.size * 1.5}px Arial`;
                ctx.fillText('🎈', o.x, screenY);
            }
            ctx.shadowBlur = 0; // Reset shadow
        });

        // Draw The Black Hole (At the absolute top of the world)
        const topY = hasLegendary() ? 2000000 : 500000;
        const blackHoleScreenY = canvas.height - 100 - (topY - cameraY);
        if (blackHoleScreenY > -500 && blackHoleScreenY < canvas.height + 500) {
            ctx.save();
            ctx.translate(canvas.width / 2, blackHoleScreenY);
            ctx.rotate(frames * 0.02);
            
            // Outer glow
            const grad = ctx.createRadialGradient(0, 0, 50, 0, 0, 300);
            grad.addColorStop(0, '#000');
            grad.addColorStop(0.5, '#4c1d95'); // Purple deep space
            grad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, 300, 0, Math.PI * 2);
            ctx.fill();
            
            // The Hole
            ctx.fillStyle = 'black';
            ctx.shadowBlur = 50;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            ctx.shadowBlur = 0;
        }

        // Draw Plane (Emoji)
        ctx.save();

        let displayX = plane.x;
        let displayY = plane.y;

        // Shake if perfect, boost, or very high speed
        let shake = (plane.boostActive && plane.fuel > 0) ? 2 : 0;
        if (isLaunchingPerfect) shake = 8; // Intense shake for perfect
        
        // Add speed-based tremble over 1000 km/h
        const totalVelPlane = Math.sqrt(plane.vx ** 2 + plane.vy ** 2);
        const currentSpeedPlane = totalVelPlane * 10;
        if (currentSpeedPlane > 1000) {
            shake += Math.min(5, (currentSpeedPlane - 1000) * 0.005);
        }
        // Extra tremble for Ultra Speed (> 2000)
        if (currentSpeedPlane > 2000) {
            shake += Math.min(6, (currentSpeedPlane - 2000) * 0.01);
        }

        if (shake > 0) {
            displayX += (Math.random() - 0.5) * shake;
            displayY += (Math.random() - 0.5) * shake;
        }

        ctx.translate(displayX, displayY);

        // Fire Aura for high speeds (> 1000 km/h)
        const drawTotalVel = Math.sqrt(plane.vx ** 2 + plane.vy ** 2);
        const drawCurrentSpeed = drawTotalVel * 10;
        if (drawCurrentSpeed > 1000) {
            const intensity = Math.min(1, (drawCurrentSpeed - 1000) / 1500);
            const isUltra = drawCurrentSpeed > 2000;
            const mainColor = isUltra ? '#f472b6' : '#f97316'; // Pink vs Orange
            const glowColor = isUltra ? '#db2777' : '#ef4444'; // Magenta vs Red
            
            ctx.save();
            ctx.shadowBlur = (isUltra ? 40 : 20) * intensity;
            ctx.shadowColor = glowColor;
            ctx.globalAlpha = intensity * (isUltra ? 0.8 : 0.6);
            const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 50 + (intensity * (isUltra ? 50 : 30)));
            grad.addColorStop(0, mainColor);
            grad.addColorStop(0.6, glowColor);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.scale(isUltra ? 2 : 1.5, 0.8); // Even longer trail for ultra
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const targetAngle = Math.atan2(plane.vy, plane.vx);
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

        // Height & Speed label below plane
        const altText = Math.floor(worldY / 10) + " m";
        const totalVel = Math.sqrt(plane.vx ** 2 + plane.vy ** 2);
        const speedText = Math.floor(totalVel * 10) + " km/h";
        ctx.font = 'bold 12px Outfit';
        const w1 = ctx.measureText(altText).width;
        const w2 = ctx.measureText(speedText).width;
        const textWidth = Math.max(w1, w2);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        const padding = 8;
        const rectW = textWidth + padding * 2;
        const rectH = 34; // Taller for two lines
        const rectX = -rectW / 2;
        const rectY = 40;
        ctx.roundRect(rectX, rectY, rectW, rectH, 6);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'white';
        ctx.fillText(altText, 0, rectY + 13);
        ctx.fillText(speedText, 0, rectY + 27);

        // Reset shadow
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    ctx.restore(); // Restore global shake
}

init();
