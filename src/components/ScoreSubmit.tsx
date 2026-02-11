"use client";

import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { scoreboardAbi } from "@/abi/Scoreboard";
import type { FarcasterContext } from "@/lib/farcaster";
import { base } from "wagmi/chains";
import { useState } from "react";
import { useGame } from "@/providers/GameProvider";

const SCOREBOARD_ADDRESS =
  (process.env.NEXT_PUBLIC_SCOREBOARD_ADDRESS as `0x${string}` | undefined) ??
  "0x0000000000000000000000000000000000000000";

export function ScoreSubmit({
  farcaster,
  compact
}: {
  farcaster: FarcasterContext | null;
  compact?: boolean;
}) {
  const { state } = useGame();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fid = farcaster?.user?.fid ?? 0;

  const { writeContract, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined
  });

  const sendScore = async () => {
    setError(null);
    try {
      const hash = await writeContract({
        address: SCOREBOARD_ADDRESS,
        abi: scoreboardAbi,
        functionName: "submitScore",
        chainId: base.id,
        args: [
          BigInt(state.score),
          BigInt(state.maxFloor),
          BigInt(state.maxCombo),
          BigInt(fid)
        ]
      });
      setTxHash(hash);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="controls">
        {!isConnected && (
          <button
            onClick={() => {
              const preferred = connectors[0];
              connect({ connector: preferred });
            }}
            disabled={isPending}
          >
            {farcaster?.inMiniApp ? "Connect Farcaster Wallet" : "Connect Wallet"}
          </button>
        )}
        {isConnected && (
          <button onClick={sendScore} disabled={isWriting || SCOREBOARD_ADDRESS === "0x0000000000000000000000000000000000000000"}>
            Base‚É“o˜^
          </button>
        )}
      </div>

      {!compact && (
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="badge">Address: {address ?? "Not connected"}</div>
          <div className="badge">FID: {fid}</div>
        </div>
      )}

      {SCOREBOARD_ADDRESS === "0x0000000000000000000000000000000000000000" && (
        <div style={{ marginTop: 8, color: "#ff6b6b" }}>
          Set NEXT_PUBLIC_SCOREBOARD_ADDRESS in .env for live submissions.
        </div>
      )}

      {isWriting && <div style={{ marginTop: 8 }}>Sending transaction...</div>}
      {isConfirming && <div style={{ marginTop: 8 }}>Confirming on Base...</div>}
      {isSuccess && txHash && (
        <div style={{ marginTop: 8 }}>
          Success: basescan.org/tx/{txHash}
        </div>
      )}
      {error && <div style={{ marginTop: 8, color: "#ff6b6b" }}>Error: {error}</div>}
    </div>
  );
}
