// ===========================================
// Game State Reducer
// ===========================================

import type { GameState, GameAction } from './types';
import {
  createInitialState,
  startGame,
  applyJump,
  gameTick,
} from './logic';

/**
 * Game state reducer - handles all game actions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT':
      return createInitialState(action.width, action.height);

    case 'START':
      return startGame(state);

    case 'JUMP':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        player: applyJump(state.player),
      };

    case 'TICK':
      return gameTick(state, action.deltaTime, action.timestamp);

    case 'TOGGLE_MUTE':
      return {
        ...state,
        muted: !state.muted,
      };

    case 'PAUSE':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        status: 'paused',
      };

    case 'RESUME':
      if (state.status !== 'paused') return state;
      return {
        ...state,
        status: 'playing',
      };

    case 'GAME_OVER':
      return {
        ...state,
        status: 'gameover',
      };

    case 'RESIZE':
      return {
        ...state,
        canvasWidth: action.width,
        canvasHeight: action.height,
      };

    default:
      return state;
  }
}
