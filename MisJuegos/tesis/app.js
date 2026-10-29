/**
 * Tesis Master - Lógica del Juego y Simulador de Examen de Grado
 * Filogenómica, Inferencia Filogenética y Minería de Datos (S. eubayanus)
 */

// Estado global de la aplicación
const state = {
    view: 'dashboard', // 'dashboard', 'quiz', 'results', 'flashcards', 'cheatsheet', 'study', 'oral'
    mode: 'quick',     // 'quick', 'defense', 'traps', 'category', 'oral'
    selectedCategory: null,
    
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    questionStates: [], // { selected: string, revealed: boolean, isCorrect: boolean }
    
    // Modo Pensar Primero (Blind Retrieval)
    blindMode: localStorage.getItem('tesis_blind') === 'true',
    blindRevealed: false,

    // Modo Defensa Oral (Sin Alternativas)
    oralQuestions: [],
    oralIndex: 0,
    oralRevealed: false,
    oralNotes: {},
    oralScores: { correct: 0, total: 0 },
    
    startTime: null,
    timerInterval: null,
    timeRemaining: 0,
    
    flashcardIndex: 0,
    flashcardFlipped: false,
    masteredFlashcards: JSON.parse(localStorage.getItem('tesis_mastered_fc') || '[]'),
    
    soundEnabled: localStorage.getItem('tesis_sound') !== 'false',
    
    // Estadísticas persistentes
    stats: JSON.parse(localStorage.getItem('tesis_stats') || JSON.stringify({
        testsCompleted: 0,
        bestScore: 0,
        trapsDefeated: 0,
        totalTrapsAnswered: 0,
        oralPracticed: 0,
        categoryStats: {} // category -> { correct: 0, total: 0 }
    }))
};

// ==========================================
// SISTEMA DE AUDIO (Web Audio API Synthesizer)
// ==========================================
class SoundFX {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
        if (!state.soundEnabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio feedback failed', e);
        }
    }

    correct() {
        if (!state.soundEnabled) return;
        this.playTone(523.25, 'triangle', 0.12, 0.12); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.12), 80); // E5
        setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.15), 160); // G5
    }

    wrong() {
        if (!state.soundEnabled) return;
        this.playTone(280, 'sawtooth', 0.18, 0.1);
        setTimeout(() => this.playTone(210, 'sawtooth', 0.25, 0.12), 120);
    }

    click() {
        this.playTone(400, 'sine', 0.04, 0.05);
    }

    flip() {
        this.playTone(320, 'sine', 0.08, 0.06);
    }

    victory() {
        if (!state.soundEnabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.15), idx * 120);
        });
    }
}
const sfx = new SoundFX();

// ==========================================
// INICIALIZACIÓN
// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Respuesta táctil instantánea en iOS
    document.addEventListener('touchstart', function() {}, { passive: true });

    updateNavbarSoundIcon();
    renderStatsDisplay();
    renderView();
    
    // Atajos de teclado ergonómicos
    document.addEventListener('keydown', handleKeyNav);

    // Gestos táctiles de deslizamiento (Swipe) para Flashcards en iPhone
    setupFlashcardSwipeGestures();
});

function setupFlashcardSwipeGestures() {
    let startX = 0;
    let startY = 0;
    const wrapper = document.getElementById('fc-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('touchstart', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        const diffX = endX - startX;
        const diffY = endY - startY;

        // Si el swipe es horizontal y supera 45px
        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
                nextFlashcard(); // swipe hacia la izquierda -> siguiente tarjeta
            } else {
                prevFlashcard(); // swipe hacia la derecha -> tarjeta anterior
            }
        }
    }, { passive: true });
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('tesis_sound', state.soundEnabled);
    updateNavbarSoundIcon();
    if (state.soundEnabled) sfx.click();
}

function updateNavbarSoundIcon() {
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
        btn.innerHTML = state.soundEnabled ? '🔊' : '🔇';
        btn.title = state.soundEnabled ? 'Silenciar Efectos' : 'Activar Sonido';
    }
}

// ==========================================
// CONTROL DE VISTAS
// ==========================================
function switchView(viewName) {
    sfx.click();
    clearInterval(state.timerInterval);
    state.view = viewName;
    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView() {
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        quiz: document.getElementById('view-quiz'),
        results: document.getElementById('view-results'),
        flashcards: document.getElementById('view-flashcards'),
        cheatsheet: document.getElementById('view-cheatsheet'),
        study: document.getElementById('view-study'),
        oral: document.getElementById('view-oral')
    };

    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].classList.add('hidden');
            views[key].classList.remove('fade-in');
        }
    });

    const activeView = views[state.view];
    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.classList.add('fade-in');
    }

    // Sincronizar barra de navegación móvil (iOS Native Tab Bar)
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    if (state.view === 'dashboard') document.getElementById('tab-dashboard')?.classList.add('active');
    else if (state.view === 'flashcards') document.getElementById('tab-flashcards')?.classList.add('active');
    else if (state.view === 'cheatsheet') document.getElementById('tab-cheatsheet')?.classList.add('active');
    else if (state.view === 'study') document.getElementById('tab-study')?.classList.add('active');
    else if (state.view === 'oral') document.getElementById('tab-oral')?.classList.add('active');
    else if (state.view === 'quiz') document.getElementById('tab-quick')?.classList.add('active');

    if (state.view === 'dashboard') {
        renderStatsDisplay();
    } else if (state.view === 'quiz') {
        renderQuizQuestion();
    } else if (state.view === 'results') {
        renderResultsView();
    } else if (state.view === 'flashcards') {
        renderFlashcard();
    } else if (state.view === 'cheatsheet') {
        renderCheatSheets();
    } else if (state.view === 'study') {
        renderStudyMode();
    } else if (state.view === 'oral') {
        renderOralQuestion();
    }
}

// ==========================================
// MEZCLADOR ALEATORIO DE ALTERNATIVAS (SHUFFLE)
// ==========================================
// Evita memorizar posiciones (A, B, C, D) para forzar comprensión conceptual real
function prepareQuestionWithShuffledOptions(rawQ) {
    const q = JSON.parse(JSON.stringify(rawQ));
    const letters = ['a', 'b', 'c', 'd'];
    const entries = Object.entries(q.options);
    const correctLetter = q.answer[0];
    const correctText = q.options[correctLetter];

    // Fisher-Yates Shuffle para desordenar las alternativas
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    const newOptions = {};
    let newCorrectLetter = 'a';
    entries.forEach(([oldKey, text], idx) => {
        const letter = letters[idx];
        newOptions[letter] = text;
        if (text === correctText) {
            newCorrectLetter = letter;
        }
    });

    q.options = newOptions;
    q.answer = [newCorrectLetter];
    q.originalId = rawQ.id;
    return q;
}

// ==========================================
// MODOS DE JUEGO & INICIO DE QUIZ
// ==========================================
function startMode(modeName, category = null) {
    sfx.click();
    state.mode = modeName;
    state.selectedCategory = category;
    state.currentIndex = 0;
    state.userAnswers = [];
    state.questionStates = [];
    state.startTime = Date.now();
    state.blindRevealed = false;
    
    let pool = [...thesisQuestions];
    
    if (category) {
        pool = pool.filter(q => q.category === category);
    }

    if (modeName === 'quick') {
        // 10 preguntas aleatorias con alternativas mezcladas
        state.questions = pool.sort(() => Math.random() - 0.5).slice(0, 10).map(prepareQuestionWithShuffledOptions);
    } else if (modeName === 'defense') {
        // Examen de grado completo: 20 preguntas con temporizador de 15 minutos y opciones mezcladas
        state.questions = pool.sort(() => Math.random() - 0.5).slice(0, 20).map(prepareQuestionWithShuffledOptions);
        state.timeRemaining = 15 * 60; // 15 minutos
        startDefenseTimer();
    } else if (modeName === 'traps') {
        // Modo solo trampas de examen con opciones mezcladas
        state.questions = pool.filter(q => q.isTrap).sort(() => Math.random() - 0.5).slice(0, 12).map(prepareQuestionWithShuffledOptions);
    }

    state.view = 'quiz';
    renderView();
}

function startDefenseTimer() {
    clearInterval(state.timerInterval);
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) timerEl.classList.remove('hidden');

    state.timerInterval = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();

        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            alert('⏰ ¡Tiempo límite de la Comisión cumplido! Evaluando tu examen...');
            finishQuiz();
        }
    }, 1000);
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    if (!timerText) return;
    const mins = Math.floor(state.timeRemaining / 60);
    const secs = state.timeRemaining % 60;
    timerText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==========================================
// RENDERIZADO DEL QUIZ
// ==========================================
function renderQuizQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    // Header de progreso
    const progressPercent = ((state.currentIndex + 1) / state.questions.length) * 100;
    const bar = document.getElementById('quiz-progress-bar');
    if (bar) bar.style.width = `${progressPercent}%`;

    const progressCounter = document.getElementById('quiz-counter-text');
    if (progressCounter) {
        progressCounter.textContent = `Pregunta ${state.currentIndex + 1} de ${state.questions.length}`;
    }

    // Timer display control
    const timerBox = document.getElementById('quiz-timer');
    if (timerBox) {
        if (state.mode === 'defense') {
            timerBox.classList.remove('hidden');
        } else {
            timerBox.classList.add('hidden');
        }
    }

    // Categoría y badges
    const catBadge = document.getElementById('q-category');
    if (catBadge) catBadge.textContent = q.categoryLabel;

    const trapBadge = document.getElementById('q-trap-badge');
    if (trapBadge) {
        if (q.isTrap) {
            trapBadge.classList.remove('hidden');
        } else {
            trapBadge.classList.add('hidden');
        }
    }

    const priorityBadge = document.getElementById('q-priority-badge');
    if (priorityBadge) {
        if (q.priority === 2) {
            priorityBadge.classList.remove('hidden');
        } else {
            priorityBadge.classList.add('hidden');
        }
    }

    // Texto de la pregunta
    const textEl = document.getElementById('q-text');
    if (textEl) textEl.textContent = q.question;

    // Actualizar botón de alternar modo 'Pensar Primero'
    const blindToggleBtn = document.getElementById('quiz-blind-toggle');
    if (blindToggleBtn) {
        blindToggleBtn.innerHTML = state.blindMode ? '👁️ Opciones Ocultas (ON)' : '🙈 Pensar Primero';
        blindToggleBtn.style.background = state.blindMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)';
        blindToggleBtn.style.borderColor = state.blindMode ? 'var(--primary-light)' : 'var(--border-color)';
    }

    // Opciones
    const optionsContainer = document.getElementById('options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    const currentAnswer = state.userAnswers[state.currentIndex];
    const isRevealed = state.mode !== 'defense' && currentAnswer !== undefined;
    const blindRevealBtn = document.getElementById('blind-reveal-btn');

    // Control de Blind Retrieval (Opciones borrosas hasta que el usuario decida verlas)
    const isBlindActive = state.blindMode && !state.blindRevealed && currentAnswer === undefined;
    if (isBlindActive) {
        optionsContainer.classList.add('blind-hidden');
        if (blindRevealBtn) blindRevealBtn.classList.remove('hidden');
    } else {
        optionsContainer.classList.remove('blind-hidden');
        if (blindRevealBtn) blindRevealBtn.classList.add('hidden');
    }

    Object.entries(q.options).forEach(([letter, text]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('data-letter', letter);

        const isSelected = currentAnswer === letter;
        const isCorrectOption = q.answer.includes(letter);

        if (isSelected) btn.classList.add('selected');

        if (isRevealed) {
            if (isCorrectOption) {
                btn.classList.add('correct-reveal');
            } else if (isSelected && !isCorrectOption) {
                btn.classList.add('wrong-reveal');
            }
            btn.disabled = true;
        }

        btn.innerHTML = `
            <div class="opt-letter">${letter.toUpperCase()}</div>
            <div class="opt-body">${text}</div>
        `;

        btn.onclick = () => selectOption(letter);
        optionsContainer.appendChild(btn);
    });

    // Caja de retroalimentación inmediata (explicación de la trampa en modos rápidos)
    const feedbackBox = document.getElementById('inline-feedback-container');
    if (feedbackBox) {
        if (isRevealed) {
            const isCorrect = q.answer.includes(currentAnswer);
            feedbackBox.className = `inline-feedback-box ${isCorrect ? 'correct' : 'wrong'} fade-in`;
            feedbackBox.innerHTML = `
                <div style="font-weight: 700; font-size: 1.05rem; color: ${isCorrect ? 'var(--bio-green)' : 'var(--danger)'}; margin-bottom: 6px;">
                    ${isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta'}
                </div>
                <div style="font-size: 0.9rem; line-height: 1.45; color: #cbd5e1; margin-bottom: 6px;">
                    ${q.keyTakeaway}
                </div>
                ${q.isTrap ? `
                    <div class="trap-callout">
                        <strong>🚨 Advertencia de Trampa de Comisión:</strong> ${q.trapExplanation}
                    </div>
                ` : ''}
                <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 8px;">
                    Fuente: ${q.academicReference}
                </div>
            `;
            feedbackBox.classList.remove('hidden');
        } else {
            feedbackBox.classList.add('hidden');
        }
    }

    // Actualizar botones de navegación
    const prevBtn = document.getElementById('quiz-prev-btn');
    if (prevBtn) prevBtn.disabled = state.currentIndex === 0;

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
        const hasAnswered = state.userAnswers[state.currentIndex] !== undefined;
        nextBtn.disabled = !hasAnswered;
        
        if (state.currentIndex === state.questions.length - 1) {
            nextBtn.innerHTML = 'Finalizar Examen ➔';
        } else {
            nextBtn.innerHTML = 'Siguiente ➔';
        }
    }
}

function toggleBlindMode() {
    sfx.click();
    state.blindMode = !state.blindMode;
    localStorage.setItem('tesis_blind', state.blindMode);
    state.blindRevealed = false;
    renderQuizQuestion();
}

function revealBlindOptions() {
    sfx.click();
    state.blindRevealed = true;
    renderQuizQuestion();
}

function selectOption(letter) {
    if (state.userAnswers[state.currentIndex] !== undefined && state.mode !== 'defense') {
        return; // ya revelado en modo práctica
    }

    const q = state.questions[state.currentIndex];
    state.userAnswers[state.currentIndex] = letter;
    const isCorrect = q.answer.includes(letter);

    if (isCorrect) {
        sfx.correct();
    } else {
        sfx.wrong();
    }

    renderQuizQuestion();
}

function nextQuestion() {
    sfx.click();
    state.blindRevealed = false;
    if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderQuizQuestion();
        window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
        finishQuiz();
    }
}

function prevQuestion() {
    sfx.click();
    state.blindRevealed = false;
    if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuizQuestion();
        window.scrollTo({ top: 100, behavior: 'smooth' });
    }
}

function exitQuizConfirm() {
    if (confirm('¿Deseas salir del examen actual? Perderás el progreso de esta sesión.')) {
        clearInterval(state.timerInterval);
        switchView('dashboard');
    }
}

// ==========================================
// MODO DEFENSA ORAL (SIN ALTERNATIVAS)
// ==========================================
function startOralMode() {
    sfx.click();
    state.mode = 'oral';
    state.oralIndex = 0;
    state.oralRevealed = false;
    state.oralNotes = {};
    state.oralScores = { correct: 0, total: 0 };
    
    // Barajar preguntas de examen
    state.oralQuestions = [...thesisQuestions].sort(() => Math.random() - 0.5);
    
    switchView('oral');
}

function renderOralQuestion() {
    const q = state.oralQuestions[state.oralIndex];
    if (!q) return;

    state.oralRevealed = false;

    const counter = document.getElementById('oral-counter-text');
    if (counter) counter.textContent = `Pregunta Oral ${state.oralIndex + 1} de ${state.oralQuestions.length}`;

    const title = document.getElementById('oral-question-title');
    if (title) title.textContent = q.question;

    const notesInput = document.getElementById('oral-notes-input');
    if (notesInput) {
        notesInput.value = state.oralNotes[q.id] || '';
        notesInput.disabled = false;
        setTimeout(() => notesInput.focus(), 50);
    }

    const revealBtn = document.getElementById('oral-reveal-btn');
    if (revealBtn) revealBtn.classList.remove('hidden');

    const dossierBox = document.getElementById('oral-dossier-box');
    if (dossierBox) dossierBox.classList.add('hidden');
}

function revealOralDossier() {
    sfx.click();
    state.oralRevealed = true;

    const q = state.oralQuestions[state.oralIndex];
    if (!q) return;

    const notesInput = document.getElementById('oral-notes-input');
    if (notesInput) {
        state.oralNotes[q.id] = notesInput.value;
        notesInput.disabled = true;
    }

    const revealBtn = document.getElementById('oral-reveal-btn');
    if (revealBtn) revealBtn.classList.add('hidden');

    const dossierBox = document.getElementById('oral-dossier-box');
    if (dossierBox) {
        dossierBox.classList.remove('hidden');
        dossierBox.classList.add('fade-in');
    }

    // Respuesta formal esperada (la opción correcta original)
    const targetAns = document.getElementById('oral-target-answer');
    const correctLetter = q.answer[0];
    if (targetAns) targetAns.innerHTML = `<strong>Argumento Central de Defensa:</strong> ${q.options[correctLetter]}`;

    // Generar checklist de puntos clave que debió mencionar
    const checklist = document.getElementById('oral-checklist');
    if (checklist) {
        const points = [
            q.keyTakeaway,
            `Fundamentar bajo el marco formal de ${q.academicReference}`,
            q.isTrap ? `Neutralizar la trampa de la comisión: ${q.trapExplanation}` : 'Explicar con precisión el principio computacional y biológico'
        ];
        checklist.innerHTML = points.map(pt => `
            <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>${pt}</span>
            </div>
        `).join('');
    }

    // Trampa
    const trapSection = document.getElementById('oral-trap-section');
    const trapContent = document.getElementById('oral-trap-content');
    if (trapSection && trapContent) {
        if (q.isTrap) {
            trapSection.classList.remove('hidden');
            trapContent.innerHTML = q.trapExplanation;
        } else {
            trapSection.classList.add('hidden');
        }
    }

    // Cita bibliográfica
    const citation = document.getElementById('oral-citation-text');
    if (citation) citation.textContent = q.academicReference;

    dossierBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function scoreOralQuestion(success) {
    if (success) {
        sfx.correct();
        state.oralScores.correct++;
    } else {
        sfx.wrong();
    }
    state.oralScores.total++;

    state.stats.oralPracticed = (state.stats.oralPracticed || 0) + 1;
    localStorage.setItem('tesis_stats', JSON.stringify(state.stats));

    nextOralQuestion();
}

function nextOralQuestion(requireConfirmation = true) {
    sfx.click();
    if (state.oralIndex < state.oralQuestions.length - 1) {
        state.oralIndex++;
        renderOralQuestion();
        window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
        alert(`🎉 ¡Completaste la ronda de Defensa Oral! Evaluaste ${state.oralScores.total} preguntas con ${state.oralScores.correct} explicaciones exitosas.`);
        switchView('dashboard');
    }
}

// ==========================================
// RESULTADOS & EVALUACIÓN DE LA COMISIÓN
// ==========================================
function finishQuiz() {
    clearInterval(state.timerInterval);
    state.view = 'results';
    
    // Calcular puntajes
    let totalScore = 0;
    let maxPoints = 0;
    let trapsAnswered = 0;
    let trapsDefeated = 0;
    
    const categoryBreakdown = {};

    state.questions.forEach((q, idx) => {
        const points = q.priority || 1;
        maxPoints += points;
        const userChoice = state.userAnswers[idx];
        const isCorrect = q.answer.includes(userChoice);

        if (isCorrect) totalScore += points;

        if (q.isTrap) {
            trapsAnswered++;
            if (isCorrect) trapsDefeated++;
        }

        if (!categoryBreakdown[q.category]) {
            categoryBreakdown[q.category] = { correct: 0, total: 0, label: q.categoryLabel };
        }
        categoryBreakdown[q.category].total++;
        if (isCorrect) categoryBreakdown[q.category].correct++;

        // Actualizar estadísticas persistentes
        if (!state.stats.categoryStats[q.category]) {
            state.stats.categoryStats[q.category] = { correct: 0, total: 0 };
        }
        state.stats.categoryStats[q.category].total++;
        if (isCorrect) state.stats.categoryStats[q.category].correct++;
    });

    const percent = Math.round((totalScore / maxPoints) * 100);
    const timeTaken = Math.round((Date.now() - state.startTime) / 1000);

    // Guardar estadísticas
    state.stats.testsCompleted++;
    if (percent > state.stats.bestScore) state.stats.bestScore = percent;
    state.stats.totalTrapsAnswered += trapsAnswered;
    state.stats.trapsDefeated += trapsDefeated;
    localStorage.setItem('tesis_stats', JSON.stringify(state.stats));

    if (percent >= 85) {
        sfx.victory();
    }

    renderView();
}

function renderResultsView() {
    let totalScore = 0;
    let maxPoints = 0;
    
    state.questions.forEach((q, idx) => {
        const points = q.priority || 1;
        maxPoints += points;
        if (q.answer.includes(state.userAnswers[idx])) totalScore += points;
    });

    const percent = Math.round((totalScore / maxPoints) * 100);
    const timeTaken = Math.round((Date.now() - state.startTime) / 1000);
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    // Conic gradient orb
    const orb = document.getElementById('results-orb');
    if (orb) {
        let orbColor = 'var(--bio-green)';
        if (percent < 70) orbColor = 'var(--danger)';
        else if (percent < 85) orbColor = 'var(--warning)';
        orb.style.background = `conic-gradient(${orbColor} ${percent * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`;
    }

    const percentEl = document.getElementById('results-percent');
    if (percentEl) percentEl.textContent = `${percent}%`;

    const pointsEl = document.getElementById('results-points');
    if (pointsEl) pointsEl.textContent = `${totalScore} / ${maxPoints} pts`;

    const timeEl = document.getElementById('results-time');
    if (timeEl) timeEl.textContent = `${mins}m ${secs}s`;

    // Veredicto de la Comisión
    const verdictTitle = document.getElementById('verdict-title');
    const verdictDesc = document.getElementById('verdict-desc');

    if (percent >= 95) {
        verdictTitle.innerHTML = '🌟 ¡Distinción Máxima Unánime!';
        verdictTitle.style.color = 'var(--gold)';
        verdictDesc.innerHTML = 'Excelente dominio conceptual. Has superado las preguntas trampa con precisión quirúrgica y demuestras un conocimiento riguroso de cada fórmula, complejidad y fundamento teórico.';
    } else if (percent >= 85) {
        verdictTitle.innerHTML = '🎓 ¡Aprobado con Distinción!';
        verdictTitle.style.color = 'var(--bio-green)';
        verdictDesc.innerHTML = 'Gran preparación. Tienes muy claros los contrastes entre árboles génicos y de especies, las métricas de cuartetos y los paradigmas de clustering. Revisa los detalles finos marcados en rojo.';
    } else if (percent >= 70) {
        verdictTitle.innerHTML = '📜 Aprobado por Mayoría';
        verdictTitle.style.color = 'var(--warning)';
        verdictDesc.innerHTML = 'Comprendes los conceptos nucleares, pero caíste en algunas trampas de la comisión (complejidades asintóticas o hipótesis de K-Means vs FANNY). ¡Un repaso con las Flashcards y estarás listo!';
    } else {
        verdictTitle.innerHTML = '⚠️ Defensa con Observaciones';
        verdictTitle.style.color = 'var(--danger)';
        verdictDesc.innerHTML = 'La comisión examinadora detectó confusiones importantes. No te desanimes: utiliza el Modo Flashcards y la Tabla Comparativa para memorizar bien los principios operativos.';
    }

    // Lista de revisión detallada
    renderReviewList();
}

function renderReviewList() {
    const container = document.getElementById('results-review-list');
    if (!container) return;

    container.innerHTML = state.questions.map((q, idx) => {
        const userChoice = state.userAnswers[idx];
        const isCorrect = q.answer.includes(userChoice);
        const correctChoice = q.answer[0];

        const userText = userChoice ? q.options[userChoice] : 'Sin responder';
        const correctText = q.options[correctChoice];

        return `
            <div style="background: rgba(16, 23, 41, 0.6); border: 1px solid var(--border-color); border-left: 4px solid ${isCorrect ? 'var(--bio-green)' : 'var(--danger)'}; border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">
                        #${idx + 1} • ${q.categoryLabel}
                    </span>
                    <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${isCorrect ? 'var(--bio-green)' : '#fca5a5'};">
                        ${isCorrect ? '✓ Acertada' : '✗ Fallada'}
                    </span>
                </div>

                <div style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 12px; line-height: 1.4;">
                    ${q.question}
                </div>

                <div style="font-size: 0.88rem; padding: 10px 14px; border-radius: 8px; background: ${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; margin-bottom: 8px; color: ${isCorrect ? 'var(--bio-green)' : '#fca5a5'};">
                    <strong>Tu respuesta:</strong> ${userChoice ? userChoice.toUpperCase() + ') ' : ''}${userText}
                </div>

                ${!isCorrect ? `
                    <div style="font-size: 0.88rem; padding: 10px 14px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 8px; color: var(--bio-green);">
                        <strong>Respuesta correcta:</strong> ${correctChoice.toUpperCase()}) ${correctText}
                    </div>
                ` : ''}

                ${q.isTrap ? `
                    <div class="trap-callout" style="margin-top: 8px;">
                        <strong>🚨 Explicación de la Trampa:</strong> ${q.trapExplanation}
                    </div>
                ` : ''}

                <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 8px;">
                    💡 <em>${q.keyTakeaway}</em> — Ref: ${q.academicReference}
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// TARJETAS MNEMOTÉCNICAS (FLASHCARDS 3D)
// ==========================================
function renderFlashcard() {
    const fc = thesisFlashcards[state.flashcardIndex];
    if (!fc) return;

    state.flashcardFlipped = false;
    const wrapper = document.getElementById('fc-wrapper');
    if (wrapper) wrapper.classList.remove('flipped');

    const catEl = document.getElementById('fc-category');
    if (catEl) catEl.textContent = fc.category;

    const counterEl = document.getElementById('fc-counter');
    if (counterEl) {
        const masteredCount = state.masteredFlashcards.length;
        counterEl.textContent = `Tarjeta ${state.flashcardIndex + 1} de ${thesisFlashcards.length} (${masteredCount} dominadas)`;
    }

    const frontText = document.getElementById('fc-front-text');
    if (frontText) frontText.textContent = fc.front;

    const backText = document.getElementById('fc-back-text');
    if (backText) backText.textContent = fc.back;

    const trickText = document.getElementById('fc-trick-text');
    if (trickText) trickText.textContent = fc.trick;

    const masterBtn = document.getElementById('fc-master-btn');
    if (masterBtn) {
        const isMastered = state.masteredFlashcards.includes(fc.id);
        masterBtn.innerHTML = isMastered ? '⭐ Tarjeta Dominada' : '☆ Marcar como Dominada';
        masterBtn.className = isMastered ? 'btn btn-primary' : 'btn btn-secondary';
    }

    // Botones prev / next
    const prevBtn = document.getElementById('fc-prev-btn');
    if (prevBtn) prevBtn.disabled = state.flashcardIndex === 0;

    const nextBtn = document.getElementById('fc-next-btn');
    if (nextBtn) nextBtn.disabled = state.flashcardIndex === thesisFlashcards.length - 1;
}

function flipFlashcard() {
    sfx.flip();
    state.flashcardFlipped = !state.flashcardFlipped;
    const wrapper = document.getElementById('fc-wrapper');
    if (wrapper) wrapper.classList.toggle('flipped');
}

function nextFlashcard() {
    sfx.click();
    if (state.flashcardIndex < thesisFlashcards.length - 1) {
        state.flashcardIndex++;
        renderFlashcard();
    }
}

function prevFlashcard() {
    sfx.click();
    if (state.flashcardIndex > 0) {
        state.flashcardIndex--;
        renderFlashcard();
    }
}

function toggleMasteredFlashcard(e) {
    if (e) e.stopPropagation();
    sfx.click();
    const fc = thesisFlashcards[state.flashcardIndex];
    if (!fc) return;

    const idx = state.masteredFlashcards.indexOf(fc.id);
    if (idx > -1) {
        state.masteredFlashcards.splice(idx, 1);
    } else {
        state.masteredFlashcards.push(fc.id);
    }

    localStorage.setItem('tesis_mastered_fc', JSON.stringify(state.masteredFlashcards));
    renderFlashcard();
    renderStatsDisplay();
}

// ==========================================
// TABLAS COMPARATIVAS (CHEAT SHEET)
// ==========================================
function renderCheatSheets() {
    // Tabla Inferencia
    const inferenciaBody = document.getElementById('table-inferencia-body');
    if (inferenciaBody) {
        inferenciaBody.innerHTML = thesisCheatSheets.inferencia.map(row => {
            let compClass = 'complexity-med';
            if (row.complejidad.includes('Baja')) compClass = 'complexity-low';
            else if (row.complejidad.includes('Alta') && !row.complejidad.includes('Muy')) compClass = 'complexity-high';
            else if (row.complejidad.includes('Muy Alta')) compClass = 'complexity-extreme';

            return `
                <tr>
                    <td><strong style="color: #ffffff;">${row.metodo}</strong></td>
                    <td>${row.principio}</td>
                    <td><span class="badge-complexity ${compClass}">${row.complejidad}</span></td>
                    <td style="color: var(--accent);">${row.solucion}</td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${row.evaluacionComision}</td>
                </tr>
            `;
        }).join('');
    }

    // Tabla Agrupamiento
    const agrupamientoBody = document.getElementById('table-agrupamiento-body');
    if (agrupamientoBody) {
        agrupamientoBody.innerHTML = thesisCheatSheets.agrupamiento.map(row => {
            let compClass = 'complexity-med';
            if (row.complejidad.includes('n³')) compClass = 'complexity-high';
            else if (row.complejidad.includes('n² log n')) compClass = 'complexity-med';
            else if (row.complejidad.includes('n²')) compClass = 'complexity-low';

            const isKAuto = row.kDefinicion.includes('No requerido') || row.kDefinicion.includes('corte');

            return `
                <tr>
                    <td><strong style="color: #ffffff;">${row.metodo}</strong></td>
                    <td>${row.principio}</td>
                    <td><span class="badge-complexity ${compClass}">${row.complejidad}</span></td>
                    <td><span style="font-weight: 600; color: ${isKAuto ? 'var(--bio-green)' : 'var(--warning)'};">${row.kDefinicion}</span></td>
                    <td style="font-size: 0.8rem; color: #cbd5e1;">${row.filogeniaNotas}</td>
                </tr>
            `;
        }).join('');
    }
}

// ==========================================
// MODO ESTUDIO (COMPENDIO COMPLETO)
// ==========================================
function renderStudyMode() {
    const list = document.getElementById('study-questions-list');
    if (!list) return;

    const searchTerm = (document.getElementById('study-search-input')?.value || '').toLowerCase().trim();
    const filterCat = document.getElementById('study-filter-select')?.value || 'all';

    let filtered = thesisQuestions.filter(q => {
        const matchesCat = filterCat === 'all' || q.category === filterCat;
        const matchesSearch = !searchTerm || 
            q.question.toLowerCase().includes(searchTerm) || 
            q.keyTakeaway.toLowerCase().includes(searchTerm) ||
            q.trapExplanation.toLowerCase().includes(searchTerm);
        return matchesCat && matchesSearch;
    });

    const countEl = document.getElementById('study-count-text');
    if (countEl) countEl.textContent = `Mostrando ${filtered.length} de ${thesisQuestions.length} preguntas`;

    list.innerHTML = filtered.map(q => {
        const correctLetter = q.answer[0];
        return `
            <div class="glass-card" style="padding: 22px; margin-bottom: 16px; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">
                        Pregunta #${q.id} • ${q.categoryLabel}
                    </span>
                    <div style="display: flex; gap: 6px;">
                        ${q.isTrap ? '<span class="q-trap-tag">⚠️ Pregunta Trampa</span>' : ''}
                        ${q.priority === 2 ? '<span style="font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(99,102,241,0.2); color: #c7d2fe;">Doble Puntaje</span>' : ''}
                    </div>
                </div>

                <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 14px; line-height: 1.45;">
                    ${q.question}
                </h3>

                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                    ${Object.entries(q.options).map(([letter, text]) => {
                        const isCorrect = letter === correctLetter;
                        return `
                            <div style="padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; line-height: 1.4; background: ${isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${isCorrect ? 'var(--bio-green)' : 'var(--border-color)'};">
                                <strong style="color: ${isCorrect ? 'var(--bio-green)' : 'var(--text-muted)'};">${letter.toUpperCase()})</strong> ${text}
                            </div>
                        `;
                    }).join('')}
                </div>

                ${q.isTrap ? `
                    <div class="trap-callout" style="margin-bottom: 10px;">
                        <strong>🚨 Por qué es una trampa:</strong> ${q.trapExplanation}
                    </div>
                ` : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-dim); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                    <span>💡 <strong>Concepto clave:</strong> ${q.keyTakeaway}</span>
                    <span>Ref: ${q.academicReference}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// ESTADÍSTICAS DEL DASHBOARD
// ==========================================
function renderStatsDisplay() {
    const totalEl = document.getElementById('dash-stat-tests');
    if (totalEl) totalEl.textContent = state.stats.testsCompleted;

    const scoreEl = document.getElementById('dash-stat-score');
    if (scoreEl) scoreEl.textContent = `${state.stats.bestScore}%`;

    const masteredEl = document.getElementById('dash-stat-mastered');
    if (masteredEl) masteredEl.textContent = `${state.masteredFlashcards.length} / ${thesisFlashcards.length}`;

    // Distribución de desempeño para atacar la "mala memoria"
    const weakList = document.getElementById('weak-areas-list');
    if (weakList) {
        const stats = state.stats.categoryStats;
        const categories = [
            { id: 'conceptos', name: 'Conceptos Filogenéticos' },
            { id: 'inferencia', name: 'Inferencia (NJ, MP, ML, Bayes)' },
            { id: 'distancia', name: 'Métricas de Distancia (RF vs QD)' },
            { id: 'agrupamiento', name: 'Agrupamiento (K-Means, FANNY, MST)' },
            { id: 'complejidades', name: 'Complejidades y Algoritmos' }
        ];

        weakList.innerHTML = categories.map(cat => {
            const data = stats[cat.id] || { correct: 0, total: 0 };
            const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            let barColor = 'var(--bio-green)';
            if (data.total > 0 && rate < 70) barColor = 'var(--danger)';
            else if (data.total > 0 && rate < 85) barColor = 'var(--warning)';

            return `
                <div style="margin-bottom: 12px; font-size: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>${cat.name}</span>
                        <span style="font-weight: 700; color: ${data.total === 0 ? 'var(--text-dim)' : barColor};">
                            ${data.total === 0 ? 'Sin datos' : `${rate}% (${data.correct}/${data.total})`}
                        </span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${data.total === 0 ? 0 : rate}%; background: ${barColor}; transition: width 0.4s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Reset stats
function resetAllStats() {
    if (confirm('¿Deseas reiniciar todas tus estadísticas y tarjetas dominadas?')) {
        localStorage.removeItem('tesis_stats');
        localStorage.removeItem('tesis_mastered_fc');
        state.stats = {
            testsCompleted: 0,
            bestScore: 0,
            trapsDefeated: 0,
            totalTrapsAnswered: 0,
            categoryStats: {}
        };
        state.masteredFlashcards = [];
        renderStatsDisplay();
        alert('Estadísticas reiniciadas correctamente.');
    }
}

// Atajos de teclado
function handleKeyNav(e) {
    if (state.view === 'quiz') {
        const key = e.key.toLowerCase();
        if (['a', 'b', 'c', 'd'].includes(key)) {
            selectOption(key);
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            const nextBtn = document.getElementById('quiz-next-btn');
            if (nextBtn && !nextBtn.disabled) nextQuestion();
        } else if (e.key === 'ArrowLeft') {
            const prevBtn = document.getElementById('quiz-prev-btn');
            if (prevBtn && !prevBtn.disabled) prevQuestion();
        }
    } else if (state.view === 'flashcards') {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipFlashcard();
        } else if (e.key === 'ArrowRight') {
            nextFlashcard();
        } else if (e.key === 'ArrowLeft') {
            prevFlashcard();
        }
    }
}
