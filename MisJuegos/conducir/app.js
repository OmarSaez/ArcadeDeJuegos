/**
 * Conducir Pro - App Logic
 */

const state = {
    view: 'dashboard', // dashboard, quiz, results, study
    mode: null, // quick, full, study
    questions: [],
    currentIndex: 0,
    answers: [],
    timer: null,
    timeRemaining: 0,
    startTime: null,
    studyPage: 0,
    questionsPerPage: 20
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Force instant touch response for iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    renderView();
    updateGlobalStats();
});

function renderView() {
    const dashboard = document.getElementById('dashboard-view');
    const quiz = document.getElementById('quiz-view');
    const results = document.getElementById('results-view');
    const study = document.getElementById('study-view');

    [dashboard, quiz, results, study].forEach(v => v?.classList.add('hidden'));

    if (state.view === 'dashboard') {
        dashboard.classList.remove('hidden');
        dashboard.classList.add('fade-in');
        updateGlobalStats();
    } else if (state.view === 'quiz') {
        quiz.classList.remove('hidden');
        quiz.classList.add('fade-in');
        renderQuestion();
    } else if (state.view === 'results') {
        results.classList.remove('hidden');
        results.classList.add('fade-in');
        renderResults();
    } else if (state.view === 'study') {
        study.classList.remove('hidden');
        study.classList.add('fade-in');
        renderStudyMode();
    }
}

// Navigation Functions (Exposed to window for iOS onclick support)
window.startQuickTest = function() {
    state.mode = 'quick';
    state.questions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    state.currentIndex = 0;
    state.answers = [];
    state.view = 'quiz';
    state.startTime = Date.now();
    renderView();
};

window.startFullExam = function() {
    state.mode = 'full';
    state.questions = [...questions].sort(() => Math.random() - 0.5).slice(0, 35);
    state.currentIndex = 0;
    state.answers = [];
    state.view = 'quiz';
    state.startTime = Date.now();
    renderView();
};

window.startStudyMode = function() {
    state.mode = 'study';
    state.view = 'study';
    state.studyPage = 0;
    renderView();
};

window.changeStudyPage = function(delta) {
    state.studyPage += delta;
    renderStudyMode();
    window.scrollTo(0, 0);
};

window.backToDashboard = function() {
    if (confirm('¿Estás seguro de que quieres salir? Perderás el progreso actual.')) {
        state.view = 'dashboard';
        renderView();
    }
};

// Quiz Logic
function renderQuestion() {
    const q = state.questions[state.currentIndex];
    const container = document.getElementById('question-area');
    const progressFill = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.innerText = `Pregunta ${state.currentIndex + 1} de ${state.questions.length}`;

    container.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 16px;">
            ${q.priority === 2 ? '<span style="background: var(--danger); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Doble Puntaje</span>' : ''}
        </div>
        <h2 class="fade-in">${q.question}</h2>
        
        ${q.image ? `
            <div class="question-image-container fade-in">
                <img src="${q.image}" alt="Imagen de la pregunta" class="question-image">
            </div>
        ` : ''}

        <div class="options-container ${q.type === 'image_options' ? 'image-grid' : ''}">
            ${q.type === 'matching' ? renderMatchingUI(q) : renderOptions(q)}
        </div>
    `;

    updateControls();
}

function renderOptions(q) {
    return Object.entries(q.options).map(([key, value]) => {
        const isImage = q.type === 'image_options';
        const isSelected = state.answers[state.currentIndex]?.includes(key);
        
        return `
            <button class="option ${isSelected ? 'selected' : ''} ${isImage ? 'image-option' : ''}" 
                 onclick="selectOption('${key}')">
                <div class="option-letter">${key.toUpperCase()}</div>
                <div class="option-text">
                    ${isImage ? `<img src="${value}" alt="Opción ${key}">` : value}
                </div>
            </button>
        `;
    }).join('');
}

function renderMatchingUI(q) {
    // Initialize answer for matching if not exists
    if (!state.answers[state.currentIndex]) {
        state.answers[state.currentIndex] = {};
    }

    const currentMatches = state.answers[state.currentIndex];

    return `
        <div class="matching-container">
            <div class="matching-images">
                ${Object.entries(q.matching_images).map(([num, src]) => `
                    <div class="matching-item">
                        <span class="matching-num">${num}</span>
                        <img src="${src}" alt="Señal ${num}">
                    </div>
                `).join('')}
            </div>
            <div class="matching-controls">
                ${Object.entries(q.options).map(([letter, text]) => `
                    <div class="matching-row">
                        <div class="matching-label">${letter.toUpperCase()}) ${text}</div>
                        <select onchange="selectMatch('${letter}', this.value)" class="matching-select">
                            <option value="">--</option>
                            ${[1,2,3,4,5].map(n => `
                                <option value="${n}" ${currentMatches[letter] == n ? 'selected' : ''}>${n}</option>
                            `).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.selectMatch = (letter, value) => {
    if (!state.answers[state.currentIndex]) state.answers[state.currentIndex] = {};
    state.answers[state.currentIndex][letter] = value;
    // We don't need to re-render everything, just update the state
};

window.selectOption = function(key) {
    const q = state.questions[state.currentIndex];
    
    if (!state.answers[state.currentIndex]) {
        state.answers[state.currentIndex] = [];
    }

    if (q.answer.length > 1) {
        // Multi-answer
        if (state.answers[state.currentIndex].includes(key)) {
            state.answers[state.currentIndex] = state.answers[state.currentIndex].filter(a => a !== key);
        } else {
            state.answers[state.currentIndex].push(key);
        }
    } else {
        // Single answer
        state.answers[state.currentIndex] = [key];
    }

    renderQuestion();
};

function updateControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = state.currentIndex === 0;
    nextBtn.innerText = state.currentIndex === state.questions.length - 1 ? 'Finalizar' : 'Siguiente';
    
    const currentAnswer = state.answers[state.currentIndex];
    const q = state.questions[state.currentIndex];
    
    if (q.type === 'matching') {
        // For matching, ensure all fields are filled
        const filledCount = Object.keys(currentAnswer || {}).filter(k => currentAnswer[k]).length;
        nextBtn.disabled = filledCount < Object.keys(q.options).length;
    } else {
        nextBtn.disabled = !currentAnswer || currentAnswer.length === 0;
    }
}

window.nextQuestion = function() {
    if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
};

window.prevQuestion = function() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
    }
};

function checkAnswerCorrectness(q, userAns) {
    if (!userAns) return false;
    
    if (q.type === 'matching') {
        if (!q.answer || typeof q.answer !== 'object') return false;
        return Object.keys(q.answer).every(key => q.answer[key] == userAns[key]);
    } else {
        const correctAns = q.answer || [];
        return Array.isArray(userAns) && 
               userAns.length === correctAns.length && 
               userAns.every(v => correctAns.includes(v));
    }
}

function finishQuiz() {
    state.view = 'results';
    saveStats();
    renderView();
}

// Results Logic
function renderResults() {
    let score = 0;
    let maxPoints = 0;
    
    state.questions.forEach((q, i) => {
        const points = q.priority || 1;
        maxPoints += points;
        if (checkAnswerCorrectness(q, state.answers[i])) {
            score += points;
        }
    });

    const percent = Math.round((score / maxPoints) * 100);
    const timeTaken = Math.round((Date.now() - state.startTime) / 1000);
    
    document.getElementById('score-value').innerText = `${score}/${maxPoints}`;
    document.getElementById('results-percent').innerText = `${percent}%`;
    document.getElementById('results-time').innerText = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;

    const message = document.getElementById('results-message');
    if (percent >= 90) {
        message.innerText = '¡Excelente! Estás listo para el examen real.';
        message.style.color = 'var(--success)';
    } else if (percent >= 75) {
        message.innerText = '¡Buen trabajo! Un poco más de práctica y estarás listo.';
        message.style.color = 'var(--primary-light)';
    } else {
        message.innerText = 'Sigue estudiando. ¡Tú puedes lograrlo!';
        message.style.color = 'var(--danger)';
    }

    // Render Review
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = state.questions.map((q, i) => {
        const userAns = state.answers[i];
        const isCorrect = checkAnswerCorrectness(q, userAns);
        const correctAns = q.answer;
        
        let userText = 'Ninguna';
        if (q.type === 'matching') {
            userText = userAns ? Object.entries(userAns).map(([l, n]) => `${l.toUpperCase()}➔${n}`).join(', ') : 'Ninguna';
        } else if (Array.isArray(userAns) && userAns.length > 0) {
            userText = userAns.map(key => `${key.toUpperCase()}) ${q.options[key]}`).join(' | ');
        }

        let correctText = '';
        if (q.type === 'matching') {
            correctText = Object.entries(correctAns).map(([l, n]) => `${l.toUpperCase()}➔${n}`).join(', ');
        } else {
            correctText = correctAns.map(key => `${key.toUpperCase()}) ${q.options[key]}`).join(' | ');
        }

        return `
            <div class="review-item ${isCorrect ? 'correct' : 'wrong'}" style="text-align: left; margin-bottom: 24px; padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.02); border-left: 4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                <p style="font-weight: 600; margin-bottom: 8px;">${i + 1}. ${q.question}</p>
                <p style="font-size: 0.85rem; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                    <strong>Tu respuesta:</strong> ${userText}
                </p>
                ${!isCorrect ? `
                    <p style="font-size: 0.85rem; color: var(--success); margin-top: 6px; padding: 8px; background: rgba(16, 185, 129, 0.05); border-radius: 8px;">
                        <strong>Correcta:</strong> ${correctText}
                    </p>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Study Mode Logic
window.renderStudyMode = function() {
    const studyList = document.getElementById('study-list');
    const start = state.studyPage * state.questionsPerPage;
    const end = start + state.questionsPerPage;
    const pageQuestions = questions.slice(start, end);
    const totalPages = Math.ceil(questions.length / state.questionsPerPage);

    studyList.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button class="btn btn-secondary" onclick="state.view = 'dashboard'; renderView();">Volver</button>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
                Página ${state.studyPage + 1} de ${totalPages} (${questions.length} total)
            </div>
        </div>

        <div class="study-grid" style="display: flex; flex-direction: column; gap: 20px;">
            ${pageQuestions.map(q => `
                <div class="glass-card" style="padding: 24px; text-align: left; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <h3 style="font-size: 1.15rem; flex: 1;">${q.id}. ${q.question}</h3>
                        ${q.priority === 2 ? '<span style="background: var(--danger); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.65rem; font-weight: 800;">DOBLE PUNTAJE</span>' : ''}
                    </div>

                    ${q.image ? `<img src="${q.image}" style="max-height: 200px; margin-bottom: 15px; border-radius: 8px; border: 1px solid var(--border);">` : ''}

                    <div style="display: grid; gap: 10px;">
                        ${q.type === 'matching' ? `
                            <div style="background: rgba(16, 185, 129, 0.05); padding: 15px; border-radius: 12px; border: 1px solid var(--success);">
                                <p style="font-weight: bold; margin-bottom: 8px; color: var(--success);">Solución:</p>
                                ${Object.entries(q.answer).map(([letra, num]) => `
                                    <div style="font-size: 0.9rem;">${letra.toUpperCase()}) ${q.options[letra]} <span style="color: var(--accent)">➔ Señal ${num}</span></div>
                                `).join('')}
                            </div>
                        ` : Object.entries(q.options).map(([k, v]) => {
                            const isCorrect = q.answer.includes(k);
                            const isImgOpt = q.type === 'image_options';
                            return `
                                <div style="padding: 10px 15px; border-radius: 10px; background: ${isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${isCorrect ? 'var(--success)' : 'var(--border)'}">
                                    <strong style="color: ${isCorrect ? 'var(--success)' : 'var(--text-muted)'}">${k.toUpperCase()}:</strong> 
                                    ${isImgOpt ? `<br><img src="${v}" style="max-height: 80px; margin-top: 5px;">` : v}
                                    ${isCorrect ? ' <span style="float: right;">✓</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: center; gap: 20px; padding-bottom: 40px;">
            <button class="btn btn-secondary" onclick="changeStudyPage(-1)" ${state.studyPage === 0 ? 'disabled' : ''}>Anterior</button>
            <button class="btn btn-primary" onclick="changeStudyPage(1)" ${end >= questions.length ? 'disabled' : ''}>Siguiente</button>
        </div>
    `;
};

// Persistence
function saveStats() {
    const stats = JSON.parse(localStorage.getItem('conducir_pro_stats') || '{"totalTests": 0, "highScore": 0}');
    stats.totalTests++;
    
    let score = 0;
    let maxPoints = 0;
    state.questions.forEach((q, i) => {
        const points = q.priority || 1;
        maxPoints += points;
        if (checkAnswerCorrectness(q, state.answers[i])) {
            score += points;
        }
    });
    
    const percent = (score / maxPoints) * 100;
    if (percent > stats.highScore) stats.highScore = Math.round(percent);
    
    localStorage.setItem('conducir_pro_stats', JSON.stringify(stats));
}

function updateGlobalStats() {
    const stats = JSON.parse(localStorage.getItem('conducir_pro_stats') || '{"totalTests": 0, "highScore": 0}');
    const testsEl = document.getElementById('stat-total-tests');
    const scoreEl = document.getElementById('stat-high-score');
    
    if (testsEl) testsEl.innerText = stats.totalTests;
    if (scoreEl) scoreEl.innerText = `${stats.highScore}%`;
}
