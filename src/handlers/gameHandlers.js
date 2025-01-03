import { GAME_SETTINGS } from "../constants.js";

export class GameHandlers {
  constructor(gameState, elements, ui) {
    this.gameState = gameState;
    this.elements = elements;
    this.ui = ui;
    this.alphabet = [];
  }

  setAlphabet(alphabet) {
    this.alphabet = alphabet;
  }

  handleSetPlayers = () => {
    this.gameState.playerCount = parseInt(this.elements.playerCountInput.value);
    this.ui.renderPlayerInputs();
  };

  handleStartGame = () => {
    if (!this.validatePlayerNames()) return;
    this.ui.showGameScreen();
    this.initializeGame();
  };

  handleTileClick = (event) => {
    const tile = event.currentTarget;
    if (
      !tile.classList.contains("flipped") &&
      !tile.classList.contains("matched") &&
      this.gameState.flippedTiles.length < 2
    ) {
      tile.classList.add("flipped");
      this.gameState.flippedTiles.push(tile);
      if (this.gameState.flippedTiles.length === 2) {
        this.checkMatch();
      }
    }
  };

  handleMatch = () => {
    this.gameState.flippedTiles.forEach((tile) =>
      tile.classList.add("matched")
    );
    this.gameState.tiles = this.gameState.tiles.filter(
      (tile) => !this.gameState.flippedTiles.includes(tile)
    );
    this.updateScore(this.gameState.currentPlayer);
    this.gameState.flippedTiles = [];

    if (this.gameState.tiles.length === 0) {
      setTimeout(this.showGameResults, GAME_SETTINGS.WIN_NOTIFICATION_DELAY);
    }
  };

  handleMismatch = () => {
    setTimeout(() => {
      this.gameState.flippedTiles.forEach((tile) =>
        tile.classList.remove("flipped")
      );
      this.gameState.flippedTiles = [];
      this.switchPlayer();
    }, GAME_SETTINGS.MATCH_DELAY);
  };

  checkMatch = () => {
    const [tile1, tile2] = this.gameState.flippedTiles;
    const isMatch =
      tile1.getAttribute("data-letter") === tile2.getAttribute("data-letter");

    if (isMatch) {
      this.handleMatch();
    } else {
      this.handleMismatch();
    }
  };

  switchPlayer = () => {
    this.gameState.currentPlayer =
      (this.gameState.currentPlayer % this.gameState.playerCount) + 1;
    this.ui.updateActivePlayer();
  };

  updateScore = (player) => {
    this.gameState.scores[player]++;
    this.elements.playersContainer.querySelector(
      `.player${player} .score`
    ).textContent = this.gameState.scores[player];
  };

  showGameResults = () => {
    const maxScore = Math.max(...Object.values(this.gameState.scores));
    const winners = Object.entries(this.gameState.scores)
      .filter(([_, score]) => score === maxScore)
      .map(([playerId]) => this.gameState.playerNames[playerId]);

    alert(
      winners.length > 1
        ? `Ничья между игроками: ${winners.join(", ")}!`
        : `Победил игрок ${winners[0]}! Счет: ${maxScore} очков`
    );
  };

  validatePlayerNames = () => {
    const nameInputs =
      this.elements.playerNamesContainer.querySelectorAll("input");
    let allNamesEntered = true;

    nameInputs.forEach((input) => {
      const name = input.value.trim();
      if (name === "") {
        allNamesEntered = false;
        input.style.borderColor = "red";
      } else {
        this.gameState.playerNames[input.dataset.player] = name;
      }
    });

    if (!allNamesEntered) {
      alert("Пожалуйста, введите имена всех игроков");
    }
    return allNamesEntered;
  };

  initializeGame = () => {
    this.initializeScores();
    this.ui.renderPlayers();
    this.generateTiles();
  };

  initializeScores = () => {
    this.gameState.scores = {};
    for (let i = 1; i <= this.gameState.playerCount; i++) {
      this.gameState.scores[i] = 0;
    }
  };

  generateTiles = () => {
    this.gameState.tiles = [];
    this.alphabet.forEach((letter) => {
      this.gameState.tiles.push(
        this.ui.createTile(letter, this.handleTileClick),
        this.ui.createTile(letter, this.handleTileClick)
      );
    });
    this.shuffleTiles();
    this.ui.appendTiles(this.gameState.tiles);
  };

  shuffleTiles = () => {
    this.gameState.tiles.sort(() => Math.random() - 0.5);
  };

  resetGame = () => {
    this.resetGameState();
    this.ui.resetUI();
  };

  resetGameState = () => {
    this.gameState.tiles = [];
    this.gameState.flippedTiles = [];
    this.gameState.currentPlayer = 1;
    this.gameState.scores = {};
    this.gameState.playerNames = {};
    this.gameState.playerCount = GAME_SETTINGS.INITIAL_PLAYER_COUNT;
  };
}
