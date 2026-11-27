
const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");
const gameStatus = document.getElementById("gameStatus");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let timeLeft = 30;
let gameRunning = false;

let bubbleInterval;
let timerInterval;

let highScore = Number(localStorage.getItem("bubbleHighScore")) || 0;

highScoreDisplay.textContent = highScore;

// BUBBLE COLORS

const colors = [
    "#ff4d9d",
    "#38bdf8",
    "#a855f7",
    "#facc15",
    "#34d399",
    "#fb7185"
];

// CREATE BUBBLE

function createBubble() {

    if (!gameRunning) return;

    const bubble = document.createElement("div");

    bubble.classList.add("bubble");

    const size = Math.floor(Math.random() * 35) + 35;

    const maxX = gameArea.clientWidth - size;
    const maxY = gameArea.clientHeight - size;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    const color = colors[Math.floor(Math.random() * colors.length)];

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.left = x + "px";
    bubble.style.top = y + "px";

    bubble.style.background = color;
    bubble.style.color = color;

    // BUBBLE CLICK EVENT

    bubble.addEventListener("click", function() {

        if (!gameRunning) return;

        score += 10;

        scoreDisplay.textContent = score;

        bubble.remove();

        if (score > highScore) {

            highScore = score;

            highScoreDisplay.textContent = highScore;

            localStorage.setItem("bubbleHighScore", highScore);

        }

    });

    gameArea.appendChild(bubble);

}

// START GAME

function startGame() {

    clearInterval(bubbleInterval);
    clearInterval(timerInterval);

    score = 0;
    timeLeft = 30;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    gameArea.innerHTML = "";

    gameRunning = true;

    gameStatus.textContent = "🫧 Pop the bubbles quickly!";

    startBtn.disabled = true;

    createBubble();

    bubbleInterval = setInterval(createBubble, 650);

    timerInterval = setInterval(function() {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);

}

// END GAME

function endGame() {

    gameRunning = false;

    clearInterval(bubbleInterval);
    clearInterval(timerInterval);

    gameArea.innerHTML = "";

    gameStatus.textContent = "🎉 Game Over! Your Score: " + score;

    startBtn.disabled = false;

}

// RESTART GAME

function restartGame() {

    endGame();

    score = 0;
    timeLeft = 30;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    gameStatus.textContent = "Press Start Game to Play!";

}

// BUTTON EVENTS

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", restartGame);

console.log("MiniPlay Bubble Pop is ready!");
