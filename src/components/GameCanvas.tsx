'use client';

// ===========================================
// Game Canvas Component
// ===========================================

import { useEffect, useRef, useCallback } from 'react';
import { render, renderTitle } from '@/game/render';
import { initAudio, setMuted, playSound } from '@/game/audio';
import type { GameState, GameAction } from '@/game/types';

interface GameCanvasProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function GameCanvas({ state, dispatch }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stateRef = useRef<GameState>(state);
  const prevFloorRef = useRef<number>(1);
  const prevHpRef = useRef<number>(100);
  const prevChapterRef = useRef<number>(0);

  // Keep stateRef up to date
  stateRef.current = state;

  // Canvas setup (once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      return { dpr, width: rect.width, height: rect.height };
    };

    let { dpr, width, height } = setupCanvas();

    dispatch({ type: 'INIT', width, height });

    // Game loop - reads from stateRef to avoid stale closures
    const gameLoop = (timestamp: number) => {
      const deltaTime = lastTimeRef.current
        ? timestamp - lastTimeRef.current
        : 16;
      lastTimeRef.current = timestamp;

      const s = stateRef.current;

      if (s.status === 'playing') {
        dispatch({ type: 'TICK', deltaTime, timestamp: Date.now() });
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (s.status === 'title') {
        renderTitle(ctx, width, height, dpr);
      } else {
        render(ctx, s, dpr);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    const handleResize = () => {
      ({ dpr, width, height } = setupCanvas());
      dispatch({ type: 'RESIZE', width, height });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Sound effects based on state changes
  useEffect(() => {
    setMuted(state.muted);

    if (state.currentFloor > prevFloorRef.current) {
      playSound(state.combo >= 10 ? 'bigCoin' : 'coin');
    }
    prevFloorRef.current = state.currentFloor;

    if (state.player.hp < prevHpRef.current) {
      playSound('hit');
    }
    prevHpRef.current = state.player.hp;

    if (state.chapter > prevChapterRef.current && state.status === 'playing') {
      playSound('chapter');
    }
    prevChapterRef.current = state.chapter;

    if (state.status === 'gameover') {
      playSound('death');
    }
  }, [state.muted, state.currentFloor, state.combo, state.player.hp, state.chapter, state.status]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        initAudio();

        if (s.status === 'title') {
          dispatch({ type: 'START' });
          playSound('jump');
        } else if (s.status === 'playing') {
          if (s.player.grounded) playSound('jump');
          dispatch({ type: 'JUMP' });
        }
      }

      if (e.code === 'KeyM') {
        dispatch({ type: 'TOGGLE_MUTE' });
      }

      if (e.code === 'Escape') {
        if (s.status === 'playing') dispatch({ type: 'PAUSE' });
        else if (s.status === 'paused') dispatch({ type: 'RESUME' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Click / Tap input
  const handleClick = useCallback(() => {
    const s = stateRef.current;
    initAudio();

    if (s.status === 'title') {
      dispatch({ type: 'START' });
      playSound('jump');
    } else if (s.status === 'playing') {
      if (s.player.grounded) playSound('jump');
      dispatch({ type: 'JUMP' });
    }
  }, [dispatch]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'none',
        cursor: state.status === 'title' ? 'pointer' : 'default',
        imageRendering: 'pixelated',
      }}
    />
  );
}
