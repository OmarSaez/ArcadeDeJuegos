/**
 * ============================================================================
 * ARCADE P2P - MÓDULO UNIVERSAL DE CONECTIVIDAD MULTIJUGADOR (WebRTC / PeerJS)
 * ============================================================================
 * Centraliza toda la lógica de creación de salas (Host), unión a partidas (Client),
 * servidores STUN + TURN/TURNS (puertos 80 y 443 UDP/TCP/TLS para saltar AP Isolation
 * y falta de NAT Loopback en redes Wi-Fi), prefijos automáticos por juego y
 * reconexión inteligente.
 * ============================================================================
 */
(function (global) {
    'use strict';

    // 1. INFRAESTRUCTURA MULTI-NIVEL DE SERVIDORES ICE (STUN + TURN + TURNS)
    const ARCADE_ICE_SERVERS = [
        // Nivel 1: Servidores STUN públicos ultrarrápidos (Descubrimiento IP/Puerto directo)
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },
        // Nivel 2: Servidores TURN de PeerJS Cloud (Retransmisión estándar en puerto 3478)
        {
            urls: [
                'turn:eu-0.turn.peerjs.com:3478',
                'turn:us-0.turn.peerjs.com:3478'
            ],
            username: 'peerjs',
            credential: 'peerjsp'
        },
        // Nivel 3: Servidores TURN/TURNS OpenRelay en puertos 80 y 443 (UDP / TCP / TLS)
        // Permite conectar incluso en Wi-Fis con AP Isolation activo o firewalls que bloquean UDP
        {
            urls: [
                'turn:openrelay.metered.ca:80',
                'turn:openrelay.metered.ca:80?transport=tcp',
                'turn:openrelay.metered.ca:443',
                'turn:openrelay.metered.ca:443?transport=tcp',
                'turns:openrelay.metered.ca:443?transport=tcp'
            ],
            username: 'openrelayproject',
            credential: 'openrelayproject'
        }
    ];

    // Alfabeto ultra-legible sin caracteres ambiguos en fuentes Arcade / Pixel (Press Start 2P, Orbitron, etc.):
    // Excluidos por similitud visual o fonética:
    // - 0, O, Q, D (círculos/óvalos idénticos en fuentes pixeladas)
    // - 1, I, L    (trazos verticales confusos)
    // - 2, Z       (idénticos en fuentes de 7 segmentos / retro)
    // - 5, S       (idénticos en fuentes arcade)
    // - 8, B       (muy similares en pantallas móviles pequeñas)
    // - 6, G       (muy similares en fuentes cuadradas)
    // - U, V       (confusos al dictar o leer rápido)
    const CODE_CHARS = 'ACEFHJKMNPRTWXY3479';

    // 2. UTILIDADES DE CÓDIGOS DE SALA Y NAMESPACE POR JUEGO
    function generateCode(length) {
        const len = length || 4;
        let result = '';
        for (let i = 0; i < len; i++) {
            result += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
        }
        return result;
    }

    function sanitizeRoomCode(rawCode) {
        if (!rawCode || typeof rawCode !== 'string') return '';
        return rawCode.replace(/[\s\-]/g, '').toUpperCase();
    }

    function getGameNamespacePrefix(customGameSlug) {
        if (customGameSlug && typeof customGameSlug === 'string') {
            const cleanCustom = customGameSlug.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
            if (cleanCustom) return 'ARCD_' + cleanCustom + '_';
        }
        try {
            const path = (global.location && global.location.pathname) || '';
            const match = path.match(/MisJuegos\/([^\/]+)/i);
            const rawSlug = match && match[1] ? match[1] : 'ARCADE';
            const cleanSlug = rawSlug.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12) || 'ARCADE';
            return 'ARCD_' + cleanSlug + '_';
        } catch (e) {
            return 'ARCD_GAME_';
        }
    }

    function isShortRoomCode(val) {
        return typeof val === 'string' && /^[A-Za-z0-9]{3,6}$/.test(val.trim());
    }

    function toNetworkPeerId(id, customGameSlug) {
        if (!id || typeof id !== 'string') return id;
        const trimmed = id.trim().toUpperCase();
        if (trimmed.includes('_')) return trimmed;
        if (isShortRoomCode(trimmed)) {
            return getGameNamespacePrefix(customGameSlug) + trimmed;
        }
        return trimmed;
    }

    function toDisplayRoomCode(id, customGameSlug) {
        if (!id || typeof id !== 'string') return id;
        const prefix = getGameNamespacePrefix(customGameSlug);
        if (id.startsWith(prefix)) {
            return id.slice(prefix.length);
        }
        const genericMatch = id.match(/^(?:ARCD_[A-Z0-9]+_|ARCADEMG_|cah_|stop_game_|uno_room_)([A-Za-z0-9]{3,8})$/i);
        if (genericMatch && genericMatch[1]) {
            return genericMatch[1].toUpperCase();
        }
        return id;
    }

    // 3. CONFIGURACIÓN AVANZADA DE WEBRTC E ICE RESTART AUTOMÁTICO
    function buildEnhancedPeerOptions(userOpts) {
        const opts = Object.assign({ pingInterval: 5000 }, userOpts || {});
        const existingConfig = opts.config || {};
        const existingIce = Array.isArray(existingConfig.iceServers) ? existingConfig.iceServers : [];

        const seenUrls = new Set();
        const mergedIce = [];
        existingIce.concat(ARCADE_ICE_SERVERS).forEach(entry => {
            if (!entry || !entry.urls) return;
            const key = Array.isArray(entry.urls) ? entry.urls.join(',') : String(entry.urls);
            if (!seenUrls.has(key)) {
                seenUrls.add(key);
                mergedIce.push(entry);
            }
        });

        opts.config = Object.assign({
            sdpSemantics: 'unified-plan',
            iceCandidatePoolSize: 4
        }, existingConfig, {
            iceServers: mergedIce
        });

        return opts;
    }

    function attachIceRestartMonitor(conn) {
        if (!conn) return;
        const checkPc = () => {
            const pc = conn.peerConnection;
            if (!pc || pc.__arcadeMonitored) return;
            pc.__arcadeMonitored = true;
            pc.addEventListener('iceconnectionstatechange', () => {
                if ((pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') && !conn.open) {
                    try {
                        if (typeof pc.restartIce === 'function') pc.restartIce();
                    } catch (e) { }
                }
            });
        };
        checkPc();
        setTimeout(checkPc, 150);
    }

    // 4. ENVOLTORIO TRANSPARENTE SOBRE window.Peer
    function wrapNativePeerConstructor(NativePeer) {
        if (!NativePeer || NativePeer.__isArcadeEnhanced) return NativePeer;

        function ArcadeEnhancedPeer(idOrOpts, maybeOpts) {
            let requestedShortCode = null;
            let networkId = undefined;
            let finalOpts = undefined;

            if (typeof idOrOpts === 'string') {
                const clean = idOrOpts.trim().toUpperCase();
                if (isShortRoomCode(clean)) {
                    requestedShortCode = clean;
                } else {
                    const extracted = toDisplayRoomCode(clean);
                    if (extracted !== clean && isShortRoomCode(extracted)) {
                        requestedShortCode = extracted;
                    }
                }
                networkId = toNetworkPeerId(clean);
                finalOpts = buildEnhancedPeerOptions(maybeOpts);
            } else if (idOrOpts && typeof idOrOpts === 'object') {
                finalOpts = buildEnhancedPeerOptions(idOrOpts);
            } else {
                finalOpts = buildEnhancedPeerOptions(maybeOpts);
            }

            const instance = (networkId !== undefined)
                ? new NativePeer(networkId, finalOpts)
                : new NativePeer(finalOpts);

            if (requestedShortCode) {
                instance.__arcadeShortCode = requestedShortCode;
                instance.__arcadeNetworkId = networkId;
                try {
                    Object.defineProperty(instance, 'id', {
                        configurable: true,
                        enumerable: true,
                        get() {
                            return requestedShortCode;
                        }
                    });
                } catch (e) { }
            }

            const origOn = instance.on ? instance.on.bind(instance) : null;
            if (origOn) {
                instance.on = function (event, listener) {
                    if (event === 'open' && typeof listener === 'function' && requestedShortCode) {
                        return origOn('open', function () {
                            listener.call(this, requestedShortCode);
                        });
                    }
                    return origOn(event, listener);
                };

                origOn('disconnected', function () {
                    if (networkId) instance._lastServerId = networkId;
                    setTimeout(() => {
                        try {
                            if (instance && !instance.destroyed && instance.disconnected && typeof instance.reconnect === 'function') {
                                if (networkId) instance._lastServerId = networkId;
                                instance.reconnect();
                            }
                        } catch (e) { }
                    }, 1000);
                });

                origOn('connection', function (conn) {
                    if (conn && conn.peer) {
                        conn.shortPeer = toDisplayRoomCode(conn.peer);
                    }
                    attachIceRestartMonitor(conn);
                });
            }

            const origConnect = instance.connect ? instance.connect.bind(instance) : null;
            if (origConnect) {
                instance.connect = function (targetId, connOpts) {
                    const resolvedTarget = toNetworkPeerId(targetId);
                    const safeConnOpts = Object.assign({ reliable: true }, connOpts || {});
                    const conn = origConnect(resolvedTarget, safeConnOpts);
                    if (conn) {
                        conn.shortPeer = toDisplayRoomCode(resolvedTarget);
                    }
                    attachIceRestartMonitor(conn);
                    return conn;
                };
            }

            return instance;
        }

        Object.setPrototypeOf(ArcadeEnhancedPeer, NativePeer);
        ArcadeEnhancedPeer.prototype = NativePeer.prototype;
        ArcadeEnhancedPeer.__isArcadeEnhanced = true;
        ArcadeEnhancedPeer.__nativePeer = NativePeer;

        return ArcadeEnhancedPeer;
    }

    let currentPeerCtor = global.Peer ? wrapNativePeerConstructor(global.Peer) : undefined;
    try {
        Object.defineProperty(global, 'Peer', {
            configurable: true,
            enumerable: true,
            get() {
                return currentPeerCtor;
            },
            set(newVal) {
                currentPeerCtor = wrapNativePeerConstructor(newVal);
            }
        });
    } catch (e) {
        if (global.Peer) {
            global.Peer = wrapNativePeerConstructor(global.Peer);
        }
    }

    // 5. API GENÉRICA DE ALTO NIVEL: createHost() y joinRoom()
    function safeDestroyPeer(peerInstance) {
        if (!peerInstance) return;
        try {
            if (!peerInstance.destroyed && typeof peerInstance.destroy === 'function') {
                peerInstance.destroy();
            }
        } catch (e) { }
    }

    function translateErrorMessage(err) {
        const type = (err && err.type) ? err.type : '';
        if (type === 'peer-unavailable') {
            return 'No se encontró la sala. Verifica el código de 4 letras.';
        }
        if (type === 'unavailable-id') {
            return 'Ese código de sala ya está en uso. Generando uno nuevo...';
        }
        if (type === 'network' || type === 'server-error' || type === 'socket-error' || type === 'socket-closed') {
            return 'Error de red con el servidor de señalización. Verifica tu conexión.';
        }
        if (type === 'timeout') {
            return 'Tiempo de espera agotado al conectar con la sala.';
        }
        return 'Error de conexión (' + (type || 'desconocido') + ').';
    }

    /**
     * Crea una sala multijugador actuando como Host.
     * Maneja automáticamente generación de código de 4 letras, namespace del juego,
     * reintentos por colisión de código (unavailable-id), STUN/TURN y eventos de conexión.
     */
    function createHost(options) {
        const opts = options || {};
        if (opts.peer) {
            safeDestroyPeer(opts.peer);
        }

        const maxRetries = typeof opts.maxRetries === 'number' ? opts.maxRetries : 6;
        let retryCount = 0;
        let currentCode = (opts.code && typeof opts.code === 'string')
            ? toDisplayRoomCode(opts.code.trim().toUpperCase(), opts.game)
            : generateCode(opts.codeLength || 4);

        const activeConnections = [];

        const controller = {
            peer: null,
            connections: activeConnections,
            getCode() {
                return currentCode;
            },
            broadcast(data, excludePeerId) {
                for (let i = 0; i < activeConnections.length; i++) {
                    const c = activeConnections[i];
                    if (c && c.open && c.peer !== excludePeerId && c.shortPeer !== excludePeerId) {
                        try { c.send(data); } catch (e) { }
                    }
                }
            },
            close() {
                safeDestroyPeer(controller.peer);
                controller.peer = null;
            }
        };

        function attachConnectionHandlers(conn) {
            if (!conn || conn.__arcadeHostBound) return;
            conn.__arcadeHostBound = true;
            conn.shortPeer = toDisplayRoomCode(conn.peer, opts.game);

            if (typeof opts.onIncomingConnection === 'function') {
                opts.onIncomingConnection(conn);
            }

            let openFired = false;
            const handleOpen = () => {
                if (openFired) return;
                openFired = true;
                if (!activeConnections.includes(conn)) {
                    activeConnections.push(conn);
                }
                if (typeof opts.onConnection === 'function') {
                    opts.onConnection(conn);
                }
            };

            conn.on('open', handleOpen);
            if (conn.open) {
                handleOpen();
            }

            if (typeof opts.onData === 'function') {
                conn.on('data', function (data) {
                    opts.onData(data, conn);
                });
            }

            conn.on('close', function () {
                const idx = activeConnections.indexOf(conn);
                if (idx !== -1) activeConnections.splice(idx, 1);
                if (typeof opts.onClose === 'function') {
                    opts.onClose(conn);
                }
            });

            conn.on('error', function (err) {
                const idx = activeConnections.indexOf(conn);
                if (idx !== -1) activeConnections.splice(idx, 1);
                if (typeof opts.onConnError === 'function') {
                    opts.onConnError(err, conn);
                }
            });
        }

        function spawnHostPeer() {
            const networkId = toNetworkPeerId(currentCode, opts.game);
            const peerInstance = new global.Peer(networkId, opts.peerOptions);
            controller.peer = peerInstance;

            if (typeof opts.onPeerCreated === 'function') {
                opts.onPeerCreated(peerInstance, currentCode);
            }

            peerInstance.on('open', function () {
                if (typeof opts.onOpen === 'function') {
                    opts.onOpen(currentCode, peerInstance);
                }
            });

            peerInstance.on('connection', function (conn) {
                attachConnectionHandlers(conn);
            });

            peerInstance.on('error', function (err) {
                if (err && err.type === 'unavailable-id' && retryCount < maxRetries) {
                    retryCount++;
                    safeDestroyPeer(peerInstance);
                    currentCode = generateCode(opts.codeLength || 4);
                    spawnHostPeer();
                    return;
                }
                if (typeof opts.onError === 'function') {
                    opts.onError(err, translateErrorMessage(err));
                }
            });
        }

        spawnHostPeer();
        return controller;
    }

    /**
     * Une al jugador actual como Cliente a una sala existente usando su código de 4 caracteres.
     */
    function joinRoom(roomCode, options) {
        const opts = options || {};
        if (opts.peer) {
            safeDestroyPeer(opts.peer);
        }

        const cleanCode = sanitizeRoomCode(roomCode);
        const controller = {
            peer: null,
            conn: null,
            code: toDisplayRoomCode(cleanCode, opts.game),
            send(data) {
                if (controller.conn && controller.conn.open) {
                    controller.conn.send(data);
                }
            },
            close() {
                if (controller.timeoutId) {
                    clearTimeout(controller.timeoutId);
                    controller.timeoutId = null;
                }
                safeDestroyPeer(controller.peer);
                controller.peer = null;
                controller.conn = null;
            }
        };

        if (!cleanCode) {
            const err = { type: 'invalid-code', message: 'Código vacío' };
            if (typeof opts.onError === 'function') {
                opts.onError(err, 'Ingresa un código de sala válido.');
            }
            return controller;
        }

        const peerInstance = new global.Peer(undefined, opts.peerOptions);
        controller.peer = peerInstance;

        if (typeof opts.onPeerCreated === 'function') {
            opts.onPeerCreated(peerInstance, null);
        }

        const timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 15000;
        let isResolved = false;

        if (timeoutMs > 0) {
            controller.timeoutId = setTimeout(() => {
                if (!isResolved && (!controller.conn || !controller.conn.open)) {
                    isResolved = true;
                    const timeoutErr = { type: 'timeout', message: 'Connection timeout' };
                    if (typeof opts.onError === 'function') {
                        opts.onError(timeoutErr, translateErrorMessage(timeoutErr));
                    }
                    safeDestroyPeer(peerInstance);
                }
            }, timeoutMs);
        }

        peerInstance.on('open', function (myId) {
            const targetNetworkId = toNetworkPeerId(cleanCode, opts.game);
            const connectOpts = Object.assign({ reliable: true }, opts.connectOptions || {});
            if (opts.metadata !== undefined) connectOpts.metadata = opts.metadata;
            if (opts.serialization !== undefined) connectOpts.serialization = opts.serialization;

            const conn = peerInstance.connect(targetNetworkId, connectOpts);
            controller.conn = conn;

            if (typeof opts.onPeerCreated === 'function') {
                opts.onPeerCreated(peerInstance, conn);
            }
            if (typeof opts.onConnecting === 'function') {
                opts.onConnecting(conn, myId, peerInstance);
            }

            let openTriggered = false;
            const handleOpen = () => {
                if (openTriggered) return;
                openTriggered = true;
                isResolved = true;
                if (controller.timeoutId) {
                    clearTimeout(controller.timeoutId);
                    controller.timeoutId = null;
                }
                if (typeof opts.onOpen === 'function') {
                    opts.onOpen(conn, myId, peerInstance);
                }
            };

            conn.on('open', handleOpen);
            if (conn.open) {
                handleOpen();
            }

            if (typeof opts.onData === 'function') {
                conn.on('data', function (data) {
                    opts.onData(data, conn);
                });
            }

            conn.on('close', function () {
                if (controller.timeoutId) {
                    clearTimeout(controller.timeoutId);
                    controller.timeoutId = null;
                }
                if (typeof opts.onClose === 'function') {
                    opts.onClose(conn);
                }
            });

            conn.on('error', function (err) {
                isResolved = true;
                if (controller.timeoutId) {
                    clearTimeout(controller.timeoutId);
                    controller.timeoutId = null;
                }
                if (typeof opts.onError === 'function') {
                    opts.onError(err, translateErrorMessage(err));
                }
            });
        });

        peerInstance.on('error', function (err) {
            isResolved = true;
            if (controller.timeoutId) {
                clearTimeout(controller.timeoutId);
                controller.timeoutId = null;
            }
            if (typeof opts.onError === 'function') {
                opts.onError(err, translateErrorMessage(err));
            }
        });

        return controller;
    }

    global.ArcadeP2P = {
        iceServers: ARCADE_ICE_SERVERS,
        alphabet: CODE_CHARS,
        generateCode,
        sanitizeRoomCode,
        getPrefix: getGameNamespacePrefix,
        toNetworkPeerId,
        toDisplayRoomCode,
        stripPrefix: toDisplayRoomCode,
        createHost,
        joinRoom,
        host: createHost,
        join: joinRoom
    };
})(window);

