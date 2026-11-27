
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const gameStatus = document.getElementById("gameStatus");
const startBtn = document.getElementById("startBtn");

let bird;
let pipes;
let score;
let bestScore = Number(localStorage.getItem("tapToFlyBest")) || 0;

let gameRunning = false;
let animationId = null;
let frame = 0;

bestScoreDisplay.textContent = bestScore;

// BIRD SETTINGS

function createBird() {
    return {
        x: 90,
        y: 250,
        radius: 14,
        velocity: 0,
        gravity: 0.38,
        jump: -6.5
    };
}

// START GAME

function startGame() {

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
    }

    bird = createBird();
    pipes = [];
    score = 0;
    frame = 0;

    scoreDisplay.textContent = score;
    gameStatus.textContent = "Good luck! Avoid the pipes!";
    startBtn.textContent = "↻ Restart Game";

    gameRunning = true;

    drawGame();

    animationId = requestAnimationFrame(gameLoop);
}

// DRAW BACKGROUND

function drawBackground() {

    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds

    ctx.fillStyle = "rgba(255,255,255,0.8)";

    ctx.beginPath();
    ctx.arc(70, 80, 20, 0, Math.PI * 2);
    ctx.arc(95, 80, 25, 0, Math.PI * 2);
    ctx.arc(120, 80, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(260, 145, 18, 0, Math.PI * 2);
    ctx.arc(285, 145, 25, 0, Math.PI * 2);
    ctx.arc(310, 145, 18, 0, Math.PI * 2);
    ctx.fill();

    // Ground

    ctx.fillStyle = "#70b84a";
    ctx.fillRect(0, 525, 400, 25);

    ctx.fillStyle = "#4b8f36";
    ctx.fillRect(0, 525, 400, 5);
}

// DRAW BIRD

function drawBird() {

    ctx.save();

    ctx.translate(bird.x, bird.y);

    ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.06)));

    // Body

    ctx.fillStyle = "#FFD43B";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Wing

    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.ellipse(-5, 4, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(6, -5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(8, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak

    ctx.fillStyle = "#F97316";
    ctx.beginPath();
    ctx.moveTo(12, 1);
    ctx.lineTo(23, 5);
    ctx.lineTo(12, 9);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// CREATE PIPES

function createPipe() {

    const gap = 150;
    const topHeight = Math.floor(Math.random() * 220) + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        passed: false
    });
}

// DRAW PIPES

function drawPipes() {

    pipes.forEach(pipe => {

        ctx.fillStyle = "#15803D";

        // Top pipe

        ctx.fillRect(pipe.x, 0, 55, pipe.top);

        // Bottom pipe

        ctx.fillRect(
            pipe.x,
            pipe.bottom,
            55,
            525 - pipe.bottom
        );

        // Pipe borders

        ctx.fillStyle = "#166534";

        ctx.fillRect(pipe.x - 4, pipe.top - 12, 63, 12);
        ctx.fillRect(pipe.x - 4, pipe.bottom, 63, 12);

    });

}

// MOVE PIPES

function updatePipes() {

    pipes.forEach(pipe => {

        pipe.x -= 2.5;

        // Score

        if (!pipe.passed && pipe.x + 55 < bird.x) {

            score++;
            pipe.passed = true;

            scoreDisplay.textContent = score;

            if (score > bestScore) {

                bestScore = score;

                localStorage.setItem("tapToFlyBest", bestScore);

                bestScoreDisplay.textContent = bestScore;

            }

        }

    });

    pipes = pipes.filter(pipe => pipe.x > -70);

}

// CHECK COLLISION

function checkCollision() {

    // Ground or ceiling

    if (
        bird.y + bird.radius >= 525 ||
        bird.y - bird.radius <= 0
    ) {
        return true;
    }

    // Pipes

    for (const pipe of pipes) {

        const birdLeft = bird.x - bird.radius;
        const birdRight = bird.x + bird.radius;
        const birdTop = bird.y - bird.radius;
        const birdBottom = bird.y + bird.radius;

        const insidePipe =
            birdRight > pipe.x &&
            birdLeft < pipe.x + 55;

        if (insidePipe) {

            if (
                birdTop < pipe.top ||
                birdBottom > pipe.bottom
            ) {
                return true;
            }

        }

    }

    return false;

}

// DRAW EVERYTHING

function drawGame() {

    drawBackground();
    drawPipes();
    drawBird();

}

// GAME OVER

function gameOver() {

    gameRunning = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    gameStatus.textContent = "💥 Game Over! Your Score: " + score;
    startBtn.textContent = "↻ Play Again";

    drawGame();

}

// GAME LOOP

function gameLoop() {

    if (!gameRunning) return;

    frame++;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create new pipes

    if (frame % 95 === 0) {
        createPipe();
    }

    updatePipes();

    drawGame();

    if (checkCollision()) {
        gameOver();
        return;
    }

    animationId = requestAnimationFrame(gameLoop);

}

// BIRD JUMP

function flap() {

    if (!gameRunning) return;

    bird.velocity = bird.jump;

}

// CONTROLS

canvas.addEventListener("click", flap);

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();
    flap();
}, { passive: false });

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();
        flap();

    }

});

// START BUTTON

startBtn.addEventListener("click", startGame);

// INITIAL SCREEN

bird = createBird();
pipes = [];
score = 0;

drawGame();
