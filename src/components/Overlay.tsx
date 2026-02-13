'use client';

// ===========================================
// Game Overlay — Dark, flat, minimal pixel style
// ===========================================

import type { GameState, FarcasterContext, ScoreData } from '@/game/types';
import { ScoreSubmit } from './ScoreSubmit';

interface OverlayProps {
  state: GameState;
  farcasterContext: FarcasterContext;
  onResume: () => void;
  onRestart: () => void;
}

export function Overlay({
  state,
  farcasterContext,
  onResume,
  onRestart,
}: OverlayProps) {
  if (state.status !== 'paused' && state.status !== 'gameover') {
    return null;
  }

  const isPaused = state.status === 'paused';

  const scoreData: ScoreData = {
    score: state.score,
    maxFloor: state.maxFloor,
    maxCombo: state.maxCombo,
  };

  const btnBase: React.CSSProperties = {
    background: '#2a2a3a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0',
    color: '#aaa',
    padding: '10px 24px',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    letterSpacing: '1px',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: '#ccc',
        padding: '20px',
        zIndex: 100,
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: '24px',
          marginBottom: '6px',
          color: isPaused ? '#888' : '#6a3a3a',
          letterSpacing: '3px',
          fontWeight: 'normal',
        }}
      >
        {isPaused ? 'PAUSED' : 'GAME OVER'}
      </h1>

      {/* Decorative line */}
      <div
        style={{
          width: '60px',
          height: '1px',
          background: 'rgba(255,255,255,0.15)',
          marginBottom: '20px',
        }}
      />

      {/* Stats */}
      {!isPaused && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>SCORE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>
              {state.score.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>FLOOR</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>
              {state.maxFloor}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>COMBO</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>
              {state.maxCombo}x
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>CHAPTER</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>
              {state.chapter + 1}
            </div>
          </div>
        </div>
      )}

      {/* Score Submit (Game Over only) */}
      {!isPaused && (
        <ScoreSubmit scoreData={scoreData} farcasterContext={farcasterContext} />
      )}

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '16px',
        }}
      >
        {isPaused && (
          <button
            onClick={onResume}
            style={{ ...btnBase, background: '#3a3a4a', color: '#ccc' }}
          >
            RESUME
          </button>
        )}

        <button
          onClick={onRestart}
          style={isPaused ? btnBase : { ...btnBase, background: '#3a3a4a', color: '#ccc' }}
        >
          {isPaused ? 'RESTART' : 'RETRY'}
        </button>
      </div>

      {/* Instructions */}
      {isPaused && (
        <div
          style={{
            marginTop: '16px',
            fontSize: '10px',
            color: '#444',
          }}
        >
          ESC to resume
        </div>
      )}
    </div>
  );
}
