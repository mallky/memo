import { GAME_SETTINGS } from "../constants.js";

export const createGameState = () => ({
  tiles: [],
  flippedTiles: [],
  currentPlayer: 1,
  scores: {},
  playerCount: GAME_SETTINGS.INITIAL_PLAYER_COUNT,
  playerNames: {},
});
