import { GAME_SETTINGS, alphabet } from "./constants.js";
import { createGameState } from "./state/gameState.js";
import { getElements } from "./dom/elements.js";
import { GameHandlers } from "./handlers/gameHandlers.js";
import { GameUI } from "./ui/gameUI.js";

export class Game {
  constructor() {
    this.gameState = createGameState();
    this.elements = getElements();
    this.ui = new GameUI(this.elements, this.gameState);
    this.handlers = new GameHandlers(this.gameState, this.elements, this.ui);
    this.handlers.setAlphabet(alphabet);
  }

  initialize() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.elements.setPlayersButton?.addEventListener(
      "click",
      this.handlers.handleSetPlayers
    );
    this.elements.startGameButton?.addEventListener(
      "click",
      this.handlers.handleStartGame
    );
    this.elements.resetButton?.addEventListener(
      "click",
      this.handlers.resetGame
    );
  }
}
