"use client";

import type { FarcasterContext } from "@/lib/farcaster";
import { useGame } from "@/providers/GameProvider";
import { ScoreSubmit } from "@/components/ScoreSubmit";

export function Overlay({ farcaster }: { farcaster: FarcasterContext | null }) {
  const { state } = useGame();

  if (!state.gameOver) return null;

  return (
    <div className="overlay">
      <div className="card">
        <div style={{ fontSize: 20, fontWeight: 700 }}>Game Over</div>
        <div style={{ marginTop: 8 }}>
          Score {state.score} ? Floor {state.maxFloor} ? Combo {state.maxCombo}
        </div>
        <div style={{ marginTop: 12 }}>
          <ScoreSubmit farcaster={farcaster} compact />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => location.reload()}>Restart</button>
        </div>
      </div>
    </div>
  );
}
