
// MINIPLAY SNAKE GAME - UPGRADED

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameStatus = document.getElementById("gameStatus");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const soundBtn = document.getElementById("soundBtn");
const gameBoard = document.getElementById("gameBoard");

const box = 20;
const canvasSize = 400;

let snake = [];
let food = null;
let direction = "RIGHT";
let nextDirection = "RIGHT";

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let gameInterval = null;
let gameRunning = false;
let soundEnabled = true;
let audioContext = null;

let touchStartX = 0;
let touchStartY = 0;

let foodPulse = 0;

highScoreElement.textContent = highScore;


// SOUND EFFECTS

function playSound(frequency, duration = 0.1, type = "sine") {

    if (!soundEnabled) return;

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime
        );

        gain.gain.setValueAtTime(
            0.12,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);

    } catch (error) {
        console.log("Sound unavailable");
    }
}


// START GAME

function startGame() {

    clearInterval(gameInterval);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    gameRunning = true;

    scoreElement.textContent = score;

    gameStatus.textContent = "🐍 Game Started! Eat the food!";

    createFood();
    drawGame();

    if (!gameRunning) return;

    gameInterval = setInterval(gameLoop, 120);

    playSound(500, 0.12);
}


// CREATE FOOD

function createFood() {

    const availablePositions = [];

    for (let x = 0; x < canvasSize; x += box) {

        for (let y = 0; y < canvasSize; y += box) {

            const occupied = snake.some(part =>
                part.x === x && part.y === y
            );

            if (!occupied) {
                availablePositions.push({ x, y });
            }
        }
    }

    if (availablePositions.length === 0) {
        endGame("🏆 You filled the entire board!");
        return;
    }

    food = availablePositions[
        Math.floor(Math.random() * availablePositions.length)
    ];
}


// DRAW ROUNDED SNAKE PART

function drawSnakePart(part, index) {

    const padding = 2;
    const size = box - padding * 2;

    ctx.shadowBlur = index === 0 ? 13 : 5;
    ctx.shadowColor = index === 0 ? "#8cffad" : "#39c96e";

    const gradient = ctx.createLinearGradient(
        part.x, part.y,
        part.x + box, part.y + box
    );

    if (index === 0) {
        gradient.addColorStop(0, "#baffcb");
        gradient.addColorStop(1, "#39e879");
    } else {
        gradient.addColorStop(0, "#55e88a");
        gradient.addColorStop(1, "#168b48");
    }

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(
        part.x + padding,
        part.y + padding,
        size,
        size,
        6
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    // Snake eyes

    if (index === 0) {

        ctx.fillStyle = "#092316";

        let eye1 = { x: 0, y: 0 };
        let eye2 = { x: 0, y: 0 };

        if (direction === "RIGHT") {
            eye1 = { x: 14, y: 6 };
            eye2 = { x: 14, y: 14 };
        }

        if (direction === "LEFT") {
            eye1 = { x: 6, y: 6 };
            eye2 = { x: 6, y: 14 };
        }

        if (direction === "UP") {
            eye1 = { x: 6, y: 6 };
            eye2 = { x: 14, y: 6 };
        }

        if (direction === "DOWN") {
            eye1 = { x: 6, y: 14 };
            eye2 = { x: 14, y: 14 };
        }

        [eye1, eye2].forEach(eye => {

            ctx.beginPath();
            ctx.arc(
                part.x + eye.x,
                part.y + eye.y,
                2,
                0,
                Math.PI * 2
            );
            ctx.fill();

        });
    }
}


// DRAW FOOD

function drawFood() {

    if (!food) return;

    foodPulse += 0.12;

    const pulse = Math.sin(foodPulse) * 2;
    const centerX = food.x + box / 2;
    const centerY = food.y + box / 2;

    ctx.shadowBlur = 17;
    ctx.shadowColor = "#ff5757";

    const gradient = ctx.createRadialGradient(
        centerX - 4,
        centerY - 4,
        2,
        centerX,
        centerY,
        12 + pulse
    );

    gradient.addColorStop(0, "#ffb2a7");
    gradient.addColorStop(0.5, "#ff5757");
    gradient.addColorStop(1, "#c92d42");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        8 + pulse,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    // Food leaf

    ctx.fillStyle = "#8cffad";
    ctx.beginPath();
    ctx.ellipse(
        centerX + 4,
        centerY - 8,
        3,
        5,
        -0.6,
        0,
        Math.PI * 2
    );
    ctx.fill();
}


// DRAW GAME

function drawGame() {

    ctx.fillStyle = "#0c1716";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Grid

    ctx.strokeStyle = "#183026";
    ctx.lineWidth = 1;

    for (let i = 0; i <= canvasSize; i += box) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }

    // Food

    drawFood();

    // Snake

    snake.forEach(drawSnakePart);
}


// GAME LOOP

function gameLoop() {

    direction = nextDirection;

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    const eatingFood =
        food &&
        head.x === food.x &&
        head.y === food.y;

    // Wall collision

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
    ) {
        endGame("💥 Game Over! You hit the wall.");
        return;
    }

    // Self collision

    const bodyToCheck = eatingFood
        ? snake
        : snake.slice(0, -1);

    const hitBody = bodyToCheck.some(part =>
        part.x === head.x && part.y === head.y
    );

    if (hitBody) {
        endGame("💥 Game Over! You hit yourself.");
        return;
    }

    snake.unshift(head);

    // Eat food

    if (eatingFood) {

        score += 10;

        scoreElement.textContent = score;

        playSound(750, 0.12);

        createFood();

        if (!gameRunning) {
            drawGame();
            return;
        }

    } else {

        snake.pop();

    }

    drawGame();
}


// CHANGE DIRECTION

function changeDirection(newDirection) {

    if (!gameRunning) return;

    if (
        newDirection === "UP" &&
        direction !== "DOWN" &&
        nextDirection !== "DOWN"
    ) {
        nextDirection = "UP";
    }

    if (
        newDirection === "DOWN" &&
        direction !== "UP" &&
        nextDirection !== "UP"
    ) {
        nextDirection = "DOWN";
    }

    if (
        newDirection === "LEFT" &&
        direction !== "RIGHT" &&
        nextDirection !== "RIGHT"
    ) {
        nextDirection = "LEFT";
    }

    if (
        newDirection === "RIGHT" &&
        direction !== "LEFT" &&
        nextDirection !== "LEFT"
    ) {
        nextDirection = "RIGHT";
    }
}


// KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    const controls = [
        "arrowup", "arrowdown",
        "arrowleft", "arrowright",
        "w", "a", "s", "d"
    ];

    if (controls.includes(key)) {
        event.preventDefault();
    }

    if (key === "arrowup" || key === "w") {
        changeDirection("UP");
    }

    if (key === "arrowdown" || key === "s") {
        changeDirection("DOWN");
    }

    if (key === "arrowleft" || key === "a") {
        changeDirection("LEFT");
    }

    if (key === "arrowright" || key === "d") {
        changeDirection("RIGHT");
    }

});


// MOBILE SWIPE CONTROLS

gameBoard.addEventListener("touchstart", function(event) {

    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


gameBoard.addEventListener("touchend", function(event) {

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 20) {
        return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {

        changeDirection(deltaX > 0 ? "RIGHT" : "LEFT");

    } else {

        changeDirection(deltaY > 0 ? "DOWN" : "UP");

    }

}, { passive: true });


// MOBILE BUTTON CONTROLS

document.querySelectorAll("[data-direction]").forEach(button => {

    button.addEventListener("click", function() {
        changeDirection(button.dataset.direction);
    });

});


// GAME OVER

function endGame(message) {

    clearInterval(gameInterval);

    gameRunning = false;

    gameStatus.textContent = message;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("snakeHighScore", highScore);

        highScoreElement.textContent = highScore;

        gameStatus.textContent += " 🏆 New High Score!";
    }

    playSound(180, 0.35, "sawtooth");
}


// FULLSCREEN

fullscreenBtn.addEventListener("click", async function() {

    try {

        if (!document.fullscreenElement) {

            await gameBoard.requestFullscreen();

            fullscreenBtn.textContent = "✕ Exit Fullscreen";

        } else {

            await document.exitFullscreen();

            fullscreenBtn.textContent = "⛶ Fullscreen";

        }

    } catch (error) {

        gameStatus.textContent =
            "Fullscreen is not supported in this browser.";

    }

});


document.addEventListener("fullscreenchange", function() {

    fullscreenBtn.textContent = document.fullscreenElement
        ? "✕ Exit Fullscreen"
        : "⛶ Fullscreen";

});


// SOUND BUTTON

soundBtn.addEventListener("click", function() {

    soundEnabled = !soundEnabled;

    soundBtn.textContent = soundEnabled
        ? "🔊 Sound On"
        : "🔇 Sound Off";

    if (soundEnabled) {
        playSound(500, 0.12);
    }

});


// BUTTON EVENTS

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);


// INITIAL SCREEN

function drawInitialScreen() {

    ctx.fillStyle = "#0c1716";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "#65e89a";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "center";

    ctx.fillText("🐍 SNAKE GAME", 200, 180);

    ctx.font = "15px Arial";
    ctx.fillStyle = "#aeb4ce";

    ctx.fillText("Press Start Game", 200, 215);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#65e89a";

    ctx.fillText("Swipe to control on mobile", 200, 245);
}

drawInitialScreen();

console.log("MiniPlay Snake Game upgraded!");
