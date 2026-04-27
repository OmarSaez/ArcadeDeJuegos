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

window.goToStudyPage = function(index) {
    state.studyPage = index;
    renderStudyMode();
    window.scrollTo(0, 0);
};

window.jumpToQuestion = function() {
    const qId = parseInt(document.getElementById('jump-q-input').value);
    if (!qId || qId < 1 || qId > questions.length) {
        alert("Ingresa un número válido entre 1 y " + questions.length);
        return;
    }
    // Find page: index / perPage
    state.studyPage = Math.floor((qId - 1) / state.questionsPerPage);
    renderStudyMode();
    // Small delay to allow render, then scroll to the question
    setTimeout(() => {
        const el = document.getElementById(`study-q-${qId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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
    progressText.innerHTML = `
        Pregunta ${state.currentIndex + 1} de ${state.questions.length} 
        <br><span style="font-size: 0.7rem; color: var(--accent); opacity: 0.8;">(ID Global: #${q.id})</span>
    `;

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
    if (value === "") {
        delete state.answers[state.currentIndex][letter];
    } else {
        state.answers[state.currentIndex][letter] = value;
    }
    updateControls();
};

window.selectOption = function(key) {
    const q = state.questions[state.currentIndex];
    
    if (!state.answers[state.currentIndex] || !Array.isArray(state.answers[state.currentIndex])) {
        state.answers[state.currentIndex] = [];
    }
    
    const currentAns = state.answers[state.currentIndex];
    const index = currentAns.indexOf(key);
    const isMultiple = q.answer.length > 1;

    if (isMultiple) {
        if (index > -1) currentAns.splice(index, 1);
        else currentAns.push(key);
    } else {
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
        const filledCount = Object.keys(currentAnswer || {}).filter(k => currentAnswer[k]).length;
        nextBtn.disabled = filledCount < Object.keys(q.options).length;
    } else {
        nextBtn.disabled = !currentAnswer || currentAnswer.length === 0;
    }
}

window.nextQuestion = function() {
    const q = state.questions[state.currentIndex];
    const userAns = state.answers[state.currentIndex];

    // Basic validation before moving forward
    if (q.type === 'matching') {
        const totalKeys = Object.keys(q.options).length;
        const filledCount = Object.keys(userAns || {}).filter(k => userAns[k]).length;
        if (filledCount < totalKeys) {
            alert('Por favor, asocia todas las imágenes antes de continuar.');
            return;
        }
    } else {
        if (!userAns || userAns.length === 0) {
            alert('Por favor selecciona al menos una respuesta.');
            return;
        }
    }

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
        const userColor = isCorrect ? '#10b981' : '#ef4444';
        if (q.type === 'matching') {
            userText = userAns ? Object.entries(userAns).map(([l, n]) => `<div style="margin-top:2px; color: ${userColor}">${l.toUpperCase()} ➔ Señal ${n}</div>`).join('') : 'Ninguna';
        } else if (Array.isArray(userAns) && userAns.length > 0) {
            userText = userAns.map(key => `<div style="margin-top:2px; color: ${userColor}">${key.toUpperCase()}) ${q.options[key]}</div>`).join('');
        }

        let correctText = '';
        if (q.type === 'matching') {
            correctText = Object.entries(correctAns).map(([l, n]) => `<div style="margin-top:2px; color: #10b981">${l.toUpperCase()} ➔ Señal ${n}</div>`).join('');
        } else {
            correctText = correctAns.map(key => {
                const isImgOpt = q.type === 'image_options';
                const content = isImgOpt ? `<img src="${q.options[key]}" style="max-height: 80px; margin-top: 5px; border: 2px solid #10b981; border-radius: 4px;">` : q.options[key];
                return `<div style="margin-top:2px; color: #10b981">${key.toUpperCase()}) ${content}</div>`;
            }).join('');
        }

        return `
            <div class="review-item ${isCorrect ? 'correct' : 'wrong'}" style="text-align: left; margin-bottom: 24px; padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.02); border-left: 4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}">
                <div style="margin-bottom: 10px;">
                    <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted);">#${q.id}</span>
                    ${q.priority === 2 ? '<span class="badge badge-double">Puntaje Doble</span>' : ''}
                    ${q.answer.length > 1 ? '<span class="badge badge-multi">Selección Múltiple</span>' : ''}
                </div>
                
                <p style="font-weight: 600; margin-bottom: 8px;">${i + 1}. ${q.question}</p>
                
                ${q.image ? `<img src="${q.image}" style="max-height: 120px; display: block; margin: 10px 0; border-radius: 8px; border: 1px solid var(--border);">` : ''}

                <p style="font-size: 0.85rem; color: ${isCorrect ? '#10b981' : '#ef4444'}; background: ${isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; padding: 10px; border-radius: 8px; border: 1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}">
                    <strong style="color: ${isCorrect ? '#10b981' : '#ef4444'}">Tu respuesta:</strong><br>${userText}
                </p>
                ${!isCorrect ? `
                    <p style="font-size: 0.85rem; color: #10b981; margin-top: 8px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                        <strong style="color: #10b981">Correcta:</strong><br>${correctText}
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

    let paginationUI = '<div class="pagination-bar">';
    paginationUI += `<button class="page-num" onclick="changeStudyPage(-1)" ${state.studyPage === 0 ? 'disabled' : ''}>«</button>`;
    
    for (let i = 0; i < totalPages; i++) {
        paginationUI += `
            <button class="page-num ${state.studyPage === i ? 'active' : ''}" onclick="goToStudyPage(${i})">
                ${i + 1}
            </button>
        `;
    }
    
    paginationUI += `<button class="page-num" onclick="changeStudyPage(1)" ${end >= questions.length ? 'disabled' : ''}>»</button>`;
    paginationUI += '</div>';

    studyList.innerHTML = `
        <div class="sticky-header">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
                <button class="btn btn-secondary" onclick="state.view = 'dashboard'; renderView();">Volver</button>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <input type="number" id="jump-q-input" class="jump-input" placeholder="Q#">
                    <button class="jump-btn" onclick="jumpToQuestion()">Ir</button>
                </div>
            </div>
            ${paginationUI}
        </div>

        <div class="study-grid" style="display: flex; flex-direction: column; gap: 20px;">
            ${pageQuestions.map(q => `
                <div id="study-q-${q.id}" class="glass-card" style="padding: 24px; text-align: left; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted); display: block; margin-bottom: 4px;">PREGUNTA #${q.id}</span>
                            <h3 style="font-size: 1.15rem;">${q.question}</h3>
                        </div>
                        ${q.priority === 2 ? '<span class="badge badge-double">DOBLE PUNTAJE</span>' : ''}
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

        <div style="margin-top: 30px; padding-bottom: 40px;">
            ${paginationUI}
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
