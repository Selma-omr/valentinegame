// Variables globales
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Le joueur est X
let gameActive = false;
let playerScore = 0;
let cpuScore = 0;
const WINS_NEEDED = 3; // Nombre de victoires nécessaires pour gagner le cadeau

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Éléments DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const cells = document.querySelectorAll('.cell');
const playerScoreEl = document.getElementById('player-score');
const cpuScoreEl = document.getElementById('cpu-score');

// Écrans modaux
const winModal = document.getElementById('win-modal');
const loseModal = document.getElementById('lose-modal');
const drawModal = document.getElementById('draw-modal');
const finalVictoryScreen = document.getElementById('final-victory-screen');

// Event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Démarrer le jeu
function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameActive = true;
}

// Gérer le clic sur une cellule
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(index, 'X');
    
    if (gameActive) {
        currentPlayer = 'O';
        // L'ordinateur joue après un court délai
        setTimeout(cpuMove, 500);
    }
}

// Effectuer un mouvement
function makeMove(index, player) {
    board[index] = player;
    cells[index].setAttribute('data-symbol', player);
    cells[index].classList.add('taken');
    
    checkResult();
}

// Mouvement de l'ordinateur
function cpuMove() {
    if (!gameActive) return;

    // Stratégie simple: essayer de gagner, bloquer le joueur, ou jouer aléatoirement
    let move = findBestMove('O'); // Essayer de gagner
    
    if (move === null) {
        move = findBestMove('X'); // Bloquer le joueur
    }
    
    if (move === null) {
        move = getRandomMove(); // Jouer aléatoirement
    }

    if (move !== null) {
        makeMove(move, 'O');
        currentPlayer = 'X';
    }
}

// Trouver le meilleur coup pour gagner ou bloquer
function findBestMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const values = [board[a], board[b], board[c]];
        
        // Si deux cases sont occupées par le joueur et une est vide
        if (values.filter(v => v === player).length === 2 && values.includes('')) {
            if (board[a] === '') return a;
            if (board[b] === '') return b;
            if (board[c] === '') return c;
        }
    }
    return null;
}

// Obtenir un coup aléatoire
function getRandomMove() {
    const availableMoves = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            availableMoves.push(index);
        }
    });
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return null;
}

// Vérifier le résultat
function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        highlightWinningCells(winningCombination);
        
        setTimeout(() => {
            if (board[winningCombination[0]] === 'X') {
                playerScore++;
                playerScoreEl.textContent = playerScore;
                showWinModal();
            } else {
                cpuScore++;
                cpuScoreEl.textContent = cpuScore;
                showLoseModal();
            }
        }, 500);
        return;
    }

    // Vérifier l'égalité
    if (!board.includes('')) {
        gameActive = false;
        setTimeout(() => {
            showDrawModal();
        }, 500);
    }
}

// Mettre en évidence les cellules gagnantes
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

// Afficher le modal de victoire
function showWinModal() {
    // Vérifier si le joueur a gagné 3 fois
    if (playerScore >= WINS_NEEDED) {
        // Afficher l'écran de victoire finale
        setTimeout(() => {
            showFinalVictory();
        }, 1000);
    } else {
        winModal.classList.add('active');
    }
}

// Afficher l'écran de victoire finale avec confettis
function showFinalVictory() {
    // Cacher tous les autres écrans et modals
    gameScreen.classList.remove('active');
    winModal.classList.remove('active');
    
    // Afficher l'écran de victoire finale
    finalVictoryScreen.classList.add('active');
    
    // Créer les confettis
    createConfetti();
}

// Créer l'animation de confettis
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff69b4', '#ffb3c1', '#fff', '#ffd700', '#ff1493', '#c41e3a'];
    
    // Créer 100 confettis
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            // Formes variées
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            container.appendChild(confetti);
            
            // Supprimer le confetti après l'animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 20);
    }
}

// Afficher le modal de défaite
function showLoseModal() {
    loseModal.classList.add('active');
}

// Afficher le modal d'égalité
function showDrawModal() {
    drawModal.classList.add('active');
}

// Fermer les modals et réinitialiser le plateau
function closeModal() {
    winModal.classList.remove('active');
    loseModal.classList.remove('active');
    drawModal.classList.remove('active');
    resetBoard();
}

// Réinitialiser le plateau
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    cells.forEach(cell => {
        cell.setAttribute('data-symbol', '');
        cell.classList.remove('taken', 'winner');
    });
}

// Réinitialiser le jeu complètement
function resetGame() {
    resetBoard();
    playerScore = 0;
    cpuScore = 0;
    playerScoreEl.textContent = '0';
    cpuScoreEl.textContent = '0';
}

// Empêcher le clic droit pour éviter les bugs
document.addEventListener('contextmenu', e => e.preventDefault());