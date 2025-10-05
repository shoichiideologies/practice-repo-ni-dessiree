// Tic-Tac-Toe Game Logic
class TicTacToe {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = false;
    this.gameStarted = false;

    // Get DOM elements
    this.cells = document.querySelectorAll(".cell");
    this.playerTurnElement = document.getElementById("player-turn");
    this.gameStatusElement = document.getElementById("game-status");
    this.resetButton = document.getElementById("reset-btn");
    this.player1FirstButton = document.getElementById("player1-first");
    this.player2FirstButton = document.getElementById("player2-first");
    this.playerSelectionDiv = document.querySelector(".player-selection");

    // Winning combinations
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    this.initializeGame();
  }

  initializeGame() {
    // Add event listeners
    this.cells.forEach((cell) => {
      cell.addEventListener("click", this.handleCellClick.bind(this));
    });

    this.resetButton.addEventListener("click", this.resetGame.bind(this));
    this.player1FirstButton.addEventListener("click", () =>
      this.startGame("X")
    );
    this.player2FirstButton.addEventListener("click", () =>
      this.startGame("O")
    );

    this.resetGame();
  }

  startGame(firstPlayer) {
    this.currentPlayer = firstPlayer;
    this.gameActive = true;
    this.gameStarted = true;

    // Hide player selection buttons with animation
    this.playerSelectionDiv.style.opacity = "0";
    this.playerSelectionDiv.style.transform = "translateY(8px)";
    setTimeout(() => {
      this.playerSelectionDiv.style.display = "none";
    }, 200);

    // Update game status with improved messaging
    const playerName = firstPlayer === "X" ? "Player 1" : "Player 2";
    this.gameStatusElement.textContent = `${playerName} starts the game`;
    this.updatePlayerTurn();
  }

  handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute("data-cell"));

    // Check if game is active and cell is empty
    if (!this.gameActive || this.board[cellIndex] !== "") {
      if (!this.gameActive && !this.gameStarted) {
        this.gameStatusElement.textContent =
          "Choose who goes first to start playing";
      } else if (this.board[cellIndex] !== "") {
        this.gameStatusElement.textContent =
          "That spot is taken — try another!";
        // Reset message after a short delay
        setTimeout(() => {
          this.gameStatusElement.textContent = "Your turn!";
        }, 1500);
      }
      return;
    }

    // Make the move
    this.makeMove(cellIndex, cell);
  }

  makeMove(cellIndex, cell) {
    // Update board state
    this.board[cellIndex] = this.currentPlayer;

    // Update cell display
    cell.textContent = this.currentPlayer;
    cell.classList.add(this.currentPlayer.toLowerCase());
    cell.classList.add("taken");

    // Check for winner or draw
    if (this.checkWinner()) {
      const playerNum = this.currentPlayer === "X" ? "1" : "2";
      this.endGame(`🎉 Player ${playerNum} wins!`);
      this.gameStatusElement.classList.add("winner-announcement");
      return;
    }

    if (this.checkDraw()) {
      this.endGame("It's a draw — Great game!");
      this.gameStatusElement.classList.add("draw-announcement");
      return;
    }

    // Switch players
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.updatePlayerTurn();

    // Set encouraging message
    setTimeout(() => {
      this.gameStatusElement.textContent = "Your turn!";
    }, 100);
  }

  checkWinner() {
    return this.winningCombinations.some((combination) => {
      return combination.every((index) => {
        return (
          this.board[index] === this.currentPlayer && this.board[index] !== ""
        );
      });
    });
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  updatePlayerTurn() {
    const playerName = this.currentPlayer === "X" ? "Player 1" : "Player 2";
    this.playerTurnElement.textContent = `${playerName} (${this.currentPlayer}) - Make your move!`;
  }

  endGame(message) {
    this.gameActive = false;
    this.gameStatusElement.textContent = message;
    this.playerTurnElement.textContent = "Game Over!";

    // Disable all cells
    this.cells.forEach((cell) => {
      cell.classList.add("taken");
    });
  }

  resetGame() {
    // Reset game state
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = false;
    this.gameStarted = false;

    // Reset DOM elements
    this.cells.forEach((cell, index) => {
      cell.textContent = (index + 1).toString();
      cell.classList.remove("x", "o", "taken");
    });

    // Reset status messages with improved text
    this.playerTurnElement.textContent = "Ready to play?";
    this.gameStatusElement.textContent = "Choose your starting player";
    this.gameStatusElement.classList.remove(
      "winner-announcement",
      "draw-announcement"
    );

    // Show player selection buttons with smooth animation
    this.playerSelectionDiv.style.display = "flex";
    this.playerSelectionDiv.style.opacity = "0";
    this.playerSelectionDiv.style.transform = "translateY(8px)";
    setTimeout(() => {
      this.playerSelectionDiv.style.opacity = "1";
      this.playerSelectionDiv.style.transform = "translateY(0)";
    }, 50);
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
