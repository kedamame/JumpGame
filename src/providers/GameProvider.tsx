'use client';

// ===========================================
// Game State Provider
// ===========================================

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { GameState, GameAction, FarcasterContext } from '@/game/types';
import { gameReducer } from '@/game/state';
import { createInitialState } from '@/game/logic';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  farcasterContext: FarcasterContext;
  inMiniApp: boolean;
  restart: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: ReactNode;
  farcasterContext: FarcasterContext;
  inMiniApp: boolean;
}

export function GameProvider({
  children,
  farcasterContext,
  inMiniApp,
}: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { width: 400, height: 600 },
    ({ width, height }) => createInitialState(width, height)
  );

  const restart = useCallback(() => {
    dispatch({ type: 'START' });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        farcasterContext,
        inMiniApp,
        restart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
