
const gameBoard = document.getElementById("gameBoard");

const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const pairsDisplay = document.getElementById("pairs");
const gameStatus = document.getElementById("gameStatus");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// GAME VARIABLES

const emojis = [
    "🍎", "🚀", "🐱", "⚽",
    "🍕", "🌟", "🎮", "🦋"
];

let cards = [];
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;
let timeLeft = 0;

let gameRunning = false;
let lockBoard = false;

let timerInterval;

// SHUFFLE CARDS

function shuffleCards(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}

// CREATE GAME BOARD

function createBoard() {

    gameBoard.innerHTML = "";

    const allEmojis = shuffleCards([...emojis, ...emojis]);

    allEmojis.forEach(function(emoji) {

        const card = document.createElement("div");

        card.classList.add("memory-card");

        card.dataset.emoji = emoji;

        card.textContent = "❓";

        card.addEventListener("click", function() {

            flipCard(card);

        });

        gameBoard.appendChild(card);

    });

}

// FLIP CARD

function flipCard(card) {

    if (!gameRunning) return;

    if (lockBoard) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    card.textContent = card.dataset.emoji;

    flippedCards.push(card);

    if (flippedCards.length === 2) {

        moves++;

        movesDisplay.textContent = moves;

        checkMatch();

    }

}

// CHECK MATCH

function checkMatch() {

    const firstCard = flippedCards[0];

    const secondCard = flippedCards[1];

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matchedPairs++;

        pairsDisplay.textContent = matchedPairs + "/8";

        flippedCards = [];

        if (matchedPairs === 8) {

            winGame();

        }

    } else {

        lockBoard = true;

        setTimeout(function() {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            firstCard.textContent = "❓";

            secondCard.textContent = "❓";

            flippedCards = [];

            lockBoard = false;

        }, 900);

    }

}

// UPDATE TIMER DISPLAY

function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

}

// START GAME

function startGame() {

    clearInterval(timerInterval);

    moves = 0;
    matchedPairs = 0;
    timeLeft = 0;

    flippedCards = [];
    lockBoard = false;
    gameRunning = true;

    movesDisplay.textContent = "0";

    pairsDisplay.textContent = "0/8";

    updateTimer();

    gameStatus.textContent = "🧠 Find all matching pairs!";

    createBoard();

    startBtn.disabled = true;

    timerInterval = setInterval(function() {

        timeLeft++;

        updateTimer();

    }, 1000);

}

// WIN GAME

function winGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    gameStatus.textContent =
        "🎉 You Win! Completed in " + moves + " moves!";

    startBtn.disabled = false;

}

// RESTART GAME

function restartGame() {

    clearInterval(timerInterval);

    gameRunning = false;

    gameBoard.innerHTML = "";

    moves = 0;
    matchedPairs = 0;
    timeLeft = 0;

    flippedCards = [];

    movesDisplay.textContent = "0";

    pairsDisplay.textContent = "0/8";

    updateTimer();

    gameStatus.textContent = "Press Start Game to Play!";

    startBtn.disabled = false;

}

// BUTTON EVENTS

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", restartGame);

console.log("MiniPlay Memory Match is ready!");
