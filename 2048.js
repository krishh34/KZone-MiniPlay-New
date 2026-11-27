
const gameBoard = document.getElementById("gameBoard");

const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const gameStatus = document.getElementById("gameStatus");
const newGameBtn = document.getElementById("newGameBtn");

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem("2048BestScore")) || 0;

bestScoreDisplay.textContent = bestScore;

// CREATE EMPTY BOARD

function createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
}

// ADD RANDOM TILE

function addRandomTile() {

    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {

            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }

        }
    }

    if (emptyCells.length === 0) return;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
}

// DRAW BOARD

function drawBoard() {

    gameBoard.innerHTML = "";

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {

            const value = board[r][c];

            const tile = document.createElement("div");

            tile.classList.add("tile");

            if (value !== 0) {

                tile.textContent = value;
                tile.classList.add("tile-" + value);

            }

            gameBoard.appendChild(tile);

        }
    }

    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
}

// SLIDE AND MERGE A ROW

function slideRow(row) {

    let filtered = row.filter(value => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {

        if (filtered[i] === filtered[i + 1]) {

            filtered[i] *= 2;

            score += filtered[i];

            filtered[i + 1] = 0;

        }

    }

    filtered = filtered.filter(value => value !== 0);

    while (filtered.length < 4) {
        filtered.push(0);
    }

    return filtered;
}

// MOVE LEFT

function moveLeft() {

    for (let r = 0; r < 4; r++) {
        board[r] = slideRow(board[r]);
    }

}

// MOVE RIGHT

function moveRight() {

    for (let r = 0; r < 4; r++) {

        board[r] = slideRow(board[r].slice().reverse()).reverse();

    }

}

// MOVE UP

function moveUp() {

    for (let c = 0; c < 4; c++) {

        let column = [];

        for (let r = 0; r < 4; r++) {
            column.push(board[r][c]);
        }

        column = slideRow(column);

        for (let r = 0; r < 4; r++) {
            board[r][c] = column[r];
        }

    }

}

// MOVE DOWN

function moveDown() {

    for (let c = 0; c < 4; c++) {

        let column = [];

        for (let r = 3; r >= 0; r--) {
            column.push(board[r][c]);
        }

        column = slideRow(column);

        for (let r = 3, i = 0; r >= 0; r--, i++) {
            board[r][c] = column[i];
        }

    }

}

// CHECK IF BOARD CHANGED

function boardsAreEqual(oldBoard, newBoard) {

    return JSON.stringify(oldBoard) === JSON.stringify(newBoard);

}

// CHECK GAME OVER

function isGameOver() {

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {

            if (board[r][c] === 0) return false;

            if (c < 3 && board[r][c] === board[r][c + 1]) return false;

            if (r < 3 && board[r][c] === board[r + 1][c]) return false;

        }
    }

    return true;

}

// HANDLE MOVE

function handleMove(direction) {

    const oldBoard = board.map(row => [...row]);

    if (direction === "LEFT") moveLeft();
    if (direction === "RIGHT") moveRight();
    if (direction === "UP") moveUp();
    if (direction === "DOWN") moveDown();

    if (!boardsAreEqual(oldBoard, board)) {

        if (score > bestScore) {

            bestScore = score;

            localStorage.setItem("2048BestScore", bestScore);

        }

        addRandomTile();

        drawBoard();

        if (board.some(row => row.includes(2048))) {

            gameStatus.textContent = "🎉 Amazing! You reached 2048!";

        } else if (isGameOver()) {

            gameStatus.textContent = "Game Over! Press New Game to try again.";

        } else {

            gameStatus.textContent = "Keep going! Reach 2048!";

        }

    }

}

// KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

    const keys = {
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        ArrowUp: "UP",
        ArrowDown: "DOWN"
    };

    const direction = keys[event.key];

    if (direction) {

        event.preventDefault();

        handleMove(direction);

    }

});

// NEW GAME

function newGame() {

    board = createEmptyBoard();

    score = 0;

    gameStatus.textContent = "Use Arrow Keys to Play!";

    addRandomTile();
    addRandomTile();

    drawBoard();

}

newGameBtn.addEventListener("click", newGame);

// START GAME

newGame();

console.log("MiniPlay 2048 is ready!");
