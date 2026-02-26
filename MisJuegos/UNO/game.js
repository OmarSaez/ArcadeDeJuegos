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
            if (data.type === 'LOBBY_UPDATE') {
                this.playersReady = data.players;
                updateLobbyUI(this.playersReady);
            } else if (data.type === 'START_GAME') {
                window.game = new Game(this.playersReady, data.gameState);
                showScreen('game-container');
                window.game.animateDealing();
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
            unoCalled: false
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

        if (net.isHost && !initialState) {
            this.initNewGame();
        } else if (initialState) {
            this.loadState(initialState);
        }
    }

    initNewGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        let firstCard = this.deck.pop();
        while (firstCard.color === 'black') {
            this.deck.unshift(firstCard);
            firstCard = this.deck.pop();
        }
        this.discardPile.push(firstCard);
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
            gameover: this.gameover
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

        if (this.gameover) {
            const winner = this.players.find(p => p.hand.length === 0);
            if (winner) this.showWinScreen(winner);
        } else {
            this.render();
        }
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
            playerEl.className = `player-area player-${idx}`;

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
            } else if (badge) {
                badge.remove();
            }

            let handEl = playerEl.querySelector('.hand');
            if (!handEl) {
                handEl = document.createElement('div');
                handEl.className = 'hand';
                playerEl.appendChild(handEl);
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
            drawBtn.innerText = (isMyTurn && this.justDrawnCardIdx !== -1) ? "Pasar Turno" : "Robar Carta";
        }

        // UNO Button Logic: High tension
        const unoBtn = document.getElementById('uno-btn');
        if (unoBtn) {
            // PULSE only if:
            // 1. Someone ELSE has 1 card AND hasn't called it (I can punish them)
            // 2. I have 1 card AND haven't called it yet (Action required)
            const othersNeedUno = this.players.some(p => !p.isMe && p.hand.length === 1 && !p.unoCalled);
            const iNeedToCallUno = (me && me.hand.length === 1 && !me.unoCalled);

            if (othersNeedUno || iNeedToCallUno) {
                unoBtn.classList.add('uno-active');
            } else {
                unoBtn.classList.remove('uno-active');
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
        const currentMatchColor = this.selectedColor || top.color;
        if (card.color === 'black') return true;
        if (card.color === currentMatchColor) return true;
        if (card.value !== '' && card.value === top.value) return true;
        if (card.accion !== 'none' && card.accion === top.accion) return true;
        return false;
    }

    sendAction(action) {
        if (net.isHost) this.executeAction(action, net.myId);
        else net.sendToHost({ type: 'GAME_ACTION', action: action });
    }

    receiveAction(action, senderId) {
        if (net.isHost) this.executeAction(action, senderId);
    }

    executeAction(action, senderId) {
        if (this.gameover) return;

        // Store current hand sizes to calculate which cards are new for animations
        this.players.forEach(p => { this.prevHandSizes[p.id] = p.hand.length; });

        if (action.type === 'UNO_CALL') {
            const caller = this.players.find(p => String(p.id) === String(senderId));
            const victim = this.players.find(p => p.hand.length === 1 && !p.unoCalled);

            // If the caller is calling for themselves
            if (caller && caller.hand.length <= 2) {
                caller.unoCalled = true;
            }
            // If someone is catching a victim
            else if (victim && String(victim.id) !== String(senderId)) {
                this.forceDraw(this.players.indexOf(victim), 3);
            }
            this.syncState();
            return;
        }

        let player = this.players[this.currentPlayerIdx];
        if (String(player.id) !== String(senderId)) return;

        if (action.type === 'PLAY') {
            const card = player.hand.splice(action.cardIdx, 1)[0];
            this.discardPile.push(card);
            this.selectedColor = action.color || null;
            this.justDrawnCardIdx = -1;

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
                this.forceDraw(this.nextPlayerIdx(), 2);
                skipNext = true;
            } else if (card.accion === ACTIONS.WILD_DRAW4) {
                this.forceDraw(this.nextPlayerIdx(), 4);
                skipNext = true;
            }

            this.moveTurn();
            if (skipNext) this.moveTurn();
            this.syncState();
        } else if (action.type === 'DRAW') {
            if (this.deck.length === 0) this.reshuffleDiscardIntoDeck();
            const card = this.deck.pop();
            player.hand.push(card);
            player.unoCalled = false;
            this.justDrawnCardIdx = player.hand.length - 1;
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

    showWinScreen(winner) {
        const msg = winner.isMe ? "¡HAS GANADO!" : `¡${winner.nickname} ha ganado!`;
        document.getElementById('winner-msg').innerText = msg;
        document.getElementById('winner-name').innerText = winner.nickname;
        showScreen('screen-win');
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
document.getElementById('btn-start-game').onclick = () => { if (net.isHost) { window.game = new Game(net.playersReady); showScreen('game-container'); window.game.animateDealing(); } };
document.getElementById('draw-btn').onclick = () => {
    if (!window.game) return;
    if (window.game.justDrawnCardIdx !== -1) window.game.sendAction({ type: 'PASS' });
    else window.game.sendAction({ type: 'DRAW' });
};
document.getElementById('uno-btn').onclick = () => {
    if (window.game) window.game.sendAction({ type: 'UNO_CALL' });
};
document.getElementById('btn-play-again').onclick = () => {
    if (net.isHost) {
        window.game = new Game(net.playersReady);
        showScreen('game-container');
        window.game.animateDealing();
    } else {
        alert("Eperando a que el host inicie una nueva partida...");
    }
};
document.getElementById('btn-back-arcade').onclick = () => location.reload();

const colorOpts = document.querySelectorAll('.color-opt');
colorOpts.forEach(opt => { opt.onclick = () => { window.game.selectColor(opt.getAttribute('data-color')); }; });

document.getElementById('btn-back-menu-join').onclick = () => showScreen('screen-menu');
document.getElementById('btn-leave-lobby').onclick = () => location.reload();
document.getElementById('btn-back').onclick = () => alert("Volviendo al arcade...");
