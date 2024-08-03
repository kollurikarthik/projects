const choices = ['rock', 'paper', 'scissors'];
const buttons = document.querySelectorAll('.game-button');
const result = document.getElementById('result');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const tieScoreElement = document.getElementById('tieScore');
const instructionsBtn = document.getElementById('instructionsBtn');
const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));

let playerScore = 0;
let computerScore = 0;
let tieScore = 0;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        playGame(button.dataset.choice);
    });
});

instructionsBtn.addEventListener('click', () => {
    instructionsModal.show();
});

function playGame(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const outcome = getOutcome(playerChoice, computerChoice);

    updateScore(outcome);
    displayResult(outcome, playerChoice, computerChoice);
}

function getOutcome(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
}

function updateScore(outcome) {
    if (outcome === 'win') playerScore++;
    else if (outcome === 'lose') computerScore++;
    else tieScore++;

    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    tieScoreElement.textContent = tieScore;
}

function displayResult(outcome, playerChoice, computerChoice) {
    const resultMap = {
        win: 'You are Victorious!',
        lose: 'The Computer Triumphs!',
        tie: "It's a Draw!"
    };

    result.textContent = `${resultMap[outcome]} You chose ${playerChoice}, computer chose ${computerChoice}.`;
    result.className = 'result-display text-center animate__animated';
    result.classList.add(outcome === 'win' ? 'animate__tada' : outcome === 'lose' ? 'animate__wobble' : 'animate__pulse');
}