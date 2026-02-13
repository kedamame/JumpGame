'use client';

// ===========================================
// Main Game Page
// ===========================================

import { AppProviders } from '@/providers/AppProviders';
import { GameCanvas } from '@/components/GameCanvas';
import { HUD } from '@/components/HUD';
import { Overlay } from '@/components/Overlay';
import { WalletPanel } from '@/components/WalletPanel';
import { useGame } from '@/providers/GameProvider';

function GameContent() {
  const { state, dispatch, farcasterContext, inMiniApp, restart } = useGame();

  const handleMuteToggle = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const handleResume = () => {
    dispatch({ type: 'RESUME' });
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Game Canvas */}
      <GameCanvas state={state} dispatch={dispatch} />

      {/* HUD */}
      <HUD
        state={state}
        farcasterContext={farcasterContext}
        onMuteToggle={handleMuteToggle}
      />

      {/* Overlay (Pause/Game Over) */}
      <Overlay
        state={state}
        farcasterContext={farcasterContext}
        onResume={handleResume}
        onRestart={restart}
      />

      {/* Wallet Panel */}
      <WalletPanel inMiniApp={inMiniApp} farcasterContext={farcasterContext} />

      {/* Jump Button (Mobile) */}
      {state.status === 'playing' && (
        <button
          onClick={() => dispatch({ type: 'JUMP' })}
          style={{
            position: 'absolute',
            bottom: `${(typeof farcasterContext.safeAreaInsets?.bottom === 'number' ? farcasterContext.safeAreaInsets.bottom : 0) + 20}px`,
            right: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(74, 144, 217, 0.8)',
            border: '3px solid rgba(255, 255, 255, 0.5)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          JUMP
        </button>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AppProviders>
      <GameContent />
    </AppProviders>
  );
}
