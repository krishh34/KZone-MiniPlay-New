
// GAME VARIABLES

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let gameMode = "twoPlayer";

let scores = {
    X: 0,
    O: 0,
    draw: 0
};


// HTML ELEMENTS

const cells = document.querySelectorAll(".cell");

const gameStatus = document.getElementById("gameStatus");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const drawScore = document.getElementById("drawScore");

const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const computerBtn = document.getElementById("computerBtn");

const difficultySelection =
    document.getElementById("difficultySelection");

const difficultySelect =
    document.getElementById("difficulty");


// WINNING COMBINATIONS

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// WIN CELEBRATION

function celebrateWin() {

    // Create confetti
    const colors = [
        "#a293ff",
        "#42d9ff",
        "#ffcc66",
        "#ff5c9a",
        "#62e6a5"
    ];

    for (let i = 0; i < 90; i++) {

        const piece = document.createElement("div");

        piece.classList.add("confetti-piece");

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.transform =
            "rotate(" + Math.random() * 360 + "deg)";

        document.body.appendChild(piece);

        setTimeout(function() {
            piece.remove();
        }, 4500);
    }

    // Winning sound
    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        const audio = new AudioContext();

        [523.25, 659.25, 783.99].forEach(function(frequency, index) {

            const oscillator = audio.createOscillator();
            const gain = audio.createGain();

            oscillator.connect(gain);
            gain.connect(audio.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = "sine";

            const startTime = audio.currentTime + index * 0.16;

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                startTime + 0.35
            );

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.35);

        });

        setTimeout(function() {
            audio.close();
        }, 1200);

    } catch (error) {
        console.log("Sound could not play:", error);
    }
}

// FIND WINNER

function findWinner(gameBoard) {

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            gameBoard[a] !== "" &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[b] === gameBoard[c]
        ) {
            return gameBoard[a];
        }
    }

    return null;
}


// PLAYER MAKES A MOVE

function handleCellClick(event) {

    const index = Number(event.target.dataset.index);

    if (!gameActive || board[index] !== "") {
        return;
    }

    // Human cannot play during computer's turn
    if (gameMode === "computer" && currentPlayer === "O") {
        return;
    }

    makeMove(index);

}


// MAKE A MOVE

function makeMove(index) {

    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;

    cells[index].classList.add(currentPlayer.toLowerCase());

    cells[index].disabled = true;

    const gameFinished = checkWinner();

    if (gameFinished) {
        return;
    }

    // Computer's turn
    if (gameMode === "computer" && currentPlayer === "O") {

        gameStatus.textContent = "🤖 Computer is thinking...";

        setTimeout(computerMove, 500);

    } else {

        gameStatus.textContent =
            "Player " + currentPlayer + "'s Turn";

    }
}


// CHECK WINNER OR DRAW

function checkWinner() {

    const winner = findWinner(board);

if (winner) {

    gameActive = false;

    celebrateWin();

    scores[winner]++;

        updateScores();

        gameStatus.textContent =
            winner === "O" && gameMode === "computer"
                ? "🤖 Computer Wins!"
                : "🎉 Player " + winner + " Wins!";

        for (let combination of winningCombinations) {

            const [a, b, c] = combination;

            if (
                board[a] === winner &&
                board[b] === winner &&
                board[c] === winner
            ) {
                combination.forEach(function(index) {
                    cells[index].classList.add("winner");
                });

                break;
            }
        }

        return true;
    }

    if (!board.includes("")) {

        gameActive = false;

        scores.draw++;

        updateScores();

        gameStatus.textContent = "🤝 It's a Draw!";

        return true;
    }

    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    return false;
}


// COMPUTER MOVE

function computerMove() {

    if (!gameActive || gameMode !== "computer") {
        return;
    }

    let availableMoves = [];

    board.forEach(function(value, index) {

        if (value === "") {
            availableMoves.push(index);
        }

    });

    if (availableMoves.length === 0) {
        return;
    }

    let chosenMove;

    if (difficultySelect.value === "easy") {

        // Easy: random move
        const randomIndex = Math.floor(
            Math.random() * availableMoves.length
        );

        chosenMove = availableMoves[randomIndex];

    } else {

        // Hard: smart AI using Minimax
        chosenMove = getBestMove();
    }

    makeMove(chosenMove);
}


// FIND BEST MOVE FOR HARD MODE

function getBestMove() {

    let bestScore = -Infinity;
    let bestMoves = [];

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "O";

            const score = minimax(board, false);

            board[i] = "";

            if (score > bestScore) {

                bestScore = score;
                bestMoves = [i];

            } else if (score === bestScore) {

                bestMoves.push(i);

            }
        }
    }

    return bestMoves[
        Math.floor(Math.random() * bestMoves.length)
    ];
}


// MINIMAX AI ALGORITHM

function minimax(gameBoard, isMaximizing) {

    const winner = findWinner(gameBoard);

    if (winner === "O") return 10;

    if (winner === "X") return -10;

    if (!gameBoard.includes("")) return 0;


    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (gameBoard[i] === "") {

                gameBoard[i] = "O";

                const score = minimax(gameBoard, false);

                gameBoard[i] = "";

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (gameBoard[i] === "") {

                gameBoard[i] = "X";

                const score = minimax(gameBoard, true);

                gameBoard[i] = "";

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}


// UPDATE SCORES

function updateScores() {

    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    drawScore.textContent = scores.draw;

}


// RESTART ROUND

function restartGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(function(cell) {

        cell.textContent = "";

        cell.disabled = false;

        cell.classList.remove("x", "o", "winner");

    });

    gameStatus.textContent = "Player X's Turn";

}


// RESET SCORES

function resetScores() {

    scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    updateScores();

    restartGame();

}


// CHANGE GAME MODE

function setGameMode(mode) {

    gameMode = mode;

    twoPlayerBtn.classList.toggle(
        "active",
        mode === "twoPlayer"
    );

    computerBtn.classList.toggle(
        "active",
        mode === "computer"
    );

    difficultySelection.style.display =
        mode === "computer" ? "block" : "none";

    restartGame();
}


// EVENT LISTENERS

cells.forEach(function(cell) {

    cell.addEventListener("click", handleCellClick);

});

restartBtn.addEventListener("click", restartGame);

resetBtn.addEventListener("click", resetScores);

twoPlayerBtn.addEventListener("click", function() {

    setGameMode("twoPlayer");

});

computerBtn.addEventListener("click", function() {

    setGameMode("computer");

});


// INITIAL SETUP

setGameMode("twoPlayer");

console.log("MiniPlay Tic Tac Toe AI is ready!");
