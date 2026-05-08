// Variables Globales de UI
let currentView = 'view-main';

// Variables de Jugador y P2P
let myNickname = localStorage.getItem('arcade_nickname') || "";
let peer = null;
let isHost = false;
let connections = []; // Array de conexiones si soy Host
let hostConnection = null; // Conexión al host si soy Cliente
let myId = "";
let roomCode = "";
let players = []; // { id, nickname, status }

// Variables de Juego
let gameMode = 'solo'; // 'solo', 'coop', 'comp'
let rows = 10, cols = 10, totalMines = 10;
let board = [];
let firstClick = true;
let gameOver = false;
let flagsCount = 0;
let timerInterval;
let timeElapsed = 0;
let actionMode = 'reveal'; // 'reveal' or 'flag'
let pendingRows = 10, pendingCols = 10;
let previousSizeView = 'view-solo-size';

// Variables Modo Cooperativo
let turnOrder = [];
let currentTurnIndex = 0;

// ----------------------------------------------------
// UI y Utilidades
// ----------------------------------------------------
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    currentView = viewId;
}

function setActionMode(mode) {
    actionMode = mode;
    document.getElementById('btn-mode-reveal').classList.remove('active');
    document.getElementById('btn-mode-flag').classList.remove('active');
    document.getElementById('btn-mode-' + mode).classList.add('active');
}

function checkNicknameAndGoMulti() {
    if (!myNickname) {
        document.getElementById('modal-nickname').classList.add('active');
    } else {
        document.getElementById('display-nickname').innerText = myNickname;
        showView('view-multi-menu');
    }
}

function promptNickname() {
    document.getElementById('nickname-input').value = myNickname;
    document.getElementById('modal-nickname').classList.add('active');
}

function saveNickname() {
    const val = document.getElementById('nickname-input').value.trim();
    if (val) {
        myNickname = val;
        localStorage.setItem('arcade_nickname', myNickname);
        document.getElementById('modal-nickname').classList.remove('active');
        document.getElementById('display-nickname').innerText = myNickname;
        showView('view-multi-menu');
    }
}

// ----------------------------------------------------
// Configuración de Partida
// ----------------------------------------------------
function chooseSize(r, c, modeOrigin) {
    pendingRows = r;
    pendingCols = c;
    previousSizeView = modeOrigin === 'solo' ? 'view-solo-size' : 'view-multi-size';
    if (modeOrigin === 'solo') {
        gameMode = 'solo';
    }
    showView('view-difficulty');
}

function goBackFromDifficulty() {
    showView(previousSizeView);
}

function selectDifficulty(diff) {
    let percentage = 0.10;
    if (diff === 'facil') percentage = 0.10;
    else if (diff === 'normal') percentage = 0.15;
    else if (diff === 'dificil') percentage = 0.20;
    else if (diff === 'extremo') percentage = 0.30;
    
    totalMines = Math.floor(pendingRows * pendingCols * percentage);
    
    if (gameMode === 'solo') {
        rows = pendingRows; cols = pendingCols; 
        initGameUI();
    } else {
        createRoom(pendingRows, pendingCols, totalMines);
    }
}

function setupMultiplayer(mode) {
    gameMode = mode;
    document.getElementById('multi-mode-display').innerText = mode === 'coop' ? 'Cooperativo' : 'Competitivo';
    showView('view-multi-size');
}

// ----------------------------------------------------
// Sistema P2P - HOST
// ----------------------------------------------------
function createRoom(r, c, mines) {
    rows = r; cols = c; totalMines = mines;
    isHost = true;
    connections = [];
    players = [];
    
    const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
    roomCode = shortId;
    
    peer = new Peer(shortId);
    
    peer.on('open', (id) => {
        myId = id;
        players.push({ id: myId, nickname: myNickname, status: 'playing' });
        updateLobbyUI();
        showView('view-lobby');
        document.getElementById('room-code-display').innerText = id;
        document.getElementById('host-controls').style.display = 'block';
        document.getElementById('lobby-status').innerText = "Esperando jugadores...";
    });

    peer.on('connection', (conn) => {
        setupHostConnection(conn);
    });

    peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
            createRoom(r, c); // Reintento
        } else {
            alert("Error P2P: " + err);
        }
    });
}

function setupHostConnection(conn) {
    conn.on('open', () => {
        connections.push(conn);
        
        // El cliente debe enviar su nickname primero
        conn.on('data', (data) => {
            if (data.type === 'JOIN') {
                players.push({ id: conn.peer, nickname: data.nickname, status: 'playing' });
                updateLobbyUI();
                broadcast({ type: 'PLAYERS_UPDATE', players: players });
            } 
            else if (data.type === 'MOVE') {
                handleClientMove(conn.peer, data.x, data.y, data.action);
            }
            else if (data.type === 'COMP_STATUS') {
                updateCompStatus(conn.peer, data.status);
            }
        });
    });

    conn.on('close', () => {
        connections = connections.filter(c => c.peer !== conn.peer);
        players = players.filter(p => p.id !== conn.peer);
        updateLobbyUI();
        broadcast({ type: 'PLAYERS_UPDATE', players: players });
    });
}

function broadcast(data) {
    connections.forEach(conn => conn.send(data));
}

// ----------------------------------------------------
// Sistema P2P - CLIENTE
// ----------------------------------------------------
function joinRoom() {
    const code = document.getElementById('join-code').value.toUpperCase();
    if (!code) return;
    
    document.getElementById('join-status').innerText = "Conectando...";
    isHost = false;
    roomCode = code;
    
    peer = new Peer();
    
    peer.on('open', (id) => {
        myId = id;
        hostConnection = peer.connect(code);
        
        hostConnection.on('open', () => {
            hostConnection.send({ type: 'JOIN', nickname: myNickname });
            showView('view-lobby');
            document.getElementById('room-code-display').innerText = code;
            document.getElementById('host-controls').style.display = 'none';
        });

        hostConnection.on('data', (data) => {
            if (data.type === 'PLAYERS_UPDATE') {
                players = data.players;
                updateLobbyUI();
            } else if (data.type === 'START_GAME') {
                gameMode = data.mode;
                rows = data.rows; cols = data.cols; totalMines = data.totalMines;
                board = data.board;
                turnOrder = data.turnOrder;
                currentTurnIndex = 0;
                initGameUI(true);
            } else if (data.type === 'SYNC_BOARD') {
                board = data.board;
                renderBoard();
                checkWinCondition();
            } else if (data.type === 'NEXT_TURN') {
                currentTurnIndex = data.turnIndex;
                updateTurnUI();
            } else if (data.type === 'GAME_OVER_COOP') {
                board = data.board;
                renderBoard();
                endGame(false, data.loser, data.stats);
            } else if (data.type === 'WIN_COOP') {
                board = data.board;
                renderBoard();
                endGame(true, null, data.stats);
            } else if (data.type === 'COMP_PROGRESS') {
                players = data.players;
                updateProgressUI();
            } else if (data.type === 'GAME_OVER_COMP') {
                endGame(true, data.winner);
            } else if (data.type === 'RETURN_LOBBY') {
                backToLobbyUI();
            }
        });

        hostConnection.on('close', () => {
            alert("El host cerró la sala.");
            leaveRoom();
        });
    });

    peer.on('error', (err) => {
        document.getElementById('join-status').innerText = "Error: " + err;
    });
}

// ----------------------------------------------------
// Lógica de Lobby
// ----------------------------------------------------
function updateLobbyUI() {
    const ul = document.getElementById('lobby-players');
    ul.innerHTML = "";
    players.forEach(p => {
        const li = document.createElement('li');
        li.innerText = p.nickname + (p.id === myId ? " (Tú)" : "");
        ul.appendChild(li);
    });
    document.getElementById('players-count').innerText = players.length;
}

function leaveRoom() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    showView('view-main');
}

// ----------------------------------------------------
// Inicialización del Juego
// ----------------------------------------------------
function startGame() {
    if (!isHost) return;
    
    turnOrder = players.map(p => p.id);
    currentTurnIndex = 0;
    
    // Generar un tablero inicial plano (sin minas asignadas todavía en Coop, pero sí en Comp)
    createEmptyBoard();
    if (gameMode === 'comp') {
        generateMinesRandomly(); // En competitivo pre-generamos para todos
    }

    const config = {
        type: 'START_GAME',
        mode: gameMode,
        rows: rows, cols: cols, totalMines: totalMines,
        board: board,
        turnOrder: turnOrder
    };
    broadcast(config);
    initGameUI(gameMode === 'comp'); 
}

function createEmptyBoard() {
    board = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            board.push({
                r, c, 
                isMine: false, 
                isRevealed: false, 
                isFlagged: false, 
                neighborMines: 0,
                revealedBy: null,
                flaggedBy: null
            });
        }
    }
}

function generateMinesRandomly(safeR = -1, safeC = -1) {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const idx = Math.floor(Math.random() * board.length);
        const cell = board[idx];
        
        // Evitar la casilla segura (y sus adyacentes para una mejor experiencia)
        let isSafeZone = false;
        if (safeR !== -1) {
            if (Math.abs(cell.r - safeR) <= 1 && Math.abs(cell.c - safeC) <= 1) {
                isSafeZone = true;
            }
        }

        if (!cell.isMine && !isSafeZone) {
            cell.isMine = true;
            minesPlaced++;
        }
    }
    calculateNeighbors();
}

function calculateNeighbors() {
    for (let i = 0; i < board.length; i++) {
        const cell = board[i];
        if (cell.isMine) continue;
        
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = cell.r + dr;
                const nc = cell.c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    const nIdx = nr * cols + nc;
                    if (board[nIdx].isMine) count++;
                }
            }
        }
        cell.neighborMines = count;
    }
}

function initGameUI(preGenerated = false) {
    showView('view-game');
    firstClick = !preGenerated;
    gameOver = false;
    flagsCount = 0;
    timeElapsed = 0;
    document.getElementById('mines-count').innerText = totalMines;
    document.getElementById('timer').innerText = "0";
    document.getElementById('game-status').innerText = "";
    document.getElementById('game-status').style.color = "var(--text)";
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameOver) {
            timeElapsed++;
            document.getElementById('timer').innerText = timeElapsed;
        }
    }, 1000);

    if (gameMode === 'coop') {
        document.getElementById('turn-indicator').style.display = 'block';
        updateTurnUI();
    } else {
        document.getElementById('turn-indicator').style.display = 'none';
    }

    if (gameMode === 'comp') {
        document.getElementById('players-progress').style.display = 'block';
        updateProgressUI();
    } else {
        document.getElementById('players-progress').style.display = 'none';
    }

    if (gameMode === 'solo') {
        createEmptyBoard();
    }
    
    document.getElementById('btn-retry-solo').style.display = 'none';
    document.getElementById('modal-multi-summary').classList.remove('active');

    // Configurar Grid CSS
    const boardEl = document.getElementById('board');
    boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
    boardEl.style.gridTemplateRows = `repeat(${rows}, var(--cell-size))`;

    renderBoard();
}

function updateTurnUI() {
    if (gameMode !== 'coop') return;
    const currentId = turnOrder[currentTurnIndex];
    const player = players.find(p => p.id === currentId);
    const nameEl = document.getElementById('current-turn-name');
    nameEl.innerText = player ? player.nickname : "Desconocido";
    
    if (currentId === myId) {
        nameEl.style.color = "var(--primary)";
        nameEl.innerText += " (TÚ)";
    } else {
        nameEl.style.color = "var(--secondary)";
    }
}

// ----------------------------------------------------
// Lógica de Interacción en el Tablero
// ----------------------------------------------------
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = "";
    
    board.forEach((cell, idx) => {
        const div = document.createElement('div');
        div.className = 'cell';
        if (cell.isRevealed) {
            div.classList.add('revealed');
            if (cell.isMine) {
                div.classList.add('mine');
                div.innerText = '💣';
            } else if (cell.neighborMines > 0) {
                div.innerText = cell.neighborMines;
                div.classList.add(`num-${cell.neighborMines}`);
            }
        } else if (cell.isFlagged) {
            div.classList.add('flag');
            div.innerText = '🚩';
        }

        // Eventos
        div.addEventListener('click', () => {
            if (actionMode === 'flag') {
                handleCellClick(idx, 'flag');
            } else {
                handleCellClick(idx, 'reveal');
            }
        });
        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleCellClick(idx, 'flag');
        });

        boardEl.appendChild(div);
    });

    // Actualizar conteo de banderas local (para todos los modos)
    let fCount = board.filter(c => c.isFlagged).length;
    document.getElementById('mines-count').innerText = totalMines - fCount;
}

function handleCellClick(idx, action) {
    if (gameOver) return;

    if (gameMode === 'coop') {
        const currentTurnId = turnOrder[currentTurnIndex];
        if (currentTurnId !== myId) {
            return; // No es mi turno
        }
        
        const cell = board[idx];
        if (cell.isRevealed) return; // Ya revelada
        
        // Enviar acción al host
        if (isHost) {
            handleClientMove(myId, cell.r, cell.c, action);
        } else {
            hostConnection.send({ type: 'MOVE', x: cell.c, y: cell.r, action: action });
        }
    } else {
        // Solo o Competitivo (juego local)
        const cell = board[idx];
        if (cell.isRevealed) return;
        
        if (action === 'flag') {
            cell.isFlagged = !cell.isFlagged;
            renderBoard();
            return;
        }

        if (cell.isFlagged) return; // No se puede revelar una bandera

        if (firstClick) {
            generateMinesRandomly(cell.r, cell.c);
            firstClick = false;
        }

        revealCell(cell.r, cell.c, myId);
        renderBoard();

        if (cell.isMine) {
            endGame(false);
            if (gameMode === 'comp') notifyCompStatus('Derrota 💀');
        } else {
            checkWinCondition();
        }
    }
}

// ----------------------------------------------------
// Host maneja los movimientos Coop
// ----------------------------------------------------
function handleClientMove(playerId, x, y, action) {
    if (gameOver || gameMode !== 'coop') return;
    
    // Verificar turno
    if (turnOrder[currentTurnIndex] !== playerId) return;

    const cell = board.find(c => c.r === y && c.c === x);
    if (!cell || cell.isRevealed) return;

    if (action === 'flag') {
        cell.isFlagged = !cell.isFlagged;
        cell.flaggedBy = cell.isFlagged ? playerId : null;
        broadcast({ type: 'SYNC_BOARD', board: board });
        renderBoard();
        return; // No se pasa el turno al poner bandera
    }

    if (cell.isFlagged) return;

    if (firstClick) {
        generateMinesRandomly(cell.r, cell.c);
        firstClick = false;
    }

    revealCell(cell.r, cell.c, playerId);

    if (cell.isMine) {
        // En Coop, si uno toca mina, pierden todos
        gameOver = true;
        revealAllMines();
        const p = players.find(p => p.id === playerId);
        const loserName = p ? p.nickname : "Alguien";
        const coopStats = calculateCoopStats();
        broadcast({ type: 'GAME_OVER_COOP', board: board, loser: loserName, stats: coopStats });
        renderBoard();
        endGame(false, loserName, coopStats);
    } else {
        broadcast({ type: 'SYNC_BOARD', board: board });
        renderBoard();
        if (!checkWinConditionCoop()) {
            nextTurn();
        }
    }
}

function nextTurn() {
    currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
    broadcast({ type: 'NEXT_TURN', turnIndex: currentTurnIndex });
    updateTurnUI();
}

function checkWinConditionCoop() {
    const won = board.every(c => c.isMine || c.isRevealed);
    if (won) {
        gameOver = true;
        const coopStats = calculateCoopStats();
        broadcast({ type: 'WIN_COOP', board: board, stats: coopStats });
        endGame(true, null, coopStats);
        return true;
    }
    return false;
}

function calculateCoopStats() {
    let stats = {};
    players.forEach(p => {
        stats[p.id] = { name: p.nickname, revealed: 0, flagsCorrect: 0, flagsWrong: 0 };
    });

    board.forEach(c => {
        if (c.isRevealed && c.revealedBy && stats[c.revealedBy]) {
            stats[c.revealedBy].revealed++;
        }
        if (c.isFlagged && c.flaggedBy && stats[c.flaggedBy]) {
            if (c.isMine) {
                stats[c.flaggedBy].flagsCorrect++;
            } else {
                stats[c.flaggedBy].flagsWrong++;
            }
        }
    });
    
    // Convert to array and sort by performance
    let sortedStats = Object.values(stats);
    sortedStats.sort((a, b) => (b.revealed + b.flagsCorrect) - (a.revealed + a.flagsCorrect));
    return sortedStats;
}

// ----------------------------------------------------
// Mecánicas Núcleo Buscaminas
// ----------------------------------------------------
function revealCell(r, c, playerId = null) {
    const idx = r * cols + c;
    const cell = board[idx];
    
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    cell.revealedBy = playerId;

    if (cell.isMine) return; // Explota

    if (cell.neighborMines === 0) {
        // Revelar adyacentes
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell(nr, nc, playerId);
                }
            }
        }
    }
}

function revealAllMines() {
    board.forEach(c => {
        if (c.isMine) c.isRevealed = true;
    });
}

function checkWinCondition() {
    const won = board.every(c => c.isMine || c.isRevealed);
    if (won) {
        endGame(true);
        if (gameMode === 'comp') notifyCompStatus('¡Ganador! 🏆');
    }
}

function endGame(win, extraName = null, stats = null) {
    gameOver = true;
    clearInterval(timerInterval);
    const statusEl = document.getElementById('game-status');
    
    if (gameMode === 'comp') {
        if (win && extraName && extraName !== myNickname) {
            statusEl.innerText = `¡${extraName} ha ganado!`;
            statusEl.style.color = "var(--primary)";
        } else if (win) {
            statusEl.innerText = "¡HAS GANADO!";
            statusEl.style.color = "var(--primary)";
        } else {
            statusEl.innerText = "¡HAS PERDIDO!";
            statusEl.style.color = "var(--danger)";
        }
    } else if (gameMode === 'coop') {
        if (win) {
            statusEl.innerText = "¡GANARON EL JUEGO!";
            statusEl.style.color = "var(--primary)";
        } else {
            statusEl.innerText = extraName ? `¡${extraName} pisó una mina!` : "¡PERDIERON!";
            statusEl.style.color = "var(--danger)";
        }
    } else {
        if (win) {
            statusEl.innerText = "¡HAS GANADO!";
            statusEl.style.color = "var(--primary)";
        } else {
            statusEl.innerText = "¡HAS PERDIDO!";
            statusEl.style.color = "var(--danger)";
        }
    }

    if (!win) {
        revealAllMines();
        renderBoard();
    }

    if (gameMode === 'solo') {
        document.getElementById('btn-retry-solo').style.display = 'inline-block';
    } else {
        setTimeout(() => {
            showMultiSummary(win, extraName, stats);
        }, 2000);
    }
}

function retryGame() {
    initGameUI();
}

function showMultiSummary(win, extraName, stats) {
    document.getElementById('modal-multi-summary').classList.add('active');
    const title = document.getElementById('summary-title');
    const content = document.getElementById('summary-content');

    if (gameMode === 'coop') {
        title.innerText = win ? "¡Victoria Cooperativa!" : "Derrota Cooperativa";
        
        let html = win 
            ? `<p>Han logrado limpiar el campo de minas en equipo.</p><p>Tiempo: ${timeElapsed}s</p>`
            : `<p>💥 Lamentablemente <strong>${extraName || 'alguien'}</strong> pisó una mina.</p><p>Tiempo: ${timeElapsed}s</p>`;
            
        if (stats) {
            html += `<hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">`;
            html += `<h4 style="margin-bottom: 10px; color: var(--secondary);">Resumen de Jugadores</h4>`;
            html += `<ul style="list-style: none; padding: 0; font-size: 0.9rem; max-height: 250px; overflow-y: auto;">`;
            
            stats.forEach(s => {
                html += `<li style="margin-bottom: 10px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                    <strong>${s.name}</strong><br>
                    <span style="color: var(--primary);">⛏️ Casillas: ${s.revealed}</span> | 
                    <span style="color: var(--accent);">🚩 Correctas: ${s.flagsCorrect}</span> | 
                    <span style="color: var(--danger);">❌ Erróneas: ${s.flagsWrong}</span>
                </li>`;
            });
            html += `</ul>`;
        }
        content.innerHTML = html;
    } else if (gameMode === 'comp') {
        title.innerText = "Fin del Torneo";
        let winnerText = win && (!extraName || extraName === myNickname) ? "¡TÚ GANASTE!" : `Ganador: ${extraName}`;
        content.innerHTML = `<p>${winnerText}</p>`;
    }
    
    document.getElementById('btn-return-lobby').style.display = isHost ? 'inline-block' : 'none';
    document.getElementById('summary-wait-msg').style.display = isHost ? 'none' : 'block';
}

function returnToLobbyFromSummary() {
    if (isHost) {
        broadcast({ type: 'RETURN_LOBBY' });
        backToLobbyUI();
    }
}

function backToLobbyUI() {
    document.getElementById('modal-multi-summary').classList.remove('active');
    showView('view-lobby');
}

// ----------------------------------------------------
// Competitivo
// ----------------------------------------------------
function notifyCompStatus(status) {
    if (isHost) {
        updateCompStatus(myId, status);
    } else if (hostConnection) {
        hostConnection.send({ type: 'COMP_STATUS', status: status });
    }
}

function updateCompStatus(playerId, status) {
    if (!isHost) return;
    const p = players.find(p => p.id === playerId);
    if (p) p.status = status;
    broadcast({ type: 'COMP_PROGRESS', players: players });
    updateProgressUI();

    if (status.includes('Ganador')) {
        gameOver = true;
        const winnerName = p ? p.nickname : "Alguien";
        broadcast({ type: 'GAME_OVER_COMP', winner: winnerName });
        endGame(true, winnerName);
    }
}

function updateProgressUI() {
    const ul = document.getElementById('progress-list');
    ul.innerHTML = "";
    players.forEach(p => {
        const li = document.createElement('li');
        li.innerText = `${p.nickname}: ${p.status === 'playing' ? 'Jugando...' : p.status}`;
        ul.appendChild(li);
    });
}

function leaveGame() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    showView('view-main');
}
