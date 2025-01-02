import { GAME_SETTINGS } from "../constants.js";

export class GameUI {
  constructor(elements, gameState) {
    this.elements = elements;
    this.gameState = gameState;
  }

  showGameScreen() {
    this.elements.setupContainer.style.display = "none";
    this.elements.playersContainer.style.display = "flex";
    this.elements.gameBoard.style.display = "grid";
    this.elements.resetButton.style.display = "inline-block";
  }

  renderPlayerInputs() {
    this.elements.playerNamesContainer.innerHTML = Array.from(
      { length: this.gameState.playerCount },
      (_, i) => this.createPlayerInput(i + 1)
    ).join("");
  }

  createPlayerInput(playerNumber) {
    return `
      <div class="player-input">
        <input type="text" placeholder="Имя игрока ${playerNumber}" data-player="${playerNumber}" />
      </div>
    `;
  }

  renderPlayers() {
    this.elements.playersContainer.innerHTML = Array.from(
      { length: this.gameState.playerCount },
      (_, i) => this.createPlayerDisplay(i + 1)
    ).join("");
  }

  createPlayerDisplay(playerNumber) {
    const isActive = playerNumber === 1 ? " active" : "";
    return `
      <div class="player player${playerNumber}${isActive}" data-player="${playerNumber}">
        <h3>${this.gameState.playerNames[playerNumber]}</h3>
        <p>Очки: <span class="score">0</span></p>
      </div>
    `;
  }

  updateActivePlayer() {
    document.querySelectorAll(".player").forEach((player) => {
      player.classList.toggle(
        "active",
        player.getAttribute("data-player") ===
          this.gameState.currentPlayer.toString()
      );
    });
  }

  resetUI() {
    this.elements.gameBoard.innerHTML = "";
    this.elements.playerCountInput.value =
      GAME_SETTINGS.INITIAL_PLAYER_COUNT.toString();
    this.renderPlayerInputs();
    this.elements.setupContainer.style.display = "block";
    this.elements.playersContainer.style.display = "none";
    this.elements.gameBoard.style.display = "none";
    this.elements.resetButton.style.display = "none";
  }

  createTile(letter, handleClick) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("data-letter", letter);
    tile.addEventListener("click", handleClick);
    return tile;
  }

  appendTiles(tiles) {
    this.elements.gameBoard.innerHTML = "";
    tiles.forEach((tile) => this.elements.gameBoard.appendChild(tile));
  }
}
