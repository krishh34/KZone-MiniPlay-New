
// GAME ELEMENTS

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameStatus = document.getElementById("gameStatus");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");


// GAME SETTINGS

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let nextDirection;

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let gameInterval = null;
let gameRunning = false;
let gameOver = false;


// INITIAL DISPLAY

highScoreElement.textContent = highScore;


// START GAME

function startGame() {

    if (gameRunning) return;

    clearInterval(gameInterval);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    gameOver = false;
    gameRunning = true;

    scoreElement.textContent = score;

    gameStatus.textContent = "🐍 Game Started! Eat the food!";

    createFood();
    drawGame();

    gameInterval = setInterval(gameLoop, 120);
}


// CREATE FOOD

function createFood() {

    const availablePositions = [];

    for (let x = 0; x < canvasSize; x += box) {
        for (let y = 0; y < canvasSize; y += box) {

            const occupied = snake.some(function(part) {
                return part.x === x && part.y === y;
            });

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


// DRAW GAME

function drawGame() {

    ctx.fillStyle = "#0c1716";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid

    ctx.strokeStyle = "#172a22";
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

    // Draw food

    if (food) {

        ctx.fillStyle = "#ff5757";
        ctx.beginPath();

        ctx.arc(
            food.x + box / 2,
            food.y + box / 2,
            box / 2 - 2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // Draw snake

    snake.forEach(function(part, index) {

        ctx.fillStyle = index === 0 ? "#8cffad" : "#39c96e";

        ctx.fillRect(
            part.x + 1,
            part.y + 1,
            box - 2,
            box - 2
        );

        ctx.strokeStyle = "#0c1716";
        ctx.strokeRect(
            part.x + 1,
            part.y + 1,
            box - 2,
            box - 2
        );

    });
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
        head.x === food.x && head.y === food.y;

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

    const bodyToCheck = eatingFood ? snake : snake.slice(0, -1);

    const hitBody = bodyToCheck.some(function(part) {
        return part.x === head.x && part.y === head.y;
    });

    if (hitBody) {
        endGame("💥 Game Over! You hit yourself.");
        return;
    }

    snake.unshift(head);

    // Eat food

    if (eatingFood) {

        score += 10;

        scoreElement.textContent = score;

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


// KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    const controls = [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d"
    ];

    if (controls.includes(key)) {
        event.preventDefault();
    }

    if (key === "arrowup" || key === "w") {
        if (direction !== "DOWN") nextDirection = "UP";
    }

    if (key === "arrowdown" || key === "s") {
        if (direction !== "UP") nextDirection = "DOWN";
    }

    if (key === "arrowleft" || key === "a") {
        if (direction !== "RIGHT") nextDirection = "LEFT";
    }

    if (key === "arrowright" || key === "d") {
        if (direction !== "LEFT") nextDirection = "RIGHT";
    }

});


// GAME OVER

function endGame(message) {

    clearInterval(gameInterval);

    gameRunning = false;
    gameOver = true;

    gameStatus.textContent = message;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("snakeHighScore", highScore);

        highScoreElement.textContent = highScore;
    }

}


// BUTTON EVENTS

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", startGame);


// INITIAL SCREEN

ctx.fillStyle = "#0c1716";
ctx.fillRect(0, 0, canvasSize, canvasSize);

ctx.fillStyle = "#65e89a";
ctx.font = "bold 22px Arial";
ctx.textAlign = "center";

ctx.fillText("SNAKE GAME", 200, 185);

ctx.font = "14px Arial";
ctx.fillStyle = "#aeb4ce";

ctx.fillText("Press Start Game", 200, 220);

console.log("MiniPlay Snake Game is ready!");

// MOBILE BUTTON CONTROLS

function changeDirection(newDirection) {

    if (newDirection === "UP" && direction !== "DOWN") {
        nextDirection = "UP";
    }

    if (newDirection === "DOWN" && direction !== "UP") {
        nextDirection = "DOWN";
    }

    if (newDirection === "LEFT" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    }

    if (newDirection === "RIGHT" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
}

document.querySelectorAll("[data-direction]").forEach(function(button) {

    button.addEventListener("click", function() {

        changeDirection(button.dataset.direction);

    });

});