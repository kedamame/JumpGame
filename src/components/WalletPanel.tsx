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
          WalletConnectÇÕñ¢ê›íËÇ≈Ç∑ÅB`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` Ç™ñ≥Ç¢èÍçáÇÕ injected ÇæÇØÇ≈óVÇ◊Ç‹Ç∑ÅB
        </div>
      )}
    </div>
  );
}
