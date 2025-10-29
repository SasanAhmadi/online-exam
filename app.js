// Online Exam System - Main Application
class ExamSystem {
    constructor() {
        this.availableExams = [
            { file: 'exams/javascript-basics.json', id: 'js-basics' },
            { file: 'exams/html-css.json', id: 'html-css' },
            { file: 'exams/python-basics.json', id: 'python-basics' }
        ];
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.timerInterval = null;
        this.timeRemaining = 0;
        
        this.init();
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    init() {
        this.loadExamList();
        this.attachEventListeners();
    }
    
    async loadExamList() {
        const examListContainer = document.getElementById('exam-list');
        examListContainer.innerHTML = '';
        
        for (const examInfo of this.availableExams) {
            try {
                const response = await fetch(examInfo.file);
                const exam = await response.json();
                
                const examCard = document.createElement('div');
                examCard.className = 'exam-card';
                examCard.innerHTML = `
                    <h3>${exam.title}</h3>
                    <p>${exam.description}</p>
                    <p><strong>Questions:</strong> ${exam.questions.length} | <strong>Duration:</strong> ${exam.duration} minutes</p>
                `;
                examCard.addEventListener('click', () => this.showExamIntro(exam));
                examListContainer.appendChild(examCard);
            } catch (error) {
                console.error(`Error loading exam ${examInfo.file}:`, error);
            }
        }
    }
    
    showExamIntro(exam) {
        this.currentExam = exam;
        
        document.getElementById('exam-selection').classList.add('hidden');
        document.getElementById('exam-intro').classList.remove('hidden');
        
        document.getElementById('exam-title').textContent = exam.title;
        document.getElementById('exam-description').textContent = exam.description;
        document.getElementById('total-questions').textContent = exam.questions.length;
        document.getElementById('exam-duration').textContent = exam.duration;
    }
    
    startExam() {
        if (!this.currentExam) return;
        
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.timeRemaining = this.currentExam.duration * 60; // Convert to seconds
        
        document.getElementById('exam-intro').classList.add('hidden');
        document.getElementById('exam-container').classList.remove('hidden');
        
        document.getElementById('exam-name').textContent = this.currentExam.title;
        
        this.displayQuestion();
        this.startTimer();
        this.updateProgress();
    }
    
    displayQuestion() {
        const question = this.currentExam.questions[this.currentQuestionIndex];
        const container = document.getElementById('questions-container');
        
        container.innerHTML = `
            <div class="question">
                <h3>Question ${this.currentQuestionIndex + 1} of ${this.currentExam.questions.length}</h3>
                <p><strong>${this.escapeHtml(question.question)}</strong></p>
                <ul class="options">
                    ${question.options.map((option, index) => `
                        <li class="option ${this.userAnswers[question.id] === index ? 'selected' : ''}" 
                            onclick="examSystem.selectAnswer(${question.id}, ${index})">
                            <input type="radio" name="question-${question.id}" 
                                   id="option-${index}" 
                                   value="${index}"
                                   ${this.userAnswers[question.id] === index ? 'checked' : ''}>
                            <label for="option-${index}">${this.escapeHtml(option)}</label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        this.updateNavigationButtons();
    }
    
    selectAnswer(questionId, answerIndex) {
        this.userAnswers[questionId] = answerIndex;
        this.displayQuestion(); // Re-render to show selection
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.currentExam.questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateProgress();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentExam.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.submitExam();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeRemaining <= 60) {
            timerElement.classList.add('warning');
        }
    }
    
    submitExam() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const results = this.calculateResults();
        this.displayResults(results);
    }
    
    calculateResults() {
        let correctAnswers = 0;
        const details = [];
        
        this.currentExam.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            if (isCorrect) {
                correctAnswers++;
            }
            
            details.push({
                question: question.question,
                userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
                correctAnswer: question.options[question.correctAnswer],
                isCorrect: isCorrect
            });
        });
        
        const totalQuestions = this.currentExam.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        return {
            correctAnswers,
            totalQuestions,
            percentage,
            details
        };
    }
    
    displayResults(results) {
        document.getElementById('exam-container').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
        
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.innerHTML = `
            <h3>Your Score</h3>
            <p>${results.percentage}%</p>
            <p style="font-size: 1.2em;">${results.correctAnswers} out of ${results.totalQuestions} correct</p>
        `;
        
        const answersReview = document.getElementById('answers-review');
        answersReview.innerHTML = '<h3>Answer Review</h3>';
        
        results.details.forEach((detail, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = `answer-review ${detail.isCorrect ? 'correct' : 'incorrect'}`;
            reviewCard.innerHTML = `
                <h4>Question ${index + 1}: ${this.escapeHtml(detail.question)}</h4>
                <p><strong>Your Answer:</strong> <span class="${detail.isCorrect ? 'correct-answer' : 'your-answer'}">${this.escapeHtml(detail.userAnswer)}</span></p>
                ${!detail.isCorrect ? `<p><strong>Correct Answer:</strong> <span class="correct-answer">${this.escapeHtml(detail.correctAnswer)}</span></p>` : ''}
            `;
            answersReview.appendChild(reviewCard);
        });
    }
    
    restart() {
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        document.getElementById('results-container').classList.add('hidden');
        document.getElementById('exam-selection').classList.remove('hidden');
    }
    
    backToSelection() {
        document.getElementById('exam-intro').classList.add('hidden');
        document.getElementById('exam-selection').classList.remove('hidden');
        this.currentExam = null;
    }
    
    attachEventListeners() {
        document.getElementById('start-exam-btn').addEventListener('click', () => this.startExam());
        document.getElementById('back-to-selection-btn').addEventListener('click', () => this.backToSelection());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submit-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to submit the exam?')) {
                this.submitExam();
            }
        });
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }
}

// Initialize the exam system when the page loads
let examSystem;
document.addEventListener('DOMContentLoaded', () => {
    examSystem = new ExamSystem();
});
