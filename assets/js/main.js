console.log("Script loaded!");

const elements = {
    containerQuestion: document.getElementById("question-list"),
    containerStart: document.getElementById("starter-section"),
    containerEnd: document.getElementById("end-container"),
    containerScore: document.getElementById("score-banner"),
    formInitials: document.getElementById("initials-form"),
    containerHighScores: document.getElementById("high-score-container"),
    viewHighScores: document.getElementById("view-high-scores"),
    listHighScore: document.getElementById("high-score-list"),
    correct: document.getElementById("correct"),
    wrong: document.getElementById("wrong"),
    btnStart: document.querySelector("#start-game"),
    btnGoBack: document.querySelector("#go-back"),
    btnClearScores: document.querySelector("#clear-high-scores"),
    question: document.getElementById("question"),
    answerButtons: document.getElementById("answer-buttons"),
    timer: document.querySelector("#timer"),
};

let score = 0;
let timeleft;
let gameover;
elements.timer.innerText = 60;
const HighScores = [];
let arrayShuffledQuestions;
let QuestionIndex = 0;

const questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "String values must be enclosed within ______ when being assigned to variables.",
        choices: ["commas", "curly brackets", "quotes", "parentheses"],
        answer: "quotes"
    },
    {
        title: "Arrays in JavaScript can be used to store ______.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        title: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        answer: "console.log"
    },
    {
        title: "The condition in an if / else statement is enclosed within ______.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
];

const showElement = (element) => {
    element.classList.remove("hide");
    element.classList.add("show");
};

const hideElement = (element) => {
    element.classList.remove("show");
    element.classList.add("hide");
};

const renderStartPage = () => {
    hideElement(elements.containerQuestion);
    hideElement(elements.containerEnd);
    hideElement(elements.containerHighScores);

    showElement(elements.containerStart);

    elements.containerScore.removeChild(elements.containerScore.lastChild);
    QuestionIndex = 0;
    gameover = "";
    elements.timer.textContent = 60;

    if (elements.correct && elements.correct.classList.contains("show")) {
        hideElement(elements.correct);
    }
    if (elements.wrong && elements.wrong.classList.contains("show")) {
        hideElement(elements.wrong);
    }
};

const setTime = () => {
    timeleft = 59;

    const timercheck = setInterval(() => {
        elements.timer.innerText = timeleft;
        timeleft--;

        if (gameover) {
            clearInterval(timercheck);
        }

        if (timeleft < 0) {
            showScore();
            elements.timer.innerText = 0;
            clearInterval(timercheck);
        }
    }, 1000);
};

const startGame = () => {
    console.log("Game started!");
    hideElement(elements.containerStart);
    showElement(elements.containerQuestion);
    arrayShuffledQuestions = questions.sort(() => Math.random() - 0.5);
    QuestionIndex = 0;
    setTime();
    setQuestion();
};

const setQuestion = () => {
    resetAnswers();

    if (QuestionIndex < arrayShuffledQuestions.length) {
        displayQuestion(arrayShuffledQuestions[QuestionIndex]);
    } else {
        showScore();
    }
};

const resetAnswers = () => {
    while (elements.answerButtons.firstChild) {
        elements.answerButtons.removeChild(elements.answerButtons.firstChild);
    }
};

const displayQuestion = (index) => {
    elements.question.innerText = index.title;
    for (let i = 0; i < index.choices.length; i++) {
        const answerbutton = document.createElement('button');
        answerbutton.innerText = index.choices[i];
        answerbutton.classList.add('btn');
        answerbutton.classList.add('answerbtn');
        answerbutton.addEventListener("click", answerCheck);
        elements.answerButtons.appendChild(answerbutton);
    }
};

const answerCheck = (event) => {
    if (gameover) {
        return;
    }

    const selectedanswer = event.target;
    if (arrayShuffledQuestions[QuestionIndex].answer === selectedanswer.innerText) {
        answerCorrect();
        score += 10;
    } else {
        answerWrong();
        score -= 2;
        timeleft -= 5;
    }

    QuestionIndex++;

    if (arrayShuffledQuestions.length > QuestionIndex) {
        setQuestion();
    } else {
        gameover = true;
        setQuestion();
    }
};

const answerCorrect = () => {
    const correctElement = document.createElement('div');
    correctElement.innerText = "Correct!";
    correctElement.classList.add('right-banner');

    if (elements.containerQuestion) {
        elements.containerQuestion.appendChild(correctElement);
    }

    setTimeout(() => {
        hideElement(correctElement);
        score += 10;
        if (!gameover) {
            setQuestion();
        }
    }, 1000);
};

const answerWrong = () => {
    const wrongElement = document.createElement('div');
    wrongElement.innerText = "Wrong!";
    wrongElement.classList.add('wrong-banner');

    if (elements.containerQuestion) {
        elements.containerQuestion.appendChild(wrongElement);
    }

    setTimeout(() => {
        hideElement(wrongElement);
        score -= 5;
        if (!gameover) {
            setQuestion();
        }
    }, 1000);
};

const endQuiz = () => {
    showScore();
};

const showScore = () => {
    elements.containerQuestion.classList.add("hide");
    elements.containerEnd.classList.remove("hide");
    elements.containerEnd.classList.add("show");

    const scoreDisplay = document.createElement("p");
    scoreDisplay.innerText = `Your final score is ${score}!`;
    elements.containerScore.appendChild(scoreDisplay);

    gameover = true;

    hideElement(elements.containerStart);
    hideElement(elements.containerHighScores);
    hideElement(elements.containerQuestion);
};

const createHighScore = (event) => {
    event.preventDefault();
    const initials = document.querySelector("#initials").value;
    if (!initials) {
        alert("Enter your initials!");
        return;
    }

    elements.formInitials.reset();

    const HighScore = {
        initials: initials,
        score: score,
    };

    HighScores.push(HighScore);
    HighScores.sort((a, b) => b.score - a.score);

    while (elements.listHighScore.firstChild) {
        elements.listHighScore.removeChild(elements.listHighScore.firstChild);
    }

    for (let i = 0; i < HighScores.length; i++) {
        const highscoreEl = document.createElement("li");
        highscoreEl.className = "high-score";
        highscoreEl.innerHTML = `${HighScores[i].initials} - ${HighScores[i].score}`;
        elements.listHighScore.appendChild(highscoreEl);
    }

    saveHighScore();
    displayHighScores();
};

const saveHighScore = () => {
    localStorage.setItem("HighScores", JSON.stringify(HighScores));
};

const loadHighScore = () => {
    const LoadedHighScores = localStorage.getItem("HighScores");
    if (!LoadedHighScores) {
        return false;
    }

    const parsedHighScores = JSON.parse(LoadedHighScores);
    parsedHighScores.sort((a, b) => b.score - a.score);

    for (let i = 0; i < parsedHighScores.length; i++) {
        const highscoreEl = document.createElement("li");
        highscoreEl.className = "high-score";
        highscoreEl.innerText = `${parsedHighScores[i].initials} - ${parsedHighScores[i].score}`;
        elements.listHighScore.appendChild(highscoreEl);

        HighScores.push(parsedHighScores[i]);
    }
};

const displayHighScores = () => {
    elements.containerHighScores.classList.remove("hide");
    elements.containerHighScores.classList.add("show");
    gameover = "true";

    if (elements.containerEnd && elements.containerEnd.classList.contains("show")) {
        hideElement(elements.containerEnd);
    }

    if (elements.containerStart && elements.containerStart.classList.contains("show")) {
        hideElement(elements.containerStart);
    }

    if (elements.containerQuestion && elements.containerQuestion.classList.contains("show")) {
        hideElement(elements.containerQuestion);
    }

    if (elements.correct && elements.correct.className === "show") {
        hideElement(elements.correct);
    }

    if (elements.wrong && elements.wrong.className === "show") {
        hideElement(elements.wrong);
    }
};

const clearScores = () => {
    HighScores.length = 0;

    while (elements.listHighScore.firstChild) {
        elements.listHighScore.removeChild(elements.listHighScore.firstChild);
    }

    localStorage.removeItem("HighScores");
};

loadHighScore();

if (elements.btnStart) {
    elements.btnStart.addEventListener("click", startGame);
}

if (elements.formInitials) {
    elements.formInitials.addEventListener("submit", createHighScore);
}

if (elements.viewHighScores) {
    elements.viewHighScores.addEventListener("click", displayHighScores);
}

if (elements.btnGoBack) {
    elements.btnGoBack.addEventListener("click", renderStartPage);
}

if (elements.btnClearScores) {
    elements.btnClearScores.addEventListener("click", clearScores);
}
