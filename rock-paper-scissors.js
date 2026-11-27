
const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");
const drawScoreDisplay = document.getElementById("drawScore");

const playerChoiceDisplay = document.getElementById("playerChoice");
const computerChoiceDisplay = document.getElementById("computerChoice");

const gameStatus = document.getElementById("gameStatus");
const restartBtn = document.getElementById("restartBtn");

const moveButtons = document.querySelectorAll(".move-btn");

// GAME VARIABLES

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const choices = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

// PLAY GAME

function playGame(playerChoice) {

    const computerChoices = ["rock", "paper", "scissors"];

    const computerChoice =
        computerChoices[Math.floor(Math.random() * 3)];

    // SHOW CHOICES

    playerChoiceDisplay.textContent = choices[playerChoice];

    computerChoiceDisplay.textContent = choices[computerChoice];

    // CHECK RESULT

    if (playerChoice === computerChoice) {

        drawScore++;

        gameStatus.textContent = "🤝 It's a Draw!";

    }

    else if (

        (playerChoice === "rock" && computerChoice === "scissors") ||

        (playerChoice === "paper" && computerChoice === "rock") ||

        (playerChoice === "scissors" && computerChoice === "paper")

    ) {

        playerScore++;

        gameStatus.textContent = "🎉 You Win This Round!";

    }

    else {

        computerScore++;

        gameStatus.textContent = "🤖 Computer Wins This Round!";

    }

    // UPDATE SCOREBOARD

    playerScoreDisplay.textContent = playerScore;

    computerScoreDisplay.textContent = computerScore;

    drawScoreDisplay.textContent = drawScore;

}

// BUTTON EVENTS

moveButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const playerChoice = button.dataset.move;

        playGame(playerChoice);

    });

});

// RESET GAME

function resetGame() {

    playerScore = 0;
    computerScore = 0;
    drawScore = 0;

    playerScoreDisplay.textContent = "0";
    computerScoreDisplay.textContent = "0";
    drawScoreDisplay.textContent = "0";

    playerChoiceDisplay.textContent = "❔";
    computerChoiceDisplay.textContent = "❔";

    gameStatus.textContent = "Choose your move to start!";

}

restartBtn.addEventListener("click", resetGame);

console.log("MiniPlay Rock Paper Scissors is ready!");
