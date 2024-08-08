/*************************************************************
results.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

if (!JSON.parse(window.localStorage.getItem('quizSelected'))) {
    window.location.href = 'index.html';
}

let selectedQuizIndex = JSON.parse(window.localStorage.getItem('selectedQuizIndex'));
const quizzes = JSON.parse(window.localStorage.getItem('quizzes'));
const quizTime = JSON.parse(window.localStorage.getItem('quizTime'));
console.log(quizTime);
const quiz = quizzes[ selectedQuizIndex ];
const quizLength = quiz.questions.length;

// Error-messages
const EMPTY_FIELD = 'Field cannot be empty';
const INVALID_NAME = 'Name is invalid, can only contain letters';
const INVALID_EMAIL = 'Invalid email format';

const visitorInformationForm = document.getElementById('visitor-information-form');
const visitorInformationSectionElement = document.getElementById('visitor-information-section');
const resultsSectionElement = document.getElementById('results-section');
const emailInputElement = document.getElementById('email');
const inputElements = document.querySelectorAll('input');

const quizNameTextElement = document.querySelector('[data-quiz-name]');
quizNameTextElement.innerText = quiz.name;

visitorInformationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let inputIsValid = validateInput();

    if (inputIsValid) {
        visitorInformationSectionElement.classList.add('hidden');
        resultsSectionElement.classList.remove('hidden');
    }
});

inputElements.forEach( element => {
    element.addEventListener('input', () => {
        const inputFeedbackMessageElement = element.parentElement.querySelector('.input-feedback-message');
        inputFeedbackMessageElement.classList.add('hidden');
        inputFeedbackMessageElement.innerHTML = '';
    })
});

function emailIsValid(email) {
    return  email.value.length > 2 && email.value.includes('@') && email.value.includes('.');
}

function validateInput() {
    let validInput = true;

    inputElements.forEach( element => {
        const inputFeedbackMessageElement = element.parentElement.querySelector('.input-feedback-message');
        const validNameFormat = /^[A-Za-z]+$/;
        
        if (element.value === '') {
            displayErrorMessage(inputFeedbackMessageElement, EMPTY_FIELD);
            validInput = false;
        } 

        else if (element !== emailInputElement && !validNameFormat.test(element.value)) {
            displayErrorMessage(inputFeedbackMessageElement, INVALID_NAME);
            validInput = false;
        }

        else if (element === emailInputElement && !emailIsValid(element)) {
            displayErrorMessage(inputFeedbackMessageElement, INVALID_EMAIL);
            validInput = false;
        }

        else {
            inputFeedbackMessageElement.classList.remove('incorrect');
            inputFeedbackMessageElement.classList.remove('hidden');
            inputFeedbackMessageElement.classList.add('correct');
            inputFeedbackMessageElement.innerHTML = 
            `<span class="material-symbols-outlined">
            check_circle</span> Input is valid`;
        }
    });

    return validInput;
}

// Display quiz-results 
const quizResults = JSON.parse(window.localStorage.getItem('quizResults'));
const quizScoreTextElement = document.querySelector('[data-quiz-score]');
const quizTimeTextElement = document.querySelector('[data-quiz-time]');
const questionResultsListElement = document.getElementById('question-results-list');
const returnButton = document.getElementById('return-button');

displayResults();

const liElements = document.querySelectorAll('.question-result-li');

for (const liElement of liElements) {
    liElement.addEventListener('click', () => {
        const expandMoreIcon = liElement.querySelector('.expand-more-icon');
        const expandLessIcon = liElement.querySelector('.expand-less-icon');
        const questionInfoElement = liElement.querySelector('.question-info-section');

        expandMoreIcon.classList.toggle('active');
        expandLessIcon.classList.toggle('active');
        questionInfoElement.classList.toggle('active');
    });
}

returnButton.addEventListener('click', () => {
    window.localStorage.setItem('selectedQuizIndex', 'undefined');
    window.localStorage.setItem('quizSelected', 'false');
    window.localStorage.setItem('quizResults', 'undefined');
    window.localStorage.setItem('quizTime', 'undefined');
    window.location.href = 'index.html';
});

function getNumberOfCorrectQuestions() {
    let numberOfCorrectQuestions = 0;

    for (let i = 0; i < quizResults.length; i++) {
        if (quizResults[i])
            numberOfCorrectQuestions++;
    }

    return numberOfCorrectQuestions;
}

function displayResults() {
    const time = new Date(quizTime);
    quizScoreTextElement.innerText = `${getNumberOfCorrectQuestions()} out of ${quizLength}`;
    
    if (time.getMinutes() < 1) {
        quizTimeTextElement.innerText = `${time.getSeconds()} seconds`;
    } else {
        quizTimeTextElement.innerText = `${time.getMinutes()} mins and ${time.getSeconds()} secs`;
    }
    
    for (let i = 0; i < quizResults.length; i++) {
        questionResultsListElement.innerHTML += createQuestionResultElement(quiz.questions[i], i);
    }
}

function createQuestionResultElement(question, index) {
    const questionCorrectText = quizResults[index] ? 'Correct' : 'Incorrect';
    const questionIsCorrect = quizResults[index] ? true : false;
    let symbolSpanContent = '';

    if (questionIsCorrect) {
        symbolSpanContent = 
            '<span class="material-symbols-outlined correct">check_circle</span>';
    } else {
        symbolSpanContent = 
            '<span class="material-symbols-outlined incorrect-symbol incorrect">close</span>'; 
    }

    const questionResultLiElement = `
        <li class="question-result-li">
            <section class="upper-question-data-section">
                <h4 data-question-number>Question ${index + 1}</h4>
                <div class="question-result">
                    <span data-question-correct>${questionCorrectText}</span>
                    ${symbolSpanContent}
                    <button class="expand-button">
                        <span class="material-symbols-outlined  expand-symbol expand-more-icon">
                            expand_more
                        </span>
                        <span class="material-symbols-outlined expand-symbol expand-less-icon">
                            expand_less
                        </span>
                    </button>
                </div>
            </section>
            <section class="question-info-section">
                <h5 data-question-text>${question.questionText}</h5>
                <h6>Correct answer(s):</h6>
                <ul class="correct-answers-list">
                    ${getCorrectAnswersListElement(question)}
                </ul>
            </section>
        </li>`;

    return questionResultLiElement;
}

function getCorrectAnswersListElement(question) {
    let correctAnswers = [];

    for (const answer of question.answers) {
        if (answer.correct) 
            correctAnswers.push(answer);
    }

    let correctAnswersListTextElement = '';

    for (const correctAnswer of correctAnswers) {
        correctAnswersListTextElement += 
        `<li data-correct-answer>
        ${correctAnswer.answerText}</li>`;
    }

    return correctAnswersListTextElement;
}

function displayErrorMessage(element, errorMessage) {
    element.classList.remove('correct');
    element.classList.remove('hidden');
    element.classList.add('incorrect');
    element.innerHTML = 
    `<span class="material-symbols-outlined">error</span>${errorMessage}`;
}


