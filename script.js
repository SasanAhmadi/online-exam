class ExamApp {
    constructor() {
        this.examData = null;
        this.categories = [];
        this.subcategories = [];
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.endTime = null;

        this.initializeElements();
        this.attachEventListeners();
        this.loadExams();
    }

    initializeElements() {
        // Screen elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.questionScreen = document.getElementById('questionScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.examInfo = document.getElementById('examInfo');

        // Welcome screen elements
        this.categorySelect = document.getElementById('examSelect'); // Reusing existing select element

        // Create subcategory container for checkboxes
        this.subcategoryContainer = document.createElement('div');
        this.subcategoryContainer.id = 'subcategoryContainer';
        this.subcategoryContainer.className = 'subcategory-container';
        this.subcategoryContainer.style.display = 'none';

        // Insert subcategory container after category select
        this.categorySelect.parentNode.insertBefore(this.subcategoryContainer, this.categorySelect.nextSibling);

        this.startExamBtn = document.getElementById('startExam');

        // Question screen elements
        this.examTitle = document.getElementById('examTitle');
        this.questionProgress = document.getElementById('questionProgress');
        this.progressFill = document.getElementById('progressFill');
        this.questionNumber = document.getElementById('questionNumber');
        this.questionType = document.getElementById('questionType');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.prevQuestionBtn = document.getElementById('prevQuestion');
        this.nextQuestionBtn = document.getElementById('nextQuestion');
        this.finishExamBtn = document.getElementById('finishExam');
        this.submitExamBtn = document.getElementById('submitExam');

        // Results screen elements
        this.scorePercentage = document.getElementById('scorePercentage');
        this.correctAnswers = document.getElementById('correctAnswers');
        this.totalQuestions = document.getElementById('totalQuestions');
        this.percentageText = document.getElementById('percentageText');
        this.questionReview = document.getElementById('questionReview');
        this.retakeExamBtn = document.getElementById('retakeExam');
        this.backToHomeBtn = document.getElementById('backToHome');
    }

    attachEventListeners() {
        this.categorySelect.addEventListener('change', () => this.onCategorySelected());
        this.startExamBtn.addEventListener('click', () => this.startExam());
        this.prevQuestionBtn.addEventListener('click', () => this.previousQuestion());
        this.nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        this.finishExamBtn.addEventListener('click', () => {
            this.finishExam();
        });
        this.submitExamBtn.addEventListener('click', () => this.submitExam());
        this.retakeExamBtn.addEventListener('click', () => this.retakeExam());
        this.backToHomeBtn.addEventListener('click', () => this.backToHome());
    }

    async loadExams() {
        try {
            // Try to load from multiple possible exam files
            const examFiles = ['exam-data.json', 'exams.json', 'sample-exam.json'];

            for (const file of examFiles) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        const data = await response.json();

                        // Check if it's the new nested categories structure
                        if (data.categories && typeof data.categories === 'object') {
                            this.examData = data;
                            this.processNestedCategoryData();
                            this.populateCategorySelector();
                            return;
                        }
                        // Check if it's the old flat structure with questions array
                        else if (data.questions && Array.isArray(data.questions)) {
                            this.examData = data;
                            this.processQuestionData();
                            this.populateCategorySelector();
                            return;
                        } else {
                            // Handle old format as fallback
                            this.exams = Array.isArray(data) ? data : [data];
                            this.populateExamSelector();
                            return;
                        }
                    }
                } catch (error) {
                    console.log(`Could not load ${file}:`, error.message);
                }
            }

            // If no exam files found, use sample data
            this.loadSampleData();

        } catch (error) {
            console.error('Error loading exams:', error);
            this.loadSampleData();
        }
    }

    processNestedCategoryData() {
        // Extract categories and subcategories from nested structure
        this.categories = Object.keys(this.examData.categories);
        this.subcategoryMap = new Map();

        Object.entries(this.examData.categories).forEach(([category, subcategories]) => {
            this.subcategoryMap.set(category, new Set(Object.keys(subcategories)));
        });
    }

    processQuestionData() {
        // Extract unique categories and subcategories
        const categorySet = new Set();
        const subcategoryMap = new Map();

        this.examData.questions.forEach(question => {
            const category = question.category;
            const subcategory = question.subcategory;

            categorySet.add(category);

            if (!subcategoryMap.has(category)) {
                subcategoryMap.set(category, new Set());
            }
            subcategoryMap.get(category).add(subcategory);
        });

        this.categories = Array.from(categorySet);
        this.subcategoryMap = subcategoryMap;
    }

    loadSampleData() {
        // Sample data for demonstration
        this.exams = [
            {
                title: "JavaScript Fundamentals",
                description: "Basic JavaScript concepts and syntax",
                questions: [
                    {
                        question: "What is the correct way to declare a variable in JavaScript?",
                        answers: [
                            "var myVar = 'hello';",
                            "variable myVar = 'hello';",
                            "v myVar = 'hello';",
                            "declare myVar = 'hello';"
                        ],
                        correctAnswer: 0
                    },
                    {
                        question: "Which of the following is NOT a primitive data type in JavaScript?",
                        answers: [
                            "string",
                            "number",
                            "array",
                            "boolean"
                        ],
                        correctAnswer: 2
                    },
                    {
                        question: "What does '===' operator do in JavaScript?",
                        answers: [
                            "Assigns a value",
                            "Compares values only",
                            "Compares both value and type",
                            "Checks if variable exists"
                        ],
                        correctAnswer: 2
                    }
                ]
            },
            {
                title: "HTML Basics",
                description: "Fundamental HTML concepts",
                questions: [
                    {
                        question: "What does HTML stand for?",
                        answers: [
                            "Hyperlink Text Markup Language",
                            "Hypertext Markup Language",
                            "High-level Text Markup Language",
                            "Hypertext Making Language"
                        ],
                        correctAnswer: 1
                    },
                    {
                        question: "Which HTML tag is used for the largest heading?",
                        answers: [
                            "<heading>",
                            "<h6>",
                            "<h1>",
                            "<header>"
                        ],
                        correctAnswer: 2
                    }
                ]
            }
        ];
        this.populateExamSelector();
    }

    populateCategorySelector() {
        this.categorySelect.innerHTML = '<option value="">-- Select a category --</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categorySelect.appendChild(option);
        });
    }

    populateSubcategorySelector(selectedCategory) {
        this.subcategoryContainer.innerHTML = '';

        if (selectedCategory && this.subcategoryMap.has(selectedCategory)) {
            // Create header
            const header = document.createElement('div');
            header.className = 'subcategory-header';
            header.innerHTML = '<h4>Select subcategories (leave blank for all):</h4>';
            this.subcategoryContainer.appendChild(header);

            // Create checkbox container
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-container';

            const subcategories = Array.from(this.subcategoryMap.get(selectedCategory));
            subcategories.forEach((subcategory, index) => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `subcategory-${index}`;
                checkbox.value = subcategory;
                checkbox.addEventListener('change', () => this.onSubcategorySelectionChanged());

                const label = document.createElement('label');
                label.htmlFor = `subcategory-${index}`;
                label.textContent = subcategory;

                // Count questions for this subcategory
                let questionCount = 0;
                if (this.examData.categories && this.examData.categories[selectedCategory] && this.examData.categories[selectedCategory][subcategory]) {
                    questionCount = this.examData.categories[selectedCategory][subcategory].length;
                } else if (this.examData.questions) {
                    // Fallback for old structure
                    questionCount = this.examData.questions.filter(q =>
                        q.category === selectedCategory && q.subcategory === subcategory
                    ).length;
                }

                const countSpan = document.createElement('span');
                countSpan.className = 'question-count';
                countSpan.textContent = ` (${questionCount} questions)`;
                label.appendChild(countSpan);

                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                checkboxContainer.appendChild(checkboxDiv);
            });

            this.subcategoryContainer.appendChild(checkboxContainer);
            this.subcategoryContainer.style.display = 'block';
        } else {
            this.subcategoryContainer.style.display = 'none';
        }
    }

    onSubcategorySelectionChanged() {
        // Enable start button whenever a category is selected (subcategories are optional)
        this.startExamBtn.disabled = this.categorySelect.value === '';
    }

    populateExamSelector() {
        // This function is for backward compatibility with old exam format
        this.categorySelect.innerHTML = '<option value="">-- Select an exam --</option>';

        if (this.exams && this.exams.length > 0) {
            this.exams.forEach((exam, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${exam.title} (${exam.questions.length} questions)`;
                this.categorySelect.appendChild(option);
            });
        }
    }

    onExamSelected() {
        // This function is for backward compatibility with old exam format
        this.startExamBtn.disabled = this.categorySelect.value === '';
    }

    onCategorySelected() {
        const selectedCategory = this.categorySelect.value;
        this.populateSubcategorySelector(selectedCategory);
        this.startExamBtn.disabled = selectedCategory === '';
    }

    getSelectedSubcategories() {
        const checkboxes = this.subcategoryContainer.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }

    startExam() {
        // Check if we have nested categories structure
        if (this.examData && this.examData.categories) {
            // New nested category/subcategory structure
            const selectedCategory = this.categorySelect.value;

            if (!selectedCategory) {
                alert('Please select a category.');
                return;
            }

            const selectedSubcategories = this.getSelectedSubcategories();
            let filteredQuestions = [];
            let examTitle;

            if (selectedSubcategories.length === 0) {
                // No subcategories selected - use all questions from the category
                Object.values(this.examData.categories[selectedCategory]).forEach(subcategoryQuestions => {
                    filteredQuestions = filteredQuestions.concat(subcategoryQuestions);
                });
                examTitle = `${selectedCategory} - All Topics`;
            } else {
                // Filter by selected subcategories
                selectedSubcategories.forEach(subcategory => {
                    if (this.examData.categories[selectedCategory][subcategory]) {
                        filteredQuestions = filteredQuestions.concat(
                            this.examData.categories[selectedCategory][subcategory]
                        );
                    }
                });

                if (selectedSubcategories.length === 1) {
                    examTitle = `${selectedCategory} - ${selectedSubcategories[0]}`;
                } else {
                    examTitle = `${selectedCategory} - ${selectedSubcategories.length} Topics`;
                }
            }

            if (filteredQuestions.length === 0) {
                alert('No questions found for the selected criteria.');
                return;
            }

            // Create a virtual exam object
            this.currentExam = {
                title: examTitle,
                description: selectedSubcategories.length === 0
                    ? `All questions from ${selectedCategory}`
                    : `Questions from selected topics in ${selectedCategory}`,
                questions: filteredQuestions
            };
        }
        // Check for old flat structure with questions array
        else if (this.examData && this.examData.questions) {
            // Old category/subcategory based selection
            const selectedCategory = this.categorySelect.value;

            if (!selectedCategory) {
                alert('Please select a category.');
                return;
            }

            const selectedSubcategories = this.getSelectedSubcategories();
            let filteredQuestions;
            let examTitle;

            if (selectedSubcategories.length === 0) {
                // No subcategories selected - use all questions from the category
                filteredQuestions = this.examData.questions.filter(question =>
                    question.category === selectedCategory
                );
                examTitle = `${selectedCategory} - All Topics`;
            } else {
                // Filter by selected subcategories
                filteredQuestions = this.examData.questions.filter(question =>
                    question.category === selectedCategory &&
                    selectedSubcategories.includes(question.subcategory)
                );

                if (selectedSubcategories.length === 1) {
                    examTitle = `${selectedCategory} - ${selectedSubcategories[0]}`;
                } else {
                    examTitle = `${selectedCategory} - ${selectedSubcategories.length} Topics`;
                }
            }

            if (filteredQuestions.length === 0) {
                alert('No questions found for the selected criteria.');
                return;
            }

            // Create a virtual exam object
            this.currentExam = {
                title: examTitle,
                description: selectedSubcategories.length === 0
                    ? `All questions from ${selectedCategory}`
                    : `Questions from selected topics in ${selectedCategory}`,
                questions: filteredQuestions
            };
        } else {
            // Old exam-based selection (fallback)
            const examIndex = parseInt(this.categorySelect.value);
            if (examIndex >= 0 && examIndex < this.exams.length) {
                this.currentExam = this.exams[examIndex];
            } else {
                alert('Please select a valid exam.');
                return;
            }
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentExam.questions.length).fill(null);
        this.startTime = new Date();

        // Create shuffled versions of questions with answer mapping
        this.shuffledQuestions = this.currentExam.questions.map(question => {
            return this.shuffleAnswers(question);
        });

        this.showScreen('question');
        this.updateExamInfo();
        this.displayQuestion();
    }

    shuffleAnswers(originalQuestion) {
        // Create a copy of the question
        const shuffledQuestion = { ...originalQuestion };

        // Create array of answer objects with original indices
        const answerObjects = originalQuestion.answers.map((answer, index) => ({
            text: answer,
            originalIndex: index
        }));

        // Shuffle the answer objects using Fisher-Yates algorithm
        for (let i = answerObjects.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answerObjects[i], answerObjects[j]] = [answerObjects[j], answerObjects[i]];
        }

        // Extract shuffled answers and create mapping
        shuffledQuestion.answers = answerObjects.map(obj => obj.text);
        shuffledQuestion.answerMapping = answerObjects.map(obj => obj.originalIndex);

        // Find new position of correct answer
        shuffledQuestion.correctAnswer = answerObjects.findIndex(
            obj => obj.originalIndex === originalQuestion.correctAnswer
        );

        return shuffledQuestion;
    }    showScreen(screenName) {
        this.welcomeScreen.style.display = screenName === 'welcome' ? 'block' : 'none';
        this.questionScreen.style.display = screenName === 'question' ? 'block' : 'none';
        this.resultsScreen.style.display = screenName === 'results' ? 'block' : 'none';
        this.examInfo.style.display = screenName === 'question' ? 'block' : 'none';
    }

    updateExamInfo() {
        this.examTitle.textContent = this.currentExam.title;
        this.updateProgress();
    }

    updateProgress() {
        const current = this.currentQuestionIndex + 1;
        const total = this.currentExam.questions.length;
        const percentage = (current / total) * 100;

        this.questionProgress.textContent = `Question ${current} of ${total}`;
        this.progressFill.style.width = `${percentage}%`;
    }

    displayQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];

        this.questionNumber.textContent = `Question ${this.currentQuestionIndex + 1}`;
        this.questionText.textContent = question.question;

        // Clear previous answers
        this.answersContainer.innerHTML = '';

        // Create answer options using shuffled answers
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.value = index;
            radio.id = `answer${index}`;

            // Check if this answer was previously selected
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                radio.checked = true;
                answerDiv.classList.add('selected');
            }

            const label = document.createElement('label');
            label.htmlFor = `answer${index}`;
            label.className = 'answer-text';
            label.textContent = answer;

            answerDiv.appendChild(radio);
            answerDiv.appendChild(label);

            // Add click event
            answerDiv.addEventListener('click', () => this.selectAnswer(index));
            radio.addEventListener('change', () => this.selectAnswer(index));

            this.answersContainer.appendChild(answerDiv);
        });

        this.updateNavigationButtons();
    }    selectAnswer(answerIndex) {
        // Update user answers
        this.userAnswers[this.currentQuestionIndex] = answerIndex;

        // Update UI
        const answerOptions = this.answersContainer.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"]');
            if (index === answerIndex) {
                radio.checked = true;
                option.classList.add('selected');
            } else {
                radio.checked = false;
                option.classList.remove('selected');
            }
        });

        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== null;
        const isFirstQuestion = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentExam.questions.length - 1;
        const hasAnsweredAtLeastOne = this.userAnswers.some(answer => answer !== null);

        this.prevQuestionBtn.style.display = isFirstQuestion ? 'none' : 'inline-block';
        this.nextQuestionBtn.disabled = !hasAnswer;

        // Show finish exam button if user has answered at least one question and it's not the last question
        this.finishExamBtn.style.display = (hasAnsweredAtLeastOne && !isLastQuestion) ? 'inline-block' : 'none';

        if (isLastQuestion) {
            this.nextQuestionBtn.style.display = 'none';
            this.submitExamBtn.style.display = 'inline-block';
            this.submitExamBtn.disabled = !this.allQuestionsAnswered();
        } else {
            this.nextQuestionBtn.style.display = 'inline-block';
            this.submitExamBtn.style.display = 'none';
        }
    }

    allQuestionsAnswered() {
        return this.userAnswers.every(answer => answer !== null);
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateProgress();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateProgress();
        }
    }

    finishExam() {
        const answeredCount = this.userAnswers.filter(answer => answer !== null).length;
        const totalCount = this.currentExam.questions.length;

        const confirmMessage = `You have answered ${answeredCount} out of ${totalCount} questions.\n\nAre you sure you want to finish the exam now? Unanswered questions will be marked as incorrect.`;

        if (confirm(confirmMessage)) {
            this.endTime = new Date();
            this.calculateResults();
            this.showResults();
        }
    }

    submitExam() {
        if (!this.allQuestionsAnswered()) {
            alert('Please answer all questions before submitting the exam.');
            return;
        }

        this.endTime = new Date();
        this.calculateResults();
        this.showResults();
    }

    calculateResults() {
        let correctCount = 0;

        this.shuffledQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        this.results = {
            correct: correctCount,
            total: this.currentExam.questions.length,
            percentage: Math.round((correctCount / this.currentExam.questions.length) * 100),
            duration: this.endTime - this.startTime
        };
    }    showResults() {
        this.showScreen('results');

        // Update score display
        this.scorePercentage.textContent = `${this.results.percentage}%`;
        this.correctAnswers.textContent = this.results.correct;
        this.totalQuestions.textContent = this.results.total;
        this.percentageText.textContent = `${this.results.percentage}%`;

        // Update score circle color based on performance
        const scoreCircle = document.querySelector('.score-circle');
        if (this.results.percentage >= 80) {
            scoreCircle.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        } else if (this.results.percentage >= 60) {
            scoreCircle.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
        }

        // Show question review
        this.displayQuestionReview();
    }

    displayQuestionReview() {
        this.questionReview.innerHTML = '<h3 style="margin-bottom: 20px; color: #2d3748;">Question Review</h3>';

        this.currentExam.questions.forEach((originalQuestion, index) => {
            const shuffledQuestion = this.shuffledQuestions[index];
            const userAnswerIndex = this.userAnswers[index];

            // Map user's selected shuffled answer back to original answer
            const originalUserAnswerIndex = userAnswerIndex !== null ? shuffledQuestion.answerMapping[userAnswerIndex] : null;

            const reviewDiv = document.createElement('div');
            reviewDiv.className = `review-question ${userAnswerIndex === shuffledQuestion.correctAnswer ? 'correct' : 'incorrect'}`;

            const questionText = document.createElement('div');
            questionText.className = 'review-question-text';
            questionText.textContent = `${index + 1}. ${originalQuestion.question}`;

            const yourAnswer = document.createElement('div');
            yourAnswer.className = `review-answer your-answer ${userAnswerIndex === shuffledQuestion.correctAnswer ? '' : 'your-incorrect'}`;
            if (originalUserAnswerIndex !== null) {
                yourAnswer.innerHTML = `<strong>Your answer:</strong> ${originalQuestion.answers[originalUserAnswerIndex]}`;
            } else {
                yourAnswer.innerHTML = `<strong>Your answer:</strong> No answer selected`;
            }

            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'review-answer correct-answer';
            correctAnswer.innerHTML = `<strong>Correct answer:</strong> ${originalQuestion.answers[originalQuestion.correctAnswer]}`;

            // Add explanation if available
            const explanation = document.createElement('div');
            explanation.className = 'review-explanation';
            if (originalQuestion.explanation) {
                explanation.innerHTML = `<strong>Explanation:</strong> ${originalQuestion.explanation}`;
            }

            reviewDiv.appendChild(questionText);
            reviewDiv.appendChild(yourAnswer);

            if (userAnswerIndex !== shuffledQuestion.correctAnswer) {
                reviewDiv.appendChild(correctAnswer);
            }

            // Always show explanation if available
            if (originalQuestion.explanation) {
                reviewDiv.appendChild(explanation);
            }

            this.questionReview.appendChild(reviewDiv);
        });
    }

    retakeExam() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentExam.questions.length).fill(null);
        this.startTime = new Date();

        // Create new shuffled versions for retake
        this.shuffledQuestions = this.currentExam.questions.map(question => {
            return this.shuffleAnswers(question);
        });

        this.showScreen('question');
        this.updateExamInfo();
        this.displayQuestion();
    }    backToHome() {
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.categorySelect.value = '';

        // Reset subcategory checkboxes
        const checkboxes = this.subcategoryContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        this.subcategoryContainer.style.display = 'none';

        this.startExamBtn.disabled = true;

        this.showScreen('welcome');
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ExamApp();
});