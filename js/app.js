'use strict';

/**
 * BIC Entrance Exam Portal
 * Manages the flow: Registration -> Training -> Quiz -> Results
 */

const App = (function () {
    // Quiz questions bank
    const QUESTIONS = [
        {
            id: 1,
            text: 'What does the "C" in the CIA Triad stand for?',
            options: [
                'Compliance',
                'Confidentiality',
                'Continuity',
                'Communication'
            ],
            correct: 1
        },
        {
            id: 2,
            text: 'What should you do if you suspect a data breach?',
            options: [
                'Try to fix it yourself before telling anyone',
                'Delete the affected data immediately',
                'Notify your supervisor and security team within 30 minutes',
                'Wait until end of day to report it'
            ],
            correct: 2
        },
        {
            id: 3,
            text: 'Which of the following is considered Personally Identifiable Information (PII)?',
            options: [
                'Company annual report',
                'Public press release',
                'Client policy number and date of birth',
                'Office floor plan'
            ],
            correct: 2
        },
        {
            id: 4,
            text: 'What is the correct action when stepping away from your workstation?',
            options: [
                'Leave it as is if you will return shortly',
                'Lock your screen (Win+L) every time',
                'Close your email only',
                'Turn off the monitor'
            ],
            correct: 1
        },
        {
            id: 5,
            text: 'Where should client data be stored?',
            options: [
                'On your local hard drive for quick access',
                'In personal cloud storage (Google Drive, Dropbox)',
                'Only in approved, encrypted repositories',
                'On a USB drive for backup'
            ],
            correct: 2
        },
        {
            id: 6,
            text: 'What is prohibited on your work laptop?',
            options: [
                'Accessing approved BIC applications',
                'Installing updates from the corporate portal',
                'Streaming personal videos or accessing social media',
                'Using the corporate VPN'
            ],
            correct: 2
        },
        {
            id: 7,
            text: 'When is it acceptable to bypass MFA/2FA authentication?',
            options: [
                'When you are in a hurry for a meeting',
                'When the system is running slowly',
                'Never — MFA must never be bypassed',
                'When your supervisor asks you to'
            ],
            correct: 2
        },
        {
            id: 8,
            text: 'Which regulation specifically protects health information in insurance contexts?',
            options: [
                'SOC 2',
                'PCI-DSS',
                'HIPAA',
                'GDPR'
            ],
            correct: 2
        },
        {
            id: 9,
            text: 'What should you do if someone asks you to discuss client work outside the project team?',
            options: [
                'Share general details without naming the client',
                'Decline and explain you are contractually obligated to maintain confidentiality',
                'Share only if they sign an NDA',
                'Refer them to a public case study'
            ],
            correct: 1
        },
        {
            id: 10,
            text: 'What is the minimum passing score for this entrance exam?',
            options: [
                '60%',
                '70%',
                '80%',
                '90%'
            ],
            correct: 2
        }
    ];

    const PASSING_SCORE = 80;
    const TOTAL_MODULES = 5;

    // State
    let completedModules = new Set();
    let employeeData = null;

    // DOM References
    const sections = {
        registration: document.getElementById('section-registration'),
        training: document.getElementById('section-training'),
        quiz: document.getElementById('section-quiz'),
        results: document.getElementById('section-results')
    };

    const stepIndicators = {
        1: document.getElementById('step-indicator-1'),
        2: document.getElementById('step-indicator-2'),
        3: document.getElementById('step-indicator-3'),
        4: document.getElementById('step-indicator-4')
    };

    function init() {
        setupRegistration();
        setupTrainingModules();
        setupQuiz();
    }

    // --- Step Navigation ---
    function showSection(sectionKey) {
        Object.values(sections).forEach(function (s) {
            s.classList.add('hidden');
        });
        sections[sectionKey].classList.remove('hidden');

        var stepMap = { registration: 1, training: 2, quiz: 3, results: 4 };
        var currentStep = stepMap[sectionKey];

        Object.keys(stepIndicators).forEach(function (key) {
            var indicator = stepIndicators[key];
            indicator.classList.remove('active', 'completed');
            if (parseInt(key) < currentStep) {
                indicator.classList.add('completed');
            } else if (parseInt(key) === currentStep) {
                indicator.classList.add('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Registration ---
    function setupRegistration() {
        var form = document.getElementById('registration-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('employee-name').value.trim();
            var id = document.getElementById('employee-id').value.trim();
            var email = document.getElementById('employee-email').value.trim();
            var department = document.getElementById('employee-department').value;

            if (!name || !id || !email || !department) {
                return;
            }

            employeeData = {
                name: name,
                id: id,
                email: email,
                department: department
            };

            showSection('training');
        });
    }

    // --- Training Modules ---
    function setupTrainingModules() {
        var modules = document.querySelectorAll('.module');

        modules.forEach(function (module) {
            var header = module.querySelector('.module-header');
            var content = module.querySelector('.module-content');
            var completeBtn = module.querySelector('.btn-complete');
            var moduleId = parseInt(module.dataset.module);

            header.addEventListener('click', function () {
                var isExpanded = content.classList.contains('expanded');
                // Collapse all first
                document.querySelectorAll('.module-content').forEach(function (c) {
                    c.classList.remove('expanded');
                });
                document.querySelectorAll('.module-header').forEach(function (h) {
                    h.setAttribute('aria-expanded', 'false');
                });

                if (!isExpanded) {
                    content.classList.add('expanded');
                    header.setAttribute('aria-expanded', 'true');
                }
            });

            completeBtn.addEventListener('click', function () {
                markModuleComplete(moduleId, module);
            });
        });
    }

    function markModuleComplete(moduleId, moduleEl) {
        if (completedModules.has(moduleId)) return;

        completedModules.add(moduleId);
        moduleEl.classList.add('completed');
        moduleEl.querySelector('.module-status').textContent = 'Completed';
        moduleEl.querySelector('.btn-complete').disabled = true;
        moduleEl.querySelector('.btn-complete').textContent = 'Completed';

        // Collapse the module
        moduleEl.querySelector('.module-content').classList.remove('expanded');
        moduleEl.querySelector('.module-header').setAttribute('aria-expanded', 'false');

        updateTrainingProgress();
    }

    function updateTrainingProgress() {
        var count = completedModules.size;
        var percentage = (count / TOTAL_MODULES) * 100;

        document.getElementById('training-progress-fill').style.width = percentage + '%';
        document.getElementById('training-progress-text').textContent =
            count + ' of ' + TOTAL_MODULES + ' modules completed';

        var startQuizBtn = document.getElementById('start-quiz-btn');
        var trainingNote = document.getElementById('training-note');

        if (count === TOTAL_MODULES) {
            startQuizBtn.disabled = false;
            trainingNote.textContent = 'All modules completed! You may now start the quiz.';
            trainingNote.style.color = 'var(--color-success)';
            trainingNote.style.fontStyle = 'normal';
            trainingNote.style.fontWeight = '600';

            startQuizBtn.addEventListener('click', function () {
                showSection('quiz');
            });
        }
    }

    // --- Quiz ---
    function setupQuiz() {
        renderQuizQuestions();

        var form = document.getElementById('quiz-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitQuiz();
        });

        // Track answered questions
        document.getElementById('quiz-questions').addEventListener('change', function () {
            updateAnsweredCount();
        });
    }

    function renderQuizQuestions() {
        var container = document.getElementById('quiz-questions');
        var html = '';

        QUESTIONS.forEach(function (q, index) {
            html += '<div class="quiz-question" data-question="' + q.id + '">';
            html += '<p class="quiz-question-text">';
            html += '<span class="quiz-question-number">Q' + (index + 1) + '.</span>';
            html += q.text;
            html += '</p>';
            html += '<div class="quiz-options">';

            q.options.forEach(function (option, optIndex) {
                var inputId = 'q' + q.id + '-opt' + optIndex;
                html += '<div class="quiz-option">';
                html += '<input type="radio" id="' + inputId + '" name="question-' + q.id + '" value="' + optIndex + '">';
                html += '<label for="' + inputId + '">' + option + '</label>';
                html += '</div>';
            });

            html += '</div>';
            html += '</div>';
        });

        container.innerHTML = html;
    }

    function updateAnsweredCount() {
        var answered = 0;
        QUESTIONS.forEach(function (q) {
            var selected = document.querySelector('input[name="question-' + q.id + '"]:checked');
            if (selected) answered++;
        });

        document.getElementById('quiz-answered').textContent =
            answered + ' of ' + QUESTIONS.length + ' answered';

        // Hide validation message if all answered
        if (answered === QUESTIONS.length) {
            document.getElementById('quiz-validation-message').classList.add('hidden');
        }
    }

    function submitQuiz() {
        var allAnswered = true;
        var unansweredQuestions = [];

        QUESTIONS.forEach(function (q) {
            var selected = document.querySelector('input[name="question-' + q.id + '"]:checked');
            var questionEl = document.querySelector('.quiz-question[data-question="' + q.id + '"]');

            if (!selected) {
                allAnswered = false;
                unansweredQuestions.push(q.id);
                questionEl.classList.add('unanswered');
            } else {
                questionEl.classList.remove('unanswered');
            }
        });

        if (!allAnswered) {
            document.getElementById('quiz-validation-message').classList.remove('hidden');
            // Scroll to first unanswered
            var firstUnanswered = document.querySelector('.quiz-question.unanswered');
            if (firstUnanswered) {
                firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Calculate score
        var correctCount = 0;
        QUESTIONS.forEach(function (q) {
            var selected = document.querySelector('input[name="question-' + q.id + '"]:checked');
            if (parseInt(selected.value) === q.correct) {
                correctCount++;
            }
        });

        var score = Math.round((correctCount / QUESTIONS.length) * 100);
        showResults(score, correctCount);
    }

    // --- Results ---
    function showResults(score, correctCount) {
        var passed = score >= PASSING_SCORE;
        var container = document.getElementById('results-content');
        var now = new Date();
        var dateStr = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        var html = '';

        if (passed) {
            html += '<div class="results-pass">';
            html += '<div class="results-icon">&#x2705;</div>';
            html += '<h2 class="results-title">Congratulations! You Passed!</h2>';
            html += '<div class="results-score">' + score + '%</div>';
            html += '<p class="results-message">';
            html += 'You have successfully completed the BIC Entrance Exam. ';
            html += 'You scored ' + correctCount + ' out of ' + QUESTIONS.length + ' questions correctly. ';
            html += 'You are now cleared to begin working on client systems.';
            html += '</p>';
            html += '<div class="results-details">';
            html += '<h3>Completion Certificate</h3>';
            html += '<p><strong>Employee:</strong> ' + employeeData.name + '</p>';
            html += '<p><strong>Employee ID:</strong> ' + employeeData.id + '</p>';
            html += '<p><strong>Department:</strong> ' + employeeData.department + '</p>';
            html += '<p><strong>Score:</strong> ' + score + '% (' + correctCount + '/' + QUESTIONS.length + ')</p>';
            html += '<p><strong>Date Completed:</strong> ' + dateStr + '</p>';
            html += '<p><strong>Status:</strong> PASSED</p>';
            html += '</div>';
            html += '</div>';
        } else {
            html += '<div class="results-fail">';
            html += '<div class="results-icon">&#x274C;</div>';
            html += '<h2 class="results-title">Not Passed</h2>';
            html += '<div class="results-score">' + score + '%</div>';
            html += '<p class="results-message">';
            html += 'You scored ' + correctCount + ' out of ' + QUESTIONS.length + ' questions correctly. ';
            html += 'A minimum score of ' + PASSING_SCORE + '% is required to pass. ';
            html += 'Please review the training material and try again.';
            html += '</p>';
            html += '<button class="btn btn-retry" id="retry-quiz-btn">Review Training & Retry</button>';
            html += '</div>';
        }

        container.innerHTML = html;
        showSection('results');

        if (!passed) {
            document.getElementById('retry-quiz-btn').addEventListener('click', function () {
                resetQuiz();
                showSection('training');
            });
        }
    }

    function resetQuiz() {
        // Reset radio buttons
        var radios = document.querySelectorAll('#quiz-form input[type="radio"]');
        radios.forEach(function (r) { r.checked = false; });

        // Reset validation state
        document.querySelectorAll('.quiz-question').forEach(function (q) {
            q.classList.remove('unanswered');
        });
        document.getElementById('quiz-validation-message').classList.add('hidden');
        document.getElementById('quiz-answered').textContent = '0 of ' + QUESTIONS.length + ' answered';
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

    return { init: init };
})();
