document.addEventListener('DOMContentLoaded', function() {

// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = 60;
var initialTime;
var timerId;

var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start-btn");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var startScreenEl = document.getElementById("start-screen");
var endScreenEl = document.getElementById('end-screen');
var finalScoreEl = document.getElementById('final-score');

function startQuiz() {

    // hide start screen
    startScreenEl.setAttribute("class", "hide");
    questionsEl.removeAttribute("class");
    timerId = setInterval(clockTick, 1000);
    timerEl.textContent = time;

    // Set initialTime
    initialTime = time;

    getQuestion();
}

function getQuestion() {
    
    var currentQuestion = questions[currentQuestionIndex];
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;
    choicesEl.innerHTML = "";

    // loop over choices
    currentQuestion.choices.forEach(function(choice, i) {
    
        // create new button for each choice
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);
        choiceNode.textContent = i + 1 + ". " + choice;

        // add click event listener to each choice button
        choiceNode.addEventListener('click', function(event) {
            event.stopPropagation();
            questionClick.call(this, event);
        });

        // display on the page
        choicesEl.appendChild(choiceNode);
    });
    }

    function questionClick(event) {
     
        var selectedChoice = this.value;
        var correctAnswer = questions[currentQuestionIndex].answer;

        if (selectedChoice === correctAnswer) {
         feedbackEl.innerText = 'Correct!';
     
        } else {
            // penalize time
            time -= 5;
    
            if (time < 0) {
                time = 0;
            }
            timerEl.textContent = time;
    
            feedbackEl.innerText = 'Wrong!';
        }
    
        feedbackEl.setAttribute('class', 'feedback');
        setTimeout(function () {
            feedbackEl.setAttribute('class', 'feedback hide');
        }, 1000);
    
        // move to the next question
        currentQuestionIndex++;
    
        if (time <= 0 || currentQuestionIndex === questions.length) {
            quizEnd();
        
        } else {
            getQuestion();
        }
    }

    var finalScoreEl = document.getElementById('final-score');
    
    function quizEnd() {

        // stop timer
        clearInterval(timerId);
    
        // Use the correct ID here
        var endScreenEl = document.getElementById('end-screen');
    
        // Make sure you remove 'hide' class from the correct element
        endScreenEl.classList.remove('hide');
    
        // show final score
        finalScoreEl.textContent = time;
    
        questionsEl.classList.add('hide');
    }
    
function clockTick() {

    // update time
    time--;
    timerEl.textContent = time;

    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore() {
    var initials = initialsEl.value.trim();

    if (initials !== '') {
        var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

        var newScore = {
            score: time,
            initials: initials
        };

        highscores.push(newScore);
        window.localStorage.setItem('highscores', JSON.stringify(highscores));

        window.location.href = "scores.html";
    }
}

function checkForEnter(event) {
    if (event.key === 'Enter') {
        saveHighscore();
    }
}

if (submitBtn) {
    submitBtn.onclick = saveHighscore;
}

if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
}

if (choicesEl) {
    choicesEl.onclick = questionClick;
}

if (initialsEl) {
    initialsEl.onkeyup = checkForEnter;
}
});