/**
 * ARCADE DE OMAR - MOTOR DE SONIDO UNIVERSAL (Web Audio API)
 * Sin dependencias externas ni archivos MP3.
 * Uso en cualquier juego:
 *   <script src="../../sounds.js"></script> (o "sounds.js" en la raíz)
 *   ArcadeAudio.click();
 *   ArcadeAudio.hit();
 *   ArcadeAudio.splash();
 *   ArcadeAudio.sink();
 *   ArcadeAudio.victory();
 */
(function (global) {
    let ctx = null;
    let muted = localStorage.getItem('arcade_sound_muted') === 'true';

    function getCtx() {
        if (muted) return null;
        if (!ctx) {
            const AudioCtx = global.AudioContext || global.webkitAudioContext;
            if (AudioCtx) ctx = new AudioCtx();
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => { });
        }
        return ctx;
    }

    // Generador auxiliar de ruido blanco/rosa para agua y explosiones
    function createNoiseBuffer(audioCtx, durationSec) {
        const bufferSize = Math.floor(audioCtx.sampleRate * durationSec);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    const ArcadeAudio = {
        isMuted() {
            return muted;
        },

        setMuted(val) {
            muted = !!val;
            localStorage.setItem('arcade_sound_muted', muted ? 'true' : 'false');
            return muted;
        },

        toggleMute() {
            return this.setMuted(!muted);
        },

        // 1. Clic de botón de interfaz (navegación general)
        click() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.055);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.07);
        },

        // 2. Botón de volver / cancelar / secundario
        back() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(480, now);
            osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        },

        // 3. Hover sutil para tarjetas del menú
        hover() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(640, now);
            osc.frequency.exponentialRampToValueAtTime(720, now + 0.025);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.035);
        },

        // 4. Transición al entrar a un juego desde el Arcade (estilo portal Mario 64 / Warp)
        transition() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const notes = [330, 440, 554.37, 659.25, 880, 1108.73];
            notes.forEach((freq, i) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + i * 0.055;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.12);

                gain.gain.setValueAtTime(0.13, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.16);
            });
        },

        // 5. Colocar pieza / barco o rotar
        place() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.075);
        },

        // 6. Error / Acción inválida
        error() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.setValueAtTime(130, now + 0.08);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.19);
        },

        // 7. Disparo / Lanzamiento de proyectil
        shoot() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        },

        // 8. Impacto / Acertar disparo (Explosión contundente)
        hit() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;

            // Golpe grave sub-bass
            const osc = c.createOscillator();
            const oscGain = c.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(32, now + 0.38);

            oscGain.gain.setValueAtTime(0.32, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(oscGain);
            oscGain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.42);

            // Ruido de explosión filtrado
            const noise = c.createBufferSource();
            noise.buffer = createNoiseBuffer(c, 0.45);

            const filter = c.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1100, now);
            filter.frequency.exponentialRampToValueAtTime(140, now + 0.42);

            const nGain = c.createGain();
            nGain.gain.setValueAtTime(0.35, now);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

            noise.connect(filter);
            filter.connect(nGain);
            nGain.connect(c.destination);
            noise.start(now);
            noise.stop(now + 0.45);
        },

        // 9. Agua / Fallar disparo (Chapoteo "Splash" + burbujas)
        splash() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;

            // "Bloop" de gota entrando al agua
            const drop = c.createOscillator();
            const dropGain = c.createGain();
            drop.type = 'sine';
            drop.frequency.setValueAtTime(240, now);
            drop.frequency.exponentialRampToValueAtTime(620, now + 0.14);

            dropGain.gain.setValueAtTime(0.2, now);
            dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            drop.connect(dropGain);
            dropGain.connect(c.destination);
            drop.start(now);
            drop.stop(now + 0.17);

            // Spray de espuma de agua (ruido pasa-banda)
            const noise = c.createBufferSource();
            noise.buffer = createNoiseBuffer(c, 0.35);

            const filter = c.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900, now + 0.03);
            filter.frequency.exponentialRampToValueAtTime(2200, now + 0.18);
            filter.frequency.exponentialRampToValueAtTime(600, now + 0.34);
            filter.Q.value = 2.2;

            const nGain = c.createGain();
            nGain.gain.setValueAtTime(0.01, now);
            nGain.gain.linearRampToValueAtTime(0.24, now + 0.05);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

            noise.connect(filter);
            filter.connect(nGain);
            nGain.connect(c.destination);
            noise.start(now);
            noise.stop(now + 0.35);
        },

        // 10. Hundir un barco / flota (Explosión múltiple + hundimiento submarino)
        sink() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;

            // Tres detonaciones escalonadas cada vez más profundas
            [0, 0.16, 0.34].forEach((offset, idx) => {
                const t = now + offset;
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180 - idx * 35, t);
                osc.frequency.exponentialRampToValueAtTime(25, t + 0.45);

                gain.gain.setValueAtTime(0.32, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.48);

                const noise = c.createBufferSource();
                noise.buffer = createNoiseBuffer(c, 0.5);
                const filter = c.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1400 - idx * 250, t);
                filter.frequency.exponentialRampToValueAtTime(90, t + 0.48);

                const nGain = c.createGain();
                nGain.gain.setValueAtTime(0.35, t);
                nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.49);

                noise.connect(filter);
                filter.connect(nGain);
                nGain.connect(c.destination);
                noise.start(t);
                noise.stop(t + 0.5);
            });

            // Burbujeo final de hundimiento
            const bubbleFreqs = [320, 410, 280, 490, 360];
            bubbleFreqs.forEach((f, i) => {
                const bt = now + 0.55 + i * 0.065;
                const bOsc = c.createOscillator();
                const bGain = c.createGain();
                bOsc.type = 'sine';
                bOsc.frequency.setValueAtTime(f, bt);
                bOsc.frequency.exponentialRampToValueAtTime(f * 1.5, bt + 0.055);

                bGain.gain.setValueAtTime(0.11, bt);
                bGain.gain.exponentialRampToValueAtTime(0.001, bt + 0.06);

                bOsc.connect(bGain);
                bGain.connect(c.destination);
                bOsc.start(bt);
                bOsc.stop(bt + 0.065);
            });
        },

        // 11. Fanfarria de Victoria (para el ganador de la partida)
        victory() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;

            // Melodía triunfal arpegiada (Do mayor -> Sol -> Do alto con acorde)
            const melody = [
                { f: 523.25, t: 0.00, d: 0.13 }, // C5
                { f: 659.25, t: 0.13, d: 0.13 }, // E5
                { f: 783.99, t: 0.26, d: 0.13 }, // G5
                { f: 1046.50, t: 0.39, d: 0.26 }, // C6
                { f: 783.99, t: 0.67, d: 0.14 }, // G5
                { f: 1046.50, t: 0.83, d: 0.60 }  // C6 final largo
            ];

            melody.forEach(n => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, now + n.t);

                gain.gain.setValueAtTime(0.22, now + n.t);
                gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(now + n.t);
                osc.stop(now + n.t + n.d + 0.02);
            });

            // Acorde armónico de respaldo en el remate final
            [523.25, 659.25, 783.99].forEach(chordFreq => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(chordFreq, now + 0.83);

                gain.gain.setValueAtTime(0.1, now + 0.83);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(now + 0.83);
                osc.stop(now + 1.47);
            });
        },

        // 12. Sonido de Derrota (suave)
        defeat() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const notes = [
                { f: 392.00, t: 0.00, d: 0.22 },
                { f: 369.99, t: 0.22, d: 0.22 },
                { f: 349.23, t: 0.44, d: 0.22 },
                { f: 329.63, t: 0.66, d: 0.50 }
            ];
            notes.forEach(n => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, now + n.t);
                gain.gain.setValueAtTime(0.14, now + n.t);
                gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(now + n.t);
                osc.stop(now + n.t + n.d + 0.02);
            });
        },

        // 13. Notificación / Mensaje de chat
        notification() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            [587.33, 880].forEach((f, idx) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + idx * 0.07;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, t);
                gain.gain.setValueAtTime(0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.13);
            });
        },

        // 14. Caída de ficha (Conecta 4): silbido de caída + golpe seco al encajar
        dropDisc(row = 5) {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;

            // Deslizamiento inicial por la ranura
            const slideOsc = c.createOscillator();
            const slideGain = c.createGain();
            slideOsc.type = 'sine';
            slideOsc.frequency.setValueAtTime(620, now);
            slideOsc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
            slideGain.gain.setValueAtTime(0.08, now);
            slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
            slideOsc.connect(slideGain);
            slideGain.connect(c.destination);
            slideOsc.start(now);
            slideOsc.stop(now + 0.2);

            // Golpe plástico al chocar abajo + pequeño rebote
            const impactDelay = 0.22 + (row * 0.035);
            [0, 0.075].forEach((bOffset, idx) => {
                const t = now + impactDelay + bOffset;
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(idx === 0 ? 195 : 260, t);
                osc.frequency.exponentialRampToValueAtTime(75, t + 0.065);
                gain.gain.setValueAtTime(idx === 0 ? 0.26 : 0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.075);
            });
        },

        // 15. Palabra acertada / Respuesta correcta (Pinturillo, Stop, etc.)
        correct() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const notes = [587.33, 880, 1174.66]; // D5 -> A5 -> D6
            notes.forEach((f, i) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + i * 0.08;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, t);
                gain.gain.setValueAtTime(0.18, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.23);
            });
        },

        // 16. Encaje satisfactorio de pieza (Rompecabezas / Puzzle)
        snap() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            [440, 659.25].forEach((f, i) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + i * 0.045;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, t);
                gain.gain.setValueAtTime(0.16, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.1);
            });
        },

        // 17. Deslizar ficha (Puzzle Deslizante)
        slide(stepCount = 1) {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            const baseFreq = 320 + Math.min(stepCount, 5) * 35;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.055);
            gain.gain.setValueAtTime(0.11, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.065);
        },

        // 18. Tic-tac de reloj (últimos segundos)
        tick() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.045);
        },

        // 19. Lanzar / Robar carta (UNO, Cartas Contra la Humanidad)
        card() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const noise = c.createBufferSource();
            noise.buffer = createNoiseBuffer(c, 0.07);
            const filter = c.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400, now);
            filter.frequency.exponentialRampToValueAtTime(2800, now + 0.06);
            filter.Q.value = 1.8;
            const nGain = c.createGain();
            nGain.gain.setValueAtTime(0.16, now);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
            noise.connect(filter);
            filter.connect(nGain);
            nGain.connect(c.destination);
            noise.start(now);
            noise.stop(now + 0.07);

            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(680, now + 0.05);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        },

        // 20. Moneda / Item recogido (Vuelo Infinito, Tanques, Dual)
        coin() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            [987.77, 1318.51].forEach((f, i) => { // B5 -> E6
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + i * 0.055;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, t);
                gain.gain.setValueAtTime(0.14, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.15);
            });
        },

        // 21. Rebote de disco / trampolín (Hockey, Vuelo Infinito)
        bounce() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now);
            osc.stop(now + 0.075);
        },

        // 22. Gol / Punto anotado (Hockey)
        goal() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            [440, 554.37, 659.25, 880].forEach((f, i) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + i * 0.07;
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, t);
                gain.gain.setValueAtTime(0.13, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.23);
            });
        },

        // 23. Alarma / ¡STOP! / ¡UNO!
        alarm() {
            const c = getCtx();
            if (!c) return;
            const now = c.currentTime;
            [0, 0.12].forEach((offset, idx) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const t = now + offset;
                osc.type = 'square';
                osc.frequency.setValueAtTime(idx === 0 ? 740 : 880, t);
                gain.gain.setValueAtTime(0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
                osc.connect(gain);
                gain.connect(c.destination);
                osc.start(t);
                osc.stop(t + 0.115);
            });
        },

        // 24. Prevención global de zoom accidental en iOS / móviles (doble tap y pellizco)
        preventZoom() {
            if (global.__arcadeAntiZoomBound) return;
            global.__arcadeAntiZoomBound = true;

            // 1. Asegurar meta viewport sin escalado
            let vp = document.querySelector('meta[name="viewport"]');
            if (!vp) {
                vp = document.createElement('meta');
                vp.name = 'viewport';
                if (document.head) document.head.appendChild(vp);
            }
            if (vp) {
                vp.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }

            // 2. Inyectar CSS global (touch-action NO se hereda en CSS, debe aplicarse a *)
            if (!document.getElementById('arcade-ios-antizoom')) {
                const style = document.createElement('style');
                style.id = 'arcade-ios-antizoom';
                style.textContent = `
                    html, body, *, *::before, *::after {
                        touch-action: manipulation;
                        -webkit-text-size-adjust: 100%;
                        -webkit-touch-callout: none;
                    }
                    canvas {
                        touch-action: none !important;
                        -webkit-user-select: none;
                        user-select: none;
                    }
                `;
                if (document.head) {
                    document.head.appendChild(style);
                } else {
                    document.addEventListener('DOMContentLoaded', () => {
                        if (document.head) document.head.appendChild(style);
                    }, { once: true });
                }
            }

            // 3. Bloquear doble click nativo y gestos de zoom de WebKit (iOS Safari)
            document.addEventListener('dblclick', (e) => {
                e.preventDefault();
            }, { passive: false, capture: true });

            ['gesturestart', 'gesturechange', 'gestureend'].forEach((evt) => {
                document.addEventListener(evt, (e) => {
                    e.preventDefault();
                }, { passive: false, capture: true });
            });

            // 4. Bloquear zoom con pellizco (multi-touch scale)
            document.addEventListener('touchmove', (e) => {
                if ((e.touches && e.touches.length > 1) || (typeof e.scale === 'number' && e.scale !== 1)) {
                    e.preventDefault();
                }
            }, { passive: false, capture: true });

            // 5. Bloquear zoom por toques repetidos rápidos en iOS (< 320ms) preservando clicks en UI
            let lastTouchEnd = 0;
            let touchStartX = 0;
            let touchStartY = 0;
            let isMultiTouchGesture = false;

            document.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length > 1) {
                    isMultiTouchGesture = true;
                } else if (e.touches && e.touches.length === 1) {
                    isMultiTouchGesture = false;
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true, capture: true });

            document.addEventListener('touchend', (e) => {
                if (isMultiTouchGesture) {
                    if (!e.touches || e.touches.length === 0) {
                        isMultiTouchGesture = false;
                    }
                    lastTouchEnd = 0;
                    return;
                }

                const target = e.target;
                const tag = target && target.tagName ? target.tagName.toUpperCase() : '';
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

                const now = Date.now();
                if (now - lastTouchEnd <= 320) {
                    e.preventDefault();
                    if (e.changedTouches && e.changedTouches.length === 1 && tag !== 'CANVAS') {
                        const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
                        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
                        if (dx < 15 && dy < 15 && typeof target.click === 'function') {
                            target.click();
                        }
                    }
                }
                lastTouchEnd = now;
            }, { passive: false, capture: true });
        },

        // 25. Auto-conectar sonidos de interfaz a botones de la página actual
        bindUI() {
            this.preventZoom();
            if (global.__arcadeUIBound) return;
            global.__arcadeUIBound = true;

            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button, .btn, .arcade-btn, .primary-btn, .secondary-btn, .buy-btn, .warp-btn, .promo-btn, .vote-btn, .color-opt, .diff-option, .ban-tab, .dialog-card-btn, .help-fab, .qr-fab, .chat-option, .editor-cell, .color-btn, .tool-btn, .word-option, .custom-file-upload, .ref-btn, .close-ref');
                if (!btn || btn.disabled) return;
                const text = (btn.innerText || '').toLowerCase();
                if (btn.classList.contains('secondary') ||
                    btn.classList.contains('secondary-btn') ||
                    btn.classList.contains('close-ref') ||
                    text.includes('volver') ||
                    text.includes('cancelar') ||
                    text.includes('atrás') ||
                    text.includes('salir') ||
                    text.includes('cerrar') ||
                    text.includes('abandonar') ||
                    text.includes('limpiar')) {
                    ArcadeAudio.back();
                } else {
                    ArcadeAudio.click();
                }
            }, true);
        }
    };

    global.ArcadeAudio = ArcadeAudio;
    ArcadeAudio.preventZoom();
})(window);

