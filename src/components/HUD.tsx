"use client";

import { useGame } from "@/providers/GameProvider";

export function HUD() {
  const { state } = useGame();
  const hpPct = (state.hp / state.maxHp) * 100;

  return (
    <div className="hud">
      <div className="row">
        <div>
          Score: {state.displayScore}
          <div className="bar">
            <div style={{ width: `${hpPct}%` }} />
          </div>
        </div>
        <div>Combo: {state.combo}</div>
      </div>
      <div className="center">
        Floor {state.floor} ? {state.chapterName}
      </div>
    </div>
  );
}
