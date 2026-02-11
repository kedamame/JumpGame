"use client";

import { useEffect, useMemo, useState } from "react";
import { GameCanvas } from "@/components/GameCanvas";
import { HUD } from "@/components/HUD";
import { Overlay } from "@/components/Overlay";
import { WalletPanel } from "@/components/WalletPanel";
import { initFarcaster } from "@/lib/farcaster";
import type { FarcasterContext } from "@/lib/farcaster";
import { GameProvider } from "@/providers/GameProvider";

export default function Page() {
  const [fc, setFc] = useState<FarcasterContext | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ctx = await initFarcaster();
      if (!alive) return;
      setFc(ctx);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const safeInsets = useMemo(() => {
    if (!fc?.context?.client?.safeAreaInsets) return { top: 0, bottom: 0, left: 0, right: 0 };
    return fc.context.client.safeAreaInsets;
  }, [fc]);

  return (
    <main
      style={{
        paddingTop: safeInsets.top,
        paddingBottom: safeInsets.bottom,
        paddingLeft: safeInsets.left,
        paddingRight: safeInsets.right
      }}
      className="page"
    >
      <div className="container">
        <header className="header">
          <div className="title">Tower Jump</div>
          <div className="subtitle">
            2.5D voxel tower climb ? Farcaster Mini App
          </div>
        </header>

        <GameProvider>
          <section className="game-area">
            <GameCanvas farcaster={fc} ready={ready} />
            <HUD />
            <Overlay farcaster={fc} />
          </section>

          <section className="panel">
            <WalletPanel farcaster={fc} />
          </section>
        </GameProvider>
      </div>
    </main>
  );
}
