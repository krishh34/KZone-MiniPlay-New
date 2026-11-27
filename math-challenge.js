
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("bestScore");

const gameStatus = document.getElementById("gameStatus");
const questionDisplay = document.getElementById("question");
const optionsGrid = document.getElementById("optionsGrid");
const startBtn = document.getElementById("startBtn");

let score = 0;
let timeLeft = 30;
let correctAnswer = 0;
let timerInterval = null;
let gameRunning = false;

let bestScore = Number(localStorage.getItem("mathChallengeBest")) || 0;

bestScoreDisplay.textContent = bestScore;

// GENERATE RANDOM QUESTION

function generateQuestion() {

    const operations = ["+", "-", "×"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;

    if (operation === "+") {
        correctAnswer = num1 + num2;
    }

    else if (operation === "-") {

        if (num2 > num1) {
            [num1, num2] = [num2, num1];
        }

        correctAnswer = num1 - num2;
    }

    else {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;

        correctAnswer = num1 * num2;
    }

    questionDisplay.textContent = `${num1} ${operation} ${num2} = ?`;

    generateOptions();

}

// GENERATE FOUR ANSWER OPTIONS

function generateOptions() {

    optionsGrid.innerHTML = "";

    let answers = [correctAnswer];

    while (answers.length < 4) {

        let wrongAnswer = correctAnswer + Math.floor(Math.random() * 21) - 10;

        if (
            wrongAnswer >= 0 &&
            !answers.includes(wrongAnswer)
        ) {
            answers.push(wrongAnswer);
        }

    }

    // Shuffle answers

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {

        const button = document.createElement("button");

        button.className = "option-btn";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(answer, button);
        });

        optionsGrid.appendChild(button);

    });

}

// CHECK ANSWER

function checkAnswer(selectedAnswer, selectedButton) {

    if (!gameRunning) return;

    const buttons = optionsGrid.querySelectorAll("button");

    // Prevent multiple clicks

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedAnswer === correctAnswer) {

        score += 10;

        selectedButton.classList.add("correct");

        gameStatus.textContent = "✅ Correct Answer! +10 Points";

    } else {

        selectedButton.classList.add("wrong");

        gameStatus.textContent = "❌ Wrong Answer! Try the next one.";

        buttons.forEach(button => {

            if (Number(button.textContent) === correctAnswer) {
                button.classList.add("correct");
            }

        });

    }

    scoreDisplay.textContent = score;

    if (score > bestScore) {

        bestScore = score;

        bestScoreDisplay.textContent = bestScore;

        localStorage.setItem("mathChallengeBest", bestScore);

    }

    setTimeout(() => {

        if (gameRunning) {
            generateQuestion();
        }

    }, 600);

}

// START TIMER

function startTimer() {

    timerInterval = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);

}

// START GAME

function startGame() {

    clearInterval(timerInterval);

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    gameStatus.textContent = "Solve as many questions as you can!";
    startBtn.textContent = "↻ Restart Challenge";

    generateQuestion();

    startTimer();

}

// END GAME

function endGame() {

    clearInterval(timerInterval);

    gameRunning = false;

    gameStatus.textContent = `⏰ Time Up! Your Final Score: ${score}`;

    questionDisplay.textContent = "Game Over!";

    optionsGrid.innerHTML = "";

    const message = document.createElement("p");

    message.textContent = "Press Restart Challenge to play again.";

    message.style.color = "#a78bfa";
    message.style.gridColumn = "1 / -1";

    optionsGrid.appendChild(message);

}

// START BUTTON

startBtn.addEventListener("click", startGame);

// INITIAL SCREEN

optionsGrid.querySelectorAll("button").forEach(button => {
    button.disabled = true;
});

