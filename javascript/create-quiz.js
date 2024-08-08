/*************************************************************
create-quiz.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

import {Quiz, Question, QuestionAnswer} from './classes.js';
import {RADIOBUTTON_ANSWERS_HTML, CHECKBOX_ANSWERS_HTML, TEXT_ANSWER_HTML} from './innerhtml-code.js';

if (JSON.parse(window.localStorage.getItem('quizSelected'))) {
    window.localStorage.setItem('selectedQuizIndex', 'undefined');
    window.localStorage.setItem('quizSelected', 'false');
    window.localStorage.setItem('quizResults', 'undefined')
    window.localStorage.setItem('quizTime', 'undefined');
}

// Error-message constants
const NO_CORRECT_ANSWER_SELECTED = 'You must choose a correct answer';
const EMPTY_FIELD = 'Field cannot be empty';
const NO_QUESTION_TYPE_SELECTED = 'You must select a question type';

const questionCounterElement = document.querySelector('[data-question-counter]');
const addQuestionFormElement = document.getElementById('add-question-form');
const addQuestionFormList = document.getElementById('add-question-form-list');
const addNewQuestionSection = document.getElementById('add-another-question-section');
const addNewQuestionButton = document.getElementById('add-another-question-button');
const createQuizForm = document.getElementById('create-quiz-form');
const quizName = createQuizForm.querySelector('input[type="text"]');

let questionTypeElement = document.getElementById('questionType');
let answerListElement = document.querySelector('[data-set-answers-li]');

let quizzes = JSON.parse(localStorage.getItem('quizzes'));
if (quizzes === null) {
    quizzes = [];
}

let questions = [];
let questionCounter = 1;

questionCounterElement.innerText = `Question ${questionCounter}`;
questionTypeElement.addEventListener('input', showQuestionTypeAnswerList);

createQuizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let inputIsValid = true;

    if (quizName.value === '') {
        const inputFeedbackMessageElement = quizName.parentElement.querySelector('[data-input-feedback-message]');
        hideErrorMessageOnInput(quizName);
        displayErrorMessage(inputFeedbackMessageElement, EMPTY_FIELD);
        inputIsValid = false;
    }

    if (questions.length < 1) {
        alert('You must add atleast one question to the quiz');
        inputIsValid = false;
    }

    if (inputIsValid) {
        createQuiz();
        alert('Quiz created!');
        window.location.href = 'index.html';       
    }

});

addQuestionFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    hideOldErrorMessages();
    const inputIsValid = validateQuestionInput();

    if (inputIsValid) {
        const question = createQuestion();
        questionCounter++;
        questions.push(question);
        addQuestionFormList.classList.add('hidden');
        addNewQuestionSection.classList.remove('hidden');
    }
});

addNewQuestionButton.addEventListener('click', (e) => {
    displayAddQuestionSection();
});

function showQuestionTypeAnswerList() {
    const inputFeedbackMessageElement = questionTypeElement.parentElement.querySelector('[data-input-feedback-message]');
    
    inputFeedbackMessageElement.classList.add('hidden');
    answerListElement.innerHTML = displayAnswerListElement(questionTypeElement.value);
}

function displayAnswerListElement(questionTypeValue) {
    let answerListElementContent = '';

    switch (questionTypeValue) {

        case 'radio':
            answerListElementContent = RADIOBUTTON_ANSWERS_HTML;
            break;
        case 'multiple':
            answerListElementContent = CHECKBOX_ANSWERS_HTML;
            break;
        case 'text':
            answerListElementContent = TEXT_ANSWER_HTML;
            break;
        case '': 
        default:
            break;
    }

    return answerListElementContent;
}

function createQuiz() {
    const quiz = new Quiz(quizName.value, questions);
    quizzes.push(quiz);
    window.localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

function hideErrorMessageOnInput(element) {
    element.addEventListener('input', () => {
        const inputFeedbackMessageElement = element.parentElement.querySelector('[data-input-feedback-message]');
        inputFeedbackMessageElement.classList.add('hidden');
    });
}

function displayAddQuestionSection() {
    addNewQuestionSection.classList.add('hidden');
    addQuestionFormList.classList.remove('hidden');
    addQuestionFormList.innerHTML = 
    `<li>
    <label for="questionText" data-question-counter>Question ${questionCounter}</label>
    <textarea name="questionText" id="questionText" rows="5" placeholder="Write the question here"></textarea>
    <div class="input-feedback-message hidden" data-input-feedback-message>
    </div>
    </li>
    <li>
    <label for="questionType">Question type</label>
    <select name="questionType" id="questionType">
        <option value="" selected>
            Select question type here
        </option>
        <option value="radio">Radio button</option>
        <option value="multiple">Multiple choice</option>
        <option value="text">Text</option>
    </select>
    <div class="input-feedback-message hidden" data-input-feedback-message>
    </div>
    </li>
    <li data-set-answers-li>

    </li>
    <li>
    <button id="add-question-button" type="submit" form="add-question-form">
        Add question
    </button>
    </li>`;

    questionTypeElement = document.getElementById('questionType');
    answerListElement = document.querySelector('[data-set-answers-li]');
    questionTypeElement.addEventListener('input', showQuestionTypeAnswerList);
}

function createQuestion() {
    const questionTextElement = addQuestionFormElement.querySelector('textarea');
    const answerElements = addQuestionFormElement.querySelectorAll('input[type="text"]');

    const questionText = questionTextElement.value;
    const questionType = questionTypeElement.value;
    let answers = [];
    for (const answer of answerElements) {
        const answerText = answer.value;

        if (questionType === 'text') {
            answers.push(new QuestionAnswer(answerText, true));
        }
        else {
            const correct = answer.parentElement.querySelector('.correct-checkbutton').checked;
            answers.push(new QuestionAnswer(answerText, correct));
        }
    }

    return new Question(questionText, true, questionType, answers);
}

function hideOldErrorMessages() {
    const inputElements = addQuestionFormElement.querySelectorAll('input[type="text"], textarea');

    if (questionTypeElement.value === 'radio' || questionTypeElement.value === 'multiple') {
        const checkButtons = addQuestionFormElement.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        const generalInputFeedbackMessageElement = addQuestionFormElement.querySelector('#general-input-feedback-message');
        
        checkButtons.forEach(button => {
            button.addEventListener('input', () => {
                generalInputFeedbackMessageElement.classList.add('hidden');
            });
        });
    }

    inputElements.forEach(element => {
        hideErrorMessageOnInput(element)
    });
}

function validateQuestionInput() {
    const inputElements = Array.from(addQuestionFormElement.querySelectorAll('input[type="text"], textarea'));
    const noQuestionTypeSelected = questionTypeElement.value === '';
    const inputFieldIsEmpty = !inputElements.every(element => element.value !== ''); 

    let inputIsValid = true;
    
    if (noQuestionTypeSelected) {
        const inputFeedbackMessageElement = questionTypeElement.parentElement.querySelector('[data-input-feedback-message]');
        displayErrorMessage(inputFeedbackMessageElement, NO_QUESTION_TYPE_SELECTED);
        inputIsValid = false;
    } 

    if (inputFieldIsEmpty) {
        inputElements.forEach(element => {
            if (element.value === '') {
                const inputFeedbackMessageElement = element.parentElement.querySelector('[data-input-feedback-message]');
                displayErrorMessage(inputFeedbackMessageElement, EMPTY_FIELD);
            }
        });
        inputIsValid = false;
    }

    if (questionTypeElement.value === 'radio'|| questionTypeElement.value === 'multiple') {
        if (!correctAnswerHasBeenSelected()) {
            const generalInputFeedbackMessageLi = addQuestionFormElement.querySelector('.general-input-feedback-li');
            const generalInputFeedbackMessageElement = generalInputFeedbackMessageLi.querySelector('[data-input-feedback-message]');

            displayErrorMessage(generalInputFeedbackMessageElement, NO_CORRECT_ANSWER_SELECTED);
            inputIsValid = false;
        }
    }

    return inputIsValid;
}

function correctAnswerHasBeenSelected() {
    const checkButtons = addQuestionFormElement.querySelectorAll('input[type="radio"], input[type="checkbox"]'); 
    let correctAnswerHasBeenSelected = false;

    for (const button of checkButtons) {
        if (button.checked) {
            correctAnswerHasBeenSelected = true;
            break;
        }
    }

    return correctAnswerHasBeenSelected;
}

function displayErrorMessage(element, errorMessage) {
    element.classList.remove('hidden');
    element.classList.add('incorrect');
    element.innerHTML = 
        `<span class="material-symbols-outlined">error</span>${errorMessage}`;
}