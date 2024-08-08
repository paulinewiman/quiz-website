/*************************************************************
quiz.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

if (!JSON.parse(window.localStorage.getItem('quizSelected'))) {
    window.location.href = 'index.html';
}

const quizzes = JSON.parse(window.localStorage.getItem('quizzes'));
const quizNameTextElement = document.querySelector('[data-quiz-name]');
const questionCounterTextElement = document.querySelector('[data-question-counter]');
const questionNumberTextElement = document.querySelector('[data-question-number]');
const questionTextElement = document.querySelector('[data-question-text]');
const progressElement = document.querySelector('[data-progress]');
const questionFormElement = document.querySelector('[data-answer-form]');
const inputFeedbackMessageTextElement = 
    document.querySelector('[data-input-feedback-message]');
const nextButton = document.getElementById('next-button');
const quizStartTime = Date.now();

let selectedQuizIndex = JSON.parse(window.localStorage.getItem('selectedQuizIndex'));
let quiz = quizzes[ selectedQuizIndex ];
let quizLength = quiz.questions.length;
let currentQuestion = {};
let quizResults = [];
let currentQuestionNumber = 0;

startQuiz();
nextButton.addEventListener('click', validateAnswer);

function startQuiz() {
    currentQuestionNumber = 0;
    quizNameTextElement.innerText = quiz.name;

    getNextQuestion();
}

function getNextQuestion() {
    currentQuestionNumber++;

    if (currentQuestionNumber > quiz.questions.length) return;
    
    if (currentQuestionNumber === quiz.questions.length) {
        nextButton.innerText = 'Finish';
    } 

    currentQuestion = quiz.questions[currentQuestionNumber - 1];
    questionCounterTextElement.innerText = 
        `${currentQuestionNumber}/${quizLength}`;

    // Progressbar-width differ depending on number of questions left
    progressElement.style.width = 
        `${(currentQuestionNumber / quizLength) * 100}%`;

    questionNumberTextElement.innerText = `Question ${currentQuestionNumber}`;
    questionTextElement.innerText = 
        currentQuestion.required ? `${currentQuestion.questionText} *` : `${currentQuestion.questionText}`;

    questionFormElement.innerHTML = getAnswerElements(currentQuestion);
    const dataAnswerLabels = Array.from(document.getElementsByClassName('answer-label'));

    dataAnswerLabels.forEach(element => {
        element.addEventListener('click', changeSelectedColor);
    });
}

function getAnswerElements(question) {
    let result = "";

    switch(question.questionType) {
        case 'radio':
            result = getRadioQuestionElements(question);
            break;
        case 'multiple':
            result = getMultipleChoiceQuestionElements(question);
            break;
        case 'text':
            result = getTextQuestionElements(question);
            break;
        default:
            console.error('Invalid question type');
            break;
    }

    return result;
}

function getRadioQuestionElements(question) {
    const answers = question.answers;

    let formHTML = 
    `<ul id="answer-list">
        <li class="answer">
            <label for="answer1" class="answer-label">
                <input type="radio" name="radio-group" id="answer1" value="${answers[0].answerText}" data-answer-id="0">
                ${answers[0].answerText}
            </label>
        </li>
        <li class="answer">
            <label for="answer2" class="answer-label">
                <input type="radio" name="radio-group" id="answer2" value="${answers[1].answerText}" data-answer-id="1">
                ${answers[1].answerText}
            </label>
        </li>
        <li class="answer">
            <label for="answer3" class="answer-label">
                <input type="radio" name="radio-group" id="answer3" value="${answers[2].answerText}" data-answer-id="2">
                ${answers[2].answerText}
            </label>
        </li>
    </ul>`;

    return formHTML;
}

function getMultipleChoiceQuestionElements(question) {
    const answers = question.answers;

    let formHTML = 
    `<ul id="answer-list">
        <li class="answer">
            <label for="answer1" class="answer-label">
                <input type="checkbox" name="checkbox-group" id="answer1" value="${answers[0].answerText}" data-answer-id="0">
                ${answers[0].answerText}
            </label>
        </li>
        <li class="answer">
            <label for="answer2" class="answer-label">
                <input type="checkbox" name="checkbox-group" id="answer2" value="${answers[1].answerText}" data-answer-id="1">
                ${answers[1].answerText}
            </label>
        </li>
        <li class="answer">
            <label for="answer3" class="answer-label">
                <input type="checkbox" name="checkbox-group" id="answer3" value="${answers[2].answerText}" data-answer-id="2">
                ${answers[2].answerText}
            </label>
        </li>
    </ul>`;

    return formHTML;
}

function getTextQuestionElements(question) {
    const answers = question.answers;

    let formHTML = 
        `<input type="text" name="answer" id="text-answer" placeholder="Write your answer here" data-answer-id="0">`;

    return formHTML;
}

function changeSelectedColor() {
    const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'));
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

    const inputButtons = radioButtons.concat(checkboxes);
    
    for (let i = 0; i < inputButtons.length; i++) {
        if (inputButtons[i].checked) {
            inputButtons[i].parentElement.classList.add('selected');
        } else {
            inputButtons[i].parentElement.classList.remove('selected');
        }
    }
}

function validateAnswer() {
    let answerIsCorrect = false;
    
    if (!answerHasBeenSelected()) return;

    if (currentQuestion.required || nonRequiredQuestionHasBeenAnswered()) {
        switch(currentQuestion.questionType) {
            case 'radio':
                answerIsCorrect = validateRadioQuestion();
                break;
            case 'multiple':
                answerIsCorrect = validateMultipleChoiceQuestion();
                break;
            case 'text':
                answerIsCorrect = validateTextQuestion();
                break;
            default:
                console.error('Unable to validate question.');
                break;
        }
    }
    
    quizResults.push(answerIsCorrect);

    if (currentQuestionNumber === quiz.questions.length) {
        window.location.href = 'results.html';
        const quizEndTime = Date.now();
        const quizTime = new Date(quizEndTime - quizStartTime);
        window.localStorage.setItem('quizTime', JSON.stringify(quizTime));
        window.localStorage.setItem('quizResults', JSON.stringify(quizResults));
    } else {
        getNextQuestion();
    }
}

function validateRadioQuestion() {
    const selectedAnswer = document.querySelector('input[type="radio"]:checked');
    const answerIndex = selectedAnswer.dataset.answerId;
    return currentQuestion.answers[answerIndex].correct;
}

function validateMultipleChoiceQuestion() {
    const selectedAnswers = 
        document.querySelectorAll('input[type="checkbox"]:checked');
    
    let numberOfCorrectAnswers = 0;
    
    for (const answer of currentQuestion.answers) {
        if (answer.correct)
            numberOfCorrectAnswers++;
    }

    if (selectedAnswers.length !== numberOfCorrectAnswers) return false;

    let answersAreCorrect;

    for (const selectedAnswer of selectedAnswers) {
        const answerIndex = selectedAnswer.dataset.answerId;
        if (currentQuestion.answers[answerIndex].correct) 
            answersAreCorrect = true;
        else {
            answersAreCorrect = false;
            break;
        }
    }

    return answersAreCorrect;
}

function validateTextQuestion() {
    const answer = document.querySelector('input[type="text"]').value.toLowerCase();
    const correctAnswer = currentQuestion.answers[0].answerText.toLowerCase();
    return answer === correctAnswer;
}

function answerHasBeenSelected() {
    const inputElements = Array.from(document.querySelectorAll('[data-answer-id]'));
    const noSelectedAnswer =  inputElements[0].type != 'text' && inputElements.every(answer => !answer.checked);

    if (currentQuestion.required && (noSelectedAnswer || inputElements[0].value === '')) {
        inputFeedbackMessageTextElement.classList.remove('hidden');
        inputFeedbackMessageTextElement.classList.add('incorrect');
        inputFeedbackMessageTextElement.innerHTML = 
        `<span class="material-symbols-outlined">error</span>Answer to question is required`;
        return false;
    } 
    else {
        inputFeedbackMessageTextElement.classList.add('hidden');
        inputFeedbackMessageTextElement.innerHTML = '';
        return true;
    }
}

function nonRequiredQuestionHasBeenAnswered() {
    const inputElements = Array.from(document.querySelectorAll('[data-answer-id]'));
    const noSelectedAnswer =  inputElements[0].type != 'text' && inputElements.every(answer => !answer.checked);

    return !currentQuestion.required && !(noSelectedAnswer || inputElements[0].value === '');
}

