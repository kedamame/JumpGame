'use client';

// ===========================================
// HUD — Minimal, immersive (Jump King style)
// ===========================================

import type { GameState, FarcasterContext } from '@/game/types';
import { COMBO_THRESHOLD } from '@/game/constants';

interface HUDProps {
  state: GameState;
  farcasterContext: FarcasterContext;
  onMuteToggle: () => void;
}

export function HUD({ state, farcasterContext, onMuteToggle }: HUDProps) {
  if (state.status === 'title') {
    return null;
  }

  const isHighCombo = state.combo >= COMBO_THRESHOLD;

  const insets = farcasterContext.safeAreaInsets;
  const safeTop = typeof insets?.top === 'number' ? insets.top : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: `${safeTop + 8}px 12px 8px`,
        pointerEvents: 'none',
        fontFamily: 'monospace',
        color: '#bbb',
        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Score (left) */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '1px' }}>SCORE</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ccc' }}>
            {state.score.toLocaleString()}
          </div>
        </div>

        {/* Floor (center) */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '1px' }}>FLOOR</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#ddd',
            }}
          >
            {state.currentFloor}
          </div>
        </div>

        {/* Combo (right) */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '1px' }}>COMBO</div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isHighCombo ? '#d0b060' : '#ccc',
            }}
          >
            {state.combo}x
          </div>
        </div>
      </div>

      {/* Mute button */}
      <button
        onClick={onMuteToggle}
        style={{
          position: 'absolute',
          top: `${safeTop + 8}px`,
          right: '12px',
          marginTop: '50px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0',
          color: '#aaa',
          padding: '3px 6px',
          fontSize: '11px',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        {state.muted ? 'OFF' : 'SND'}
      </button>
    </div>
  );
}
