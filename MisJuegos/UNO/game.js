/**
 * UNO Game Logic - P2P Multiplayer Edition with Official Rules
 */

const COLORS = ['red', 'blue', 'green', 'yellow'];
const ACTIONS = {
    SKIP: 'skip',
    REVERSE: 'reverse',
    DRAW2: 'draw2',
    WILD: 'wild',
    WILD_DRAW4: 'wildDraw4'
};

class Card {
    constructor(color, tipo, value, accion = 'none') {
        this.color = color;
        this.tipo = tipo;
        this.value = value;
        this.accion = accion;
    }

    render() {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${this.color}`;
        let displayValue = this.value;
        if (this.accion === ACTIONS.SKIP) displayValue = '⊘';
        if (this.accion === ACTIONS.REVERSE) displayValue = '⇄';
        if (this.accion === ACTIONS.DRAW2) displayValue = '+2';
        if (this.accion === ACTIONS.WILD) displayValue = 'W';
        if (this.accion === ACTIONS.WILD_DRAW4) displayValue = '+4';

        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="corner top-left">${displayValue}</div>
                <div class="center-oval">
                    <span class="value">${displayValue}</span>
                </div>
                <div class="corner bottom-right">${displayValue}</div>
            </div>
        `;
        return cardEl;
    }
}

class NetworkManager {
    constructor() {
        this.peer = null;
        this.connections = [];
        this.isHost = false;
        this.myId = '';
        this.myNickname = '';
        this.playersReady = [];
        this.clockOffset = 0;
    }

    initHost(nickname, onOpen) {
        this.isHost = true;
        this.myNickname = nickname;
        const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.peer = new Peer(shortId);

        this.peer.on('open', (id) => {
            this.myId = id;
            this.playersReady = [{ id: id, nickname: nickname, isMe: true }];
            onOpen(id);
        });

        this.peer.on('connection', (conn) => {
            this.setupConnection(conn);
        });

        this.peer.on('error', (err) => {
            if (err.type === 'unavailable-id') this.initHost(nickname, onOpen);
            else alert("Error P2P: " + err);
        });
    }

    joinGame(nickname, hostId, onOpen, onError) {
        this.isHost = false;
        this.myNickname = nickname;
        const timeout = setTimeout(() => {
            if (!this.peer || this.connections.length === 0) {
                this.cleanup();
                onError("No se encontró la sala. Verifica el código.");
            }
        }, 5000);

        this.peer = new Peer();
        this.peer.on('open', (id) => {
            this.myId = id;
            const conn = this.peer.connect(hostId, { metadata: { nickname: nickname } });

            conn.on('open', () => {
                clearTimeout(timeout);
                this.setupConnection(conn);
                
                // Trigger clock sync with host
                conn.send({ type: 'PING_SYNC', clientTime: Date.now() });
                
                onOpen();
            });

            conn.on('error', (err) => {
                clearTimeout(timeout);
                onError("Error al conectar.");
                this.cleanup();
            });
        });

        this.peer.on('error', (err) => {
            clearTimeout(timeout);
            onError("La sala no existe o no responde.");
            this.cleanup();
        });
    }

    cleanup() {
        if (this.peer) { this.peer.destroy(); this.peer = null; }
        this.connections = [];
        this.playersReady = [];
    }

    setupConnection(conn) {
        if (!this.isHost) {
            this.connections = [conn];
        }

        conn.on('open', () => {
            if (this.isHost) {
                const newPlayer = { id: conn.peer, nickname: conn.metadata.nickname, isMe: false };
                this.playersReady.push(newPlayer);
                this.connections.push(conn);
                this.broadcast({ type: 'LOBBY_UPDATE', players: this.playersReady });
                updateLobbyUI(this.playersReady);
            }
        });

        conn.on('data', (data) => {
            if (data.type === 'PING_SYNC') {
                conn.send({ type: 'PONG_SYNC', clientTime: data.clientTime, hostTime: Date.now() });
            } else if (data.type === 'PONG_SYNC') {
                const now = Date.now();
                const rtt = now - data.clientTime;
                const latency = rtt / 2;
                this.clockOffset = data.hostTime - (data.clientTime + latency);
            } else if (data.type === 'LOBBY_UPDATE') {
                this.playersReady = data.players;
                updateLobbyUI(this.playersReady);
            } else if (data.type === 'START_GAME') {
                window.game = new Game(this.playersReady, data.gameState);
            } else if (data.type === 'UPDATE_STATE') {
                if (window.game) window.game.loadState(data.gameState);
            } else if (data.type === 'GAME_ACTION') {
                if (this.isHost && window.game) {
                    window.game.receiveAction(data.action, conn.peer);
                }
            }
        });

        conn.on('close', () => {
            alert("Conexión perdida.");
            location.reload();
        });
    }

    broadcast(data) {
        this.connections.forEach(c => c.send(data));
    }

    sendToHost(data) {
        if (this.connections[0]) this.connections[0].send(data);
    }
}

class Game {
    constructor(playersInfo, initialState = null) {
        this.players = playersInfo.map(p => ({
            ...p,
            hand: [],
            isMe: String(p.id) === String(net.myId),
            unoCalled: false,
            falseUnoCalled: false,
            totalDrawn: 0
        }));
        this.deck = [];
        this.discardPile = [];
        this.currentPlayerIdx = 0;
        this.direction = 1;
        this.selectedColor = null;
        this.justDrawnCardIdx = -1;
        this.hasAnimated = false;
        this.gameover = false;
        this.prevHandSizes = {};
        this.drawAccumulator = 0;
        this.totalPlayed = 0;
        this.startTime = Date.now();
        this.lastValidUnoTime = 0;
        this.gracePeriodTimeout = null;
        this.pendingUnoCalls = [];
        this.unoBufferTimeout = null;
        this.lastPlayedByPlayerId = null;
        this.shuffled = true;
        this.shufflerId = null;
        this.shuffleProgress = 0;
        this.isShufflingActive = false;
        this.shuffleListenersAttached = false;

        if (net.isHost && !initialState) {
            this.initNewGame();
        } else if (initialState) {
            this.loadState(initialState);
        }
    }

    initNewGame() {
        this.createDeck();
        // Choose shuffler at random
        this.shufflerId = this.players[Math.floor(Math.random() * this.players.length)].id;
        this.shuffled = false;
        this.shuffleProgress = 0;
        
        net.broadcast({ type: 'START_GAME', gameState: this.getState() });
        this.render();
    }

    createDeck() {
        this.deck = [];
        COLORS.forEach(color => {
            this.deck.push(new Card(color, 'number', '0'));
            for (let i = 1; i <= 9; i++) {
                this.deck.push(new Card(color, 'number', i.toString()));
                this.deck.push(new Card(color, 'number', i.toString()));
            }
            for (let i = 0; i < 2; i++) {
                this.deck.push(new Card(color, 'action', '', ACTIONS.SKIP));
                this.deck.push(new Card(color, 'action', '', ACTIONS.REVERSE));
                this.deck.push(new Card(color, 'action', '', ACTIONS.DRAW2));
            }
        });
        for (let i = 0; i < 4; i++) {
            this.deck.push(new Card('black', 'wild', '', ACTIONS.WILD));
            this.deck.push(new Card('black', 'wild', '', ACTIONS.WILD_DRAW4));
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        for (let i = 0; i < 7; i++) {
            this.players.forEach(p => p.hand.push(this.deck.pop()));
        }
    }

    getState() {
        return {
            players: this.players,
            discardPile: this.discardPile,
            currentPlayerIdx: this.currentPlayerIdx,
            direction: this.direction,
            selectedColor: this.selectedColor,
            justDrawnCardIdx: this.justDrawnCardIdx,
            gameover: this.gameover,
            drawAccumulator: this.drawAccumulator,
            totalPlayed: this.totalPlayed,
            startTime: this.startTime,
            lastValidUnoTime: this.lastValidUnoTime,
            lastPlayedByPlayerId: this.lastPlayedByPlayerId,
            shuffled: this.shuffled,
            shufflerId: this.shufflerId,
            shuffleProgress: this.shuffleProgress,
            isShufflingActive: this.isShufflingActive
        };
    }

    loadState(state) {
        this.players.forEach(p => { this.prevHandSizes[p.id] = p.hand.length; });
        this.players = state.players.map(p => ({
            ...p,
            hand: p.hand.map(c => new Card(c.color, c.tipo, c.value, c.accion)),
            isMe: String(p.id) === String(net.myId)
        }));
        this.discardPile = state.discardPile.map(c => new Card(c.color, c.tipo, c.value, c.accion));
        this.currentPlayerIdx = state.currentPlayerIdx;
        this.direction = state.direction;
        this.selectedColor = state.selectedColor;
        this.justDrawnCardIdx = state.justDrawnCardIdx;
        this.gameover = state.gameover;
        this.drawAccumulator = state.drawAccumulator || 0;
        this.totalPlayed = state.totalPlayed || 0;
        this.startTime = state.startTime || Date.now();
        this.lastValidUnoTime = state.lastValidUnoTime || 0;
        this.lastPlayedByPlayerId = state.lastPlayedByPlayerId || null;
        this.shuffled = state.shuffled !== undefined ? state.shuffled : true;
        this.shufflerId = state.shufflerId || null;
        this.shuffleProgress = state.shuffleProgress || 0;
        this.isShufflingActive = state.isShufflingActive || false;

        this.render();
    }

    animateDealing() {
        if (this.hasAnimated) return;
        this.hasAnimated = true;
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, i) => {
            card.style.animationDelay = `${i * 0.04}s`;
            card.classList.add('drawing');
        });
    }

    render() {
        if (!this.shuffled) {
            showScreen('screen-shuffle');
            
            const shuffler = this.players.find(p => String(p.id) === String(this.shufflerId));
            const shufflerName = shuffler ? shuffler.nickname : "Alguien";
            const me = this.players.find(p => p.isMe);
            const isMeShuffler = (me && String(me.id) === String(this.shufflerId));

            const titleEl = document.getElementById('shuffle-title');
            const instEl = document.getElementById('shuffle-instructions');
            const progressContainer = document.getElementById('shuffle-progress-container');
            const progressFill = document.getElementById('shuffle-progress-fill');
            const deckEl = document.getElementById('shuffle-deck');

            if (titleEl) titleEl.innerText = isMeShuffler ? "¡Te toca revolver!" : `¿Quién revuelve?`;
            if (instEl) {
                instEl.innerText = isMeShuffler 
                    ? "Pon tu dedo/mouse sobre el mazo, mantén presionado y agítalo rápido para mezclar." 
                    : `Esperando a que ${shufflerName} termine de revolver el mazo...`;
            }

            if (progressContainer) progressContainer.classList.remove('hidden');
            if (progressFill) progressFill.style.width = `${this.shuffleProgress}%`;

            if (deckEl) {
                if (this.isShufflingActive && !isMeShuffler) {
                    deckEl.classList.add('shuffling-active');
                } else {
                    deckEl.classList.remove('shuffling-active');
                }
            }

            if (deckEl && isMeShuffler && !this.shuffleListenersAttached) {
                this.setupShuffleDragging(deckEl);
            }
            return;
        } else {
            const gameContainer = document.getElementById('game-container');
            if (gameContainer && gameContainer.classList.contains('hidden')) {
                showScreen('game-container');
                this.animateDealing();
            }
        }

        const container = document.getElementById('players-container');
        // Do NOT wipe container, we will update/reuse player areas
        const myPlayerIndex = this.players.findIndex(p => p.isMe);
        const myIndex = myPlayerIndex === -1 ? 0 : myPlayerIndex;

        const orderedPlayers = [];
        for (let i = 0; i < this.players.length; i++) {
            orderedPlayers.push(this.players[(myIndex + i) % this.players.length]);
        }

        orderedPlayers.forEach((player, idx) => {
            let playerEl = document.getElementById(`player-area-${player.id}`);
            if (!playerEl) {
                playerEl = document.createElement('div');
                playerEl.id = `player-area-${player.id}`;
                container.appendChild(playerEl);
            }
            playerEl.className = idx === 0 ? `player-area player-${idx} is-me` : `player-area player-${idx}`;

            const angle = (idx / orderedPlayers.length) * 360;
            const radius = 35;
            playerEl.style.left = `${50 + radius * Math.cos((angle + 90) * Math.PI / 180)}%`;
            playerEl.style.top = `${50 + radius * Math.sin((angle + 90) * Math.PI / 180)}%`;
            playerEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            let nameEl = playerEl.querySelector('.player-name');
            if (!nameEl) {
                nameEl = document.createElement('div');
                nameEl.className = 'player-name';
                playerEl.appendChild(nameEl);
            }
            nameEl.innerText = `${player.nickname} (${player.hand.length})`;

            if (this.players[this.currentPlayerIdx].id === player.id) {
                nameEl.style.color = 'var(--uno-yellow)';
                nameEl.style.boxShadow = '0 0 15px var(--uno-yellow)';
            } else {
                nameEl.style.color = 'white';
                nameEl.style.boxShadow = 'none';
            }


            let badge = playerEl.querySelector('.uno-badge');
            if (player.unoCalled) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'uno-badge';
                    badge.innerText = '¡UNO!';
                    playerEl.appendChild(badge);
                }
                badge.classList.remove('falso');
            } else if (player.falseUnoCalled) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'uno-badge falso';
                    badge.innerText = '¡UNO!';
                    playerEl.appendChild(badge);
                } else {
                    badge.classList.add('falso');
                }
            } else if (badge) {
                badge.remove();
            }

            let handEl = playerEl.querySelector('.hand');
            if (!handEl) {
                handEl = document.createElement('div');
                handEl.className = 'hand';
                playerEl.appendChild(handEl);
            }
            if (player.isMe) {
                handEl.classList.add('my-hand');
            } else {
                handEl.classList.remove('my-hand');
            }

            const prevSize = this.prevHandSizes[player.id] || 0;
            const currentSize = player.hand.length;

            // FIX: If cards were removed (played), we MUST re-render or update content 
            // since we don't know which index was removed. Wipe is safest and fast.
            if (currentSize < handEl.children.length) {
                handEl.innerHTML = '';
            }

            player.hand.forEach((card, cardIdx) => {
                let cardEl = handEl.children[cardIdx];

                // Only create new card if it doesn't exist
                if (!cardEl) {
                    cardEl = card.render();
                    cardEl.dataset.cardId = `${card.color}-${card.tipo}-${card.value}`;

                    // Animate if it's a newly drawn card
                    if (this.hasAnimated && (cardIdx >= prevSize)) {
                        cardEl.classList.add('drawing');
                        cardEl.style.animationDelay = `${(cardIdx - prevSize) * 0.1}s`;
                    }

                    if (!player.isMe) {
                        cardEl.classList.add('back');
                        cardEl.innerHTML = `<div class="card-inner"><div class="center-oval"><span class="value">UNO</span></div></div>`;
                    } else {
                        cardEl.onclick = () => this.tryPlayCard(cardIdx);
                    }
                    handEl.appendChild(cardEl);
                } else {
                    // Update existing card index if it's me (for onclick)
                    if (player.isMe) {
                        cardEl.onclick = () => this.tryPlayCard(cardIdx);
                    }
                }
            });
        });

        const discardEl = document.getElementById('discard-pile');
        const lastCardInDOM = discardEl.querySelector('.card:last-child');
        const topCard = this.discardPile[this.discardPile.length - 1];

        if (topCard) {
            const cardEl = topCard.render();
            const currentCardId = `${topCard.color}-${topCard.tipo}-${topCard.value}`;

            // Compare IDs ignoring classes to prevent redundant animations when drawing
            const lastCardId = lastCardInDOM ? (lastCardInDOM.dataset.cardId || "") : "";

            if (lastCardId !== currentCardId) {
                if (this.lastPlayedByPlayerId) {
                    const playerEl = document.getElementById(`player-area-${this.lastPlayedByPlayerId}`);
                    if (playerEl) {
                        const discardRect = discardEl.getBoundingClientRect();
                        const playerRect = playerEl.getBoundingClientRect();
                        
                        const playerCenterX = playerRect.left + playerRect.width / 2;
                        const playerCenterY = playerRect.top + playerRect.height / 2;
                        const discardCenterX = discardRect.left + discardRect.width / 2;
                        const discardCenterY = discardRect.top + discardRect.height / 2;
                        
                        const deltaX = playerCenterX - discardCenterX;
                        const deltaY = playerCenterY - discardCenterY;
                        
                        let rotation = '0deg';
                        const match = playerEl.style.transform.match(/rotate\(([^)]+)\)/);
                        if (match && match[1]) {
                            rotation = match[1];
                        }
                        
                        cardEl.style.setProperty('--fly-from-x', `${deltaX}px`);
                        cardEl.style.setProperty('--fly-from-y', `${deltaY}px`);
                        cardEl.style.setProperty('--fly-from-rot', rotation);
                    }
                }
                cardEl.classList.add('playing');
            }
            cardEl.dataset.cardId = currentCardId;

            if (this.selectedColor) {
                cardEl.style.borderColor = `var(--uno-${this.selectedColor})`;
                cardEl.style.boxShadow = `0 0 15px var(--uno-${this.selectedColor})`;
            }
            discardEl.innerHTML = '';
            discardEl.appendChild(cardEl);
        }

        document.getElementById('current-player-name').innerText = this.players[this.currentPlayerIdx].nickname;
        const me = this.players.find(p => p.isMe);
        const currentTurnPlayer = this.players[this.currentPlayerIdx];
        const isMyTurn = (me && currentTurnPlayer && String(me.id) === String(currentTurnPlayer.id));

        const drawBtn = document.getElementById('draw-btn');
        if (drawBtn) {
            drawBtn.disabled = !isMyTurn || this.gameover;
            drawBtn.style.opacity = (isMyTurn && !this.gameover) ? "1" : "0.5";
            let text = "Robar Carta";
            if (isMyTurn && this.justDrawnCardIdx !== -1) text = "Pasar Turno";
            else if (this.drawAccumulator > 0) text = `Comer +${this.drawAccumulator}`;
            drawBtn.innerText = text;
        }

        // UNO Button Logic: High tension
        const unoBtn = document.getElementById('uno-btn');
        if (unoBtn) {
            if (this.gracePeriodTimeout) {
                clearTimeout(this.gracePeriodTimeout);
                this.gracePeriodTimeout = null;
            }

            const activePlayer = this.players[this.currentPlayerIdx];
            const isActivePlayerWith2Cards = (activePlayer && activePlayer.hand.length === 2);
            const someoneNeedsUno = this.players.some(p => p.hand.length === 1 && !p.unoCalled);
            
            const now = Date.now();
            const timeSinceValidUno = this.lastValidUnoTime ? (now - this.lastValidUnoTime) : Infinity;
            const isInGracePeriod = timeSinceValidUno < 1000;

            if (isActivePlayerWith2Cards || someoneNeedsUno || isInGracePeriod) {
                unoBtn.classList.remove('hidden');
                
                const othersNeedUno = this.players.some(p => !p.isMe && p.hand.length === 1 && !p.unoCalled);
                const iNeedToCallUno = (me && me.hand.length === 1 && !me.unoCalled);
                const iHave2CardsAndItsMyTurn = (me && activePlayer && String(me.id) === String(activePlayer.id) && me.hand.length === 2);

                if (othersNeedUno || iNeedToCallUno || iHave2CardsAndItsMyTurn) {
                    unoBtn.classList.add('uno-active');
                } else {
                    unoBtn.classList.remove('uno-active');
                }
                
                if (isInGracePeriod) {
                    const remainingTime = 1000 - timeSinceValidUno;
                    this.gracePeriodTimeout = setTimeout(() => {
                        this.gracePeriodTimeout = null;
                        this.render();
                    }, remainingTime + 50);
                }
            } else {
                unoBtn.classList.add('hidden');
            }
        }

        if (this.gameover) {
            const winner = this.players.find(p => p.hand.length === 0);
            const winScreen = document.getElementById('screen-win');
            if (winner && winScreen.classList.contains('hidden')) {
                this.showWinScreen(winner);
            }
        }
    }

    tryPlayCard(cardIdx) {
        if (this.gameover) return;
        if (String(this.players[this.currentPlayerIdx].id) !== String(net.myId)) return;
        if (this.justDrawnCardIdx !== -1 && cardIdx !== this.justDrawnCardIdx) return;

        const card = this.players[this.currentPlayerIdx].hand[cardIdx];
        if (this.canPlay(card)) {
            if (card.color === 'black') {
                this.pendingWildCardIdx = cardIdx;
                document.getElementById('color-picker').classList.remove('hidden');
            } else {
                this.sendAction({ type: 'PLAY', cardIdx: cardIdx });
            }
        }
    }

    selectColor(color) {
        document.getElementById('color-picker').classList.add('hidden');
        this.sendAction({ type: 'PLAY', cardIdx: this.pendingWildCardIdx, color: color });
    }

    canPlay(card) {
        const top = this.discardPile[this.discardPile.length - 1];

        // If there is a draw pending, you can ONLY play another draw card to stack it
        if (this.drawAccumulator > 0) {
            return (card.accion === ACTIONS.DRAW2 || card.accion === ACTIONS.WILD_DRAW4);
        }

        const currentMatchColor = this.selectedColor || top.color;
        if (card.color === 'black') return true;
        if (card.color === currentMatchColor) return true;
        if (card.value !== '' && card.value === top.value) return true;
        if (card.accion !== 'none' && card.accion === top.accion) return true;
        return false;
    }

    sendAction(action) {
        action.clickTime = Date.now() + (net.clockOffset || 0);
        if (net.isHost) this.executeAction(action, net.myId);
        else net.sendToHost({ type: 'GAME_ACTION', action: action });
    }

    receiveAction(action, senderId) {
        if (net.isHost) this.executeAction(action, senderId);
    }

    executeAction(action, senderId) {
        if (this.gameover) return;

        if (action.type === 'SHUFFLE_PROGRESS') {
            this.shuffleProgress = action.progress;
            this.isShufflingActive = action.shuffling !== undefined ? action.shuffling : false;
            this.syncState();
            return;
        }

        if (action.type === 'SHUFFLE_COMPLETE') {
            if (this.shuffled) return;
            this.shuffleDeck();
            this.dealCards();
            
            let firstCard = this.deck.pop();
            while (firstCard.color === 'black') {
                this.deck.unshift(firstCard);
                firstCard = this.deck.pop();
            }
            this.discardPile.push(firstCard);
            this.currentPlayerIdx = Math.floor(Math.random() * this.players.length);
            
            this.shuffled = true;
            this.syncState();
            return;
        }

        // Store current hand sizes to calculate which cards are new for animations
        this.players.forEach(p => { this.prevHandSizes[p.id] = p.hand.length; });

        if (action.type === 'UNO_CALL') {
            const now = Date.now();
            const clickTime = action.clickTime || now;
            
            // Add to pending calls
            this.pendingUnoCalls.push({ action, senderId, clickTime });
            
            // If buffer is not active, start it
            if (!this.unoBufferTimeout) {
                this.unoBufferTimeout = setTimeout(() => {
                    this.unoBufferTimeout = null;
                    this.processPendingUnoCalls();
                }, 150); // 150ms buffer window
            }
            return;
        }

        let player = this.players[this.currentPlayerIdx];
        if (String(player.id) !== String(senderId)) return;

        if (action.type === 'PLAY') {
            const card = player.hand.splice(action.cardIdx, 1)[0];
            this.discardPile.push(card);
            this.selectedColor = action.color || null;
            this.justDrawnCardIdx = -1;
            this.totalPlayed++;
            this.lastPlayedByPlayerId = senderId;

            if (player.hand.length !== 1) player.unoCalled = false;

            if (player.hand.length === 0) {
                this.gameover = true;
                this.syncState();
                return;
            }

            let skipNext = false;
            if (card.accion === ACTIONS.SKIP) skipNext = true;
            else if (card.accion === ACTIONS.REVERSE) {
                if (this.players.length === 2) skipNext = true;
                else this.direction *= -1;
            } else if (card.accion === ACTIONS.DRAW2) {
                this.drawAccumulator += 2;
            } else if (card.accion === ACTIONS.WILD_DRAW4) {
                this.drawAccumulator += 4;
            }

            this.moveTurn();
            if (skipNext) this.moveTurn();
            this.syncState();
        } else if (action.type === 'DRAW') {
            if (this.drawAccumulator > 0) {
                this.forceDraw(this.players.indexOf(player), this.drawAccumulator);
                this.drawAccumulator = 0;
                this.moveTurn();
            } else {
                if (this.deck.length === 0) this.reshuffleDiscardIntoDeck();
                const card = this.deck.pop();
                player.hand.push(card);
                player.totalDrawn++;
                player.unoCalled = false;
                this.justDrawnCardIdx = player.hand.length - 1;
            }
            this.syncState();
        } else if (action.type === 'PASS') {
            this.justDrawnCardIdx = -1;
            this.moveTurn();
            this.syncState();
        }
    }

    forceDraw(playerIdx, count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) this.reshuffleDiscardIntoDeck();
            this.players[playerIdx].hand.push(this.deck.pop());
            this.players[playerIdx].totalDrawn++;
        }
        this.players[playerIdx].unoCalled = false;
    }

    reshuffleDiscardIntoDeck() {
        if (this.discardPile.length <= 1) return;
        const topCard = this.discardPile.pop();
        this.deck = [...this.discardPile]; this.discardPile = [topCard];
        this.shuffleDeck();
    }

    nextPlayerIdx() { return (this.currentPlayerIdx + this.direction + this.players.length) % this.players.length; }
    moveTurn() { this.currentPlayerIdx = this.nextPlayerIdx(); }
    syncState() {
        if (net.isHost) {
            net.broadcast({ type: 'UPDATE_STATE', gameState: this.getState() });
            this.render();
        }
    }

    processPendingUnoCalls() {
        if (!net.isHost) return;
        
        // Sort by clickTime ascending (earliest click first)
        this.pendingUnoCalls.sort((a, b) => a.clickTime - b.clickTime);
        
        // Process each call
        this.pendingUnoCalls.forEach(item => {
            this.executeUnoCallDirectly(item.action, item.senderId);
        });
        
        // Clear list
        this.pendingUnoCalls = [];
    }

    executeUnoCallDirectly(action, senderId) {
        const now = Date.now();
        
        // 1. If within the 1-second grace period of a successful call, ignore to prevent late-reaction penalties
        if (this.lastValidUnoTime && (now - this.lastValidUnoTime < 1000)) {
            return;
        }

        const caller = this.players.find(p => String(p.id) === String(senderId));
        if (!caller) return;

        // 2. Identify if there is a valid victim (someone with 1 card who hasn't called UNO)
        const victim = this.players.find(p => p.hand.length === 1 && !p.unoCalled);

        // 3. Identify if the active player has exactly 2 cards
        const activePlayer = this.players[this.currentPlayerIdx];
        const isActivePlayerWith2Cards = (activePlayer && activePlayer.hand.length === 2);

        let isValidCall = false;

        // Case A: Caller is the active player and has 2 cards (calling UNO before playing)
        if (String(caller.id) === String(activePlayer.id) && isActivePlayerWith2Cards) {
            caller.unoCalled = true;
            isValidCall = true;
        }
        // Case B: Caller has 1 card and hasn't called UNO yet (saving themselves)
        else if (caller.hand.length === 1 && !caller.unoCalled) {
            caller.unoCalled = true;
            isValidCall = true;
        }
        // Case C: Caller catches a victim
        else if (victim && String(victim.id) !== String(senderId)) {
            this.forceDraw(this.players.indexOf(victim), 3);
            victim.unoCalled = true; // Mark victim as safe now so they aren't caught repeatedly
            isValidCall = true;
        }

        if (isValidCall) {
            this.lastValidUnoTime = now;
            this.syncState();
            
            // Set a timeout to render again after 1 second to hide the button
            setTimeout(() => {
                if (net.isHost) {
                    this.syncState();
                }
            }, 1000);
        } else {
            // False UNO Call! Penalty: Draw 2 cards
            this.forceDraw(this.players.indexOf(caller), 2);
            caller.falseUnoCalled = true;
            this.syncState();

            // Clear false UNO badge after 3 seconds
            setTimeout(() => {
                if (net.isHost) {
                    caller.falseUnoCalled = false;
                    this.syncState();
                }
            }, 3000);
        }
    }

    showWinScreen(winner) {
        const msg = winner.isMe ? "¡HAS GANADO!" : `¡${winner.nickname} ha ganado!`;
        document.getElementById('winner-msg').innerText = msg;
        document.getElementById('winner-name').innerText = winner.nickname;

        // Stats calculation
        const durationSec = Math.floor((Date.now() - this.startTime) / 1000);
        const mins = Math.floor(durationSec / 60).toString().padStart(2, '0');
        const secs = (durationSec % 60).toString().padStart(2, '0');

        document.getElementById('game-duration').innerText = `${mins}:${secs}`;
        document.getElementById('total-played').innerText = this.totalPlayed;

        const statsList = document.getElementById('player-stats-list');
        statsList.innerHTML = '';
        this.players.forEach(p => {
            const div = document.createElement('div');
            div.className = 'stat-item';
            div.innerHTML = `<span>${p.nickname}:</span> <span>${p.totalDrawn} cartas comidas</span>`;
            statsList.appendChild(div);
        });

        showScreen('screen-win');
    }

    setupShuffleDragging(deckEl) {
        this.shuffleListenersAttached = true;
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        this.lastSyncedProgress = 0;
        let isShufflingNow = false;
        let shuffleActiveTimeout = null;
        let lastVisualUpdateTime = 0;

        const setShufflingActive = (active) => {
            if (isShufflingNow !== active) {
                isShufflingNow = active;
                deckEl.classList.toggle('is-shuffling', active);
                this.sendAction({ 
                    type: 'SHUFFLE_PROGRESS', 
                    progress: this.shuffleProgress, 
                    shuffling: isShufflingNow 
                });
            }
        };

        const onStart = (e) => {
            isDragging = true;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            lastX = clientX;
            lastY = clientY;
            deckEl.style.cursor = 'grabbing';
            setShufflingActive(true);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const dx = clientX - lastX;
            const dy = clientY - lastY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist > 5) {
                setShufflingActive(true);

                clearTimeout(shuffleActiveTimeout);
                shuffleActiveTimeout = setTimeout(() => {
                    setShufflingActive(false);
                }, 200);

                // Update progress locally
                this.shuffleProgress = Math.min(this.shuffleProgress + dist * 0.15, 100);
                
                const progressFill = document.getElementById('shuffle-progress-fill');
                if (progressFill) progressFill.style.width = `${this.shuffleProgress}%`;

                // Throttle P2P sync (every 10% progress)
                if (Math.floor(this.shuffleProgress / 10) > Math.floor(this.lastSyncedProgress / 10)) {
                    this.lastSyncedProgress = this.shuffleProgress;
                    this.sendAction({ 
                        type: 'SHUFFLE_PROGRESS', 
                        progress: this.shuffleProgress,
                        shuffling: isShufflingNow
                    });
                }

                // Shake cards visually (throttled to 140ms and with wide offsets so cards slide smoothly rather than flicker/teleport)
                const now = Date.now();
                if (now - lastVisualUpdateTime > 140) {
                    lastVisualUpdateTime = now;
                    const cards = deckEl.querySelectorAll('.deck-card');
                    cards.forEach(card => {
                        const rx = (Math.random() - 0.5) * 55;
                        const ry = (Math.random() - 0.5) * 55;
                        const rot = (Math.random() - 0.5) * 35;
                        card.style.transform = `translate(calc(var(--i) * 2px + ${rx}px), calc(var(--i) * -2px + ${ry}px)) rotate(${rot}deg)`;
                    });
                }

                // Move deck container slightly with lag
                deckEl.style.transform = `translate(calc(-50% + ${dx * 0.25}px), calc(-50% + ${dy * 0.25}px))`;
                
                lastX = clientX;
                lastY = clientY;
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            deckEl.style.cursor = 'grab';

            clearTimeout(shuffleActiveTimeout);
            setShufflingActive(false);

            // Snap back
            const cards = deckEl.querySelectorAll('.deck-card');
            cards.forEach(card => {
                card.style.transform = '';
            });
            deckEl.style.transform = '';

            if (this.shuffleProgress >= 100) {
                this.sendAction({ type: 'SHUFFLE_COMPLETE' });
            }
        };

        deckEl.addEventListener('mousedown', onStart);
        deckEl.addEventListener('touchstart', onStart, { passive: true });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });

        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }
}

const net = new NetworkManager();
let userNickname = '';
function showScreen(screenId) {
    document.querySelectorAll('.overlay, #game-container').forEach(el => el.classList.add('hidden'));
    const el = document.getElementById(screenId); if (el) el.classList.remove('hidden');
}
function updateLobbyUI(players) {
    const list = document.getElementById('lobby-player-list'); list.innerHTML = '';
    players.forEach(p => { const li = document.createElement('li'); li.innerHTML = `<span>${p.nickname}</span> ${p.id === net.myId ? '(Tú)' : ''}`; list.appendChild(li); });
    document.getElementById('player-count').innerText = players.length;
}

document.getElementById('btn-save-nickname').onclick = () => {
    const input = document.getElementById('nickname-input');
    if (input.value.trim()) { userNickname = input.value.trim(); document.getElementById('welcome-text').innerText = `¡Hola, ${userNickname}!`; showScreen('screen-menu'); }
};
document.getElementById('btn-create').onclick = () => {
    net.initHost(userNickname, (id) => { document.getElementById('display-game-code').innerText = id; document.getElementById('host-controls').classList.remove('hidden'); document.getElementById('client-wait-msg').classList.add('hidden'); updateLobbyUI(net.playersReady); showScreen('screen-lobby'); });
};
document.getElementById('btn-join-view').onclick = () => { document.getElementById('join-status').classList.add('hidden'); showScreen('screen-join'); };
document.getElementById('btn-join-action').onclick = () => {
    const code = document.getElementById('join-code-input').value.toUpperCase();
    const statusEl = document.getElementById('join-status');
    if (code.length === 4) {
        statusEl.innerText = "Conectando..."; statusEl.classList.remove('hidden');
        net.joinGame(userNickname, code, () => { document.getElementById('display-game-code').innerText = code; showScreen('screen-lobby'); }, (errorMsg) => { statusEl.innerText = errorMsg; });
    }
};
document.getElementById('btn-start-game').onclick = () => { if (net.isHost) { window.game = new Game(net.playersReady); } };
document.getElementById('draw-btn').onclick = () => {
    if (!window.game) return;
    if (window.game.justDrawnCardIdx !== -1) window.game.sendAction({ type: 'PASS' });
    else window.game.sendAction({ type: 'DRAW' });
};
document.getElementById('uno-btn').onclick = () => {
    if (window.game) window.game.sendAction({ type: 'UNO_CALL' });
};
const ARCADE_URL = 'https://omarsaez.github.io/ArcadeDeJuegos/';

document.getElementById('btn-play-again').onclick = () => {
    if (net.isHost) {
        window.game = new Game(net.playersReady);
    } else {
        alert("Eperando a que el host inicie una nueva partida...");
    }
};
document.getElementById('btn-back-arcade').onclick = () => location.href = ARCADE_URL;
document.getElementById('btn-back-arcade-init').onclick = () => location.href = ARCADE_URL;

const colorOpts = document.querySelectorAll('.color-opt');
colorOpts.forEach(opt => { opt.onclick = () => { window.game.selectColor(opt.getAttribute('data-color')); }; });

document.getElementById('btn-back-menu-join').onclick = () => showScreen('screen-menu');
document.getElementById('btn-leave-lobby').onclick = () => location.reload();
document.getElementById('btn-back').onclick = () => location.href = ARCADE_URL;
