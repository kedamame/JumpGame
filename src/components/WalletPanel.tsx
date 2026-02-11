"use client";

import type { FarcasterContext } from "@/lib/farcaster";
import { ScoreSubmit } from "@/components/ScoreSubmit";

export function WalletPanel({ farcaster }: { farcaster: FarcasterContext | null }) {
  const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  return (
    <div>
      <ScoreSubmit farcaster={farcaster} />

      {!farcaster?.inMiniApp && !wcProjectId && (
        <div style={{ marginTop: 8, color: "#aab0c0" }}>
          WalletConnect is not configured. You can still play with an injected wallet.
        </div>
      )}
    </div>
  );
}
