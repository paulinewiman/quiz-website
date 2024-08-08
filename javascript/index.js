/*************************************************************
index.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

import {Quiz, Question, QuestionAnswer} from './classes.js';

const MUSHROOM_QUIZ = new Quiz('Mushroom Facts', []);
const quizListElement = document.querySelector('[data-quiz-list]');
const loader = document.getElementById('loader');

let quizzes = JSON.parse(window.localStorage.getItem('quizzes'));

start();

function start() {
    if (quizzes === null) {
        loadFirstQuiz();
    }
    else {
        displayQuizzes();
    }
};

function loadFirstQuiz() {
    fetch('../json/mushroom-quiz-questions.json')
    .then((res) => {
        return res.json();
    })
    .then((mushroomQuizQuestions) => {
        for (const question of mushroomQuizQuestions) {
            const questionText = question.questionText;
            const required = question.required;
            const questionType = question.questionType;
            const answers = [];

            for (const answer of question.answers) {
                const questionAnswer = new QuestionAnswer(answer.answerText, answer.correct);
                answers.push(questionAnswer);
            }

            const q = new Question(questionText, required, questionType, answers);
            MUSHROOM_QUIZ.addQuestion(q);
        }
        quizzes = [];
        quizzes.push(MUSHROOM_QUIZ);
        showMushroomQuiz();
        window.localStorage.setItem('quizzes', JSON.stringify(quizzes));
    })
    .catch((err) => {
        console.log(err);
    });
};

function createListElement(quiz) {
    const li = document.createElement('li');
    li.classList.add('quiz-li');
    const liHTMLContent = 
    `<div class="quiz-li-info">
        <h3 class="quiz-name">${quiz.name}</h3>
        <small class="quiz-number-of-questions">${quiz.questions.length} questions</small>
    </div>
    <button id="${quizzes.indexOf(quiz)}" class="quiz-li-button" data-quiz-button>
        Take quiz
    </button>`

    li.innerHTML = liHTMLContent;
    return li;
};

function displayQuizzes() {
    quizListElement.classList.remove('hidden');
    loader.classList.add('hidden');

    for (const quiz of quizzes) {
        const quizElement= createListElement(quiz);
        quizListElement.appendChild(quizElement);
    }
    addEventListenerToButtons();
}

function showMushroomQuiz() {
    const mushroomQuizListElement = createListElement(MUSHROOM_QUIZ);
    quizListElement.appendChild(mushroomQuizListElement);

    quizListElement.classList.remove('hidden');
    loader.classList.add('hidden');
    addEventListenerToButtons();
};

function addEventListenerToButtons() {
    const quizLiButtons = document.querySelectorAll('[data-quiz-button]');
    
    quizLiButtons.forEach( button => {
        button.addEventListener('click', () => {
            let selectedQuizIndex = button.id;
            window.localStorage.setItem('quizSelected', true);
            window.localStorage.setItem('selectedQuizIndex', selectedQuizIndex);
            window.location.href = 'quiz.html';
        });
    });
};


