/*************************************************************
classes.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

export class Quiz {

    #name;
    #questions;

    constructor(name, questions) {
        this.#name = name;
        this.#questions = questions;
    }

    get name() {
        return this.#name;
    }

    get questions() {
        return this.#questions;
    }

    toJSON() {
		return {
			name: this.#name,
			questions: this.#questions
		};
	}

    addQuestion(question) {
        this.#questions.push(question);
    }
}

export class Question {

    #questionText;
    #required;
    #questionType;
    #answers;

    constructor(questionText, required, questionType, answers) {
        this.#questionText = questionText;
        this.#required = required;
        this.#questionType = questionType;
        this.#answers = answers;
    }

    get questionText() {
        return this.#questionText;
    }

    get required() {
        return this.#required;
    }

    get questionType() {
        return this.#questionType;
    }

    get answers() {
        return this.#answers;
    }

    toJSON() {
		return {
			questionText: this.#questionText,
			required: this.#required,
            questionType: this.#questionType,
            answers: this.#answers
		};
	}
}

export class QuestionAnswer {

    #answerText;
    #correct;

    constructor(answerText, correct) {
        this.#answerText = answerText;
        this.#correct = correct;
    }

    get answerText() {
        return this.#answerText;
    }

    get correct() {
        return this.#correct;
    }

    toJSON() {
		return {
			answerText: this.#answerText,
            correct: this.#correct
		};
	}
}