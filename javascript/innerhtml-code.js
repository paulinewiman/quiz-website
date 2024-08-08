/*************************************************************
innerhtml-code.js

DA558A HT23 Javascript for web development
Lab 2
Created by Pauline Wiman 
*************************************************************/

export const RADIOBUTTON_ANSWERS_HTML = 
    `<ul id="radio-button-answers-list">
    <li>
        <label for="answer1" data-answer1>Answer 1</label>
        <input type="text" name="answer1" id="answer1" placeholder="Write answer 1 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer1-correct">
            <input type="radio" name="correct-radio-group" id="answer1-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li>
        <label for="answer2" data-answer1>Answer 2</label>
        <input type="text" name="answer2" id="answer2" placeholder="Write answer 2 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer2-correct">
            <input type="radio" name="correct-radio-group" id="answer2-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li>
        <label for="answer3" data-answer1>Answer 3</label>
        <input type="text" name="answer3" id="answer3" placeholder="Write answer 3 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer3-correct">
            <input type="radio" name="correct-radio-group" id="answer3-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li class="general-input-feedback-li">
        <div id="general-input-feedback-message" class="input-feedback-message hidden" data-input-feedback-message>
    </li>
    </ul>`;

export const CHECKBOX_ANSWERS_HTML = 
    `<ul id="radio-button-answers-list">
    <li>
        <label for="answer1" data-answer1>Answer 1</label>
        <input type="text" name="answer1" id="answer1" placeholder="Write answer 1 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer1-correct">
            <input type="checkbox" name="correct-checkbox-group" id="answer1-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li>
        <label for="answer2" data-answer1>Answer 2</label>
        <input type="text" name="answer2" id="answer2" placeholder="Write answer 2 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer2-correct">
            <input type="checkbox" name="correct-checkbox-group" id="answer2-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li>
        <label for="answer3" data-answer1>Answer 3</label>
        <input type="text" name="answer3" id="answer3" placeholder="Write answer 3 here">
        <div class="input-feedback-message hidden" data-input-feedback-message>
        </div>
        <label class="correct-label" for="answer3-correct">
            <input type="checkbox" name="correct-checkbox-group" id="answer3-correct" class="correct-checkbutton">
            Correct
        </label> 
    </li>
    <li class="general-input-feedback-li">
        <div id="general-input-feedback-message" class="input-feedback-message hidden" data-input-feedback-message>
    </li>
    </ul>`;

export const TEXT_ANSWER_HTML = 
    `<label for="text-answer">Correct answer</label>
    <input type="text" name="text-answer" id="text-answer" placeholder="Write the correct answer here">
    <div class="input-feedback-message hidden" data-input-feedback-message>
    </div>`;