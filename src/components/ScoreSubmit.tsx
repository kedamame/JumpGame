'use client';

// ===========================================
// Score Submit Component (On-chain)
// ===========================================

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import type { ScoreData, FarcasterContext } from '@/game/types';
import { SCOREBOARD_ABI } from '@/abi/Scoreboard';
import {
  SCOREBOARD_ADDRESS,
  getBaseScanUrl,
  isContractConfigured,
} from '@/lib/wagmi';

interface ScoreSubmitProps {
  scoreData: ScoreData;
  farcasterContext: FarcasterContext;
}

export function ScoreSubmit({ scoreData, farcasterContext }: ScoreSubmitProps) {
  const { isConnected, address } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Transaction failed');
    }
  }, [writeError]);

  const handleSubmit = () => {
    setError(null);

    if (!isContractConfigured()) {
      setError('Contract not configured. Check NEXT_PUBLIC_SCOREBOARD_ADDRESS');
      return;
    }

    const fid = farcasterContext.fid || 0;

    try {
      writeContract({
        address: SCOREBOARD_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: 'submitScore',
        args: [
          BigInt(scoreData.score),
          BigInt(scoreData.maxFloor),
          BigInt(scoreData.maxCombo),
          BigInt(fid),
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Not connected - show message
  if (!isConnected) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ color: '#888', marginBottom: '10px' }}>
          Connect wallet to save score on Base
        </div>
      </div>
    );
  }

  // Transaction confirmed
  if (isConfirmed && txHash) {
    return (
      <div
        style={{
          background: 'rgba(74, 222, 128, 0.2)',
          border: '1px solid #4ade80',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ color: '#4ade80', marginBottom: '10px', fontSize: '18px' }}>
          Score saved on Base!
        </div>
        <a
          href={getBaseScanUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#60a5fa',
            textDecoration: 'underline',
          }}
        >
          View on BaseScan
        </a>
      </div>
    );
  }

  // Transaction pending
  if (isWriting || isConfirming) {
    return (
      <div
        style={{
          background: 'rgba(96, 165, 250, 0.2)',
          border: '1px solid #60a5fa',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ color: '#60a5fa', marginBottom: '5px' }}>
          {isWriting ? 'Confirm in wallet...' : 'Confirming transaction...'}
        </div>
        <div
          style={{
            width: '30px',
            height: '30px',
            border: '3px solid #60a5fa',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '10px auto',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        marginBottom: '10px',
      }}
    >
      {/* Connected address */}
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
        {address?.slice(0, 6)}...{address?.slice(-4)}
        {farcasterContext.fid && (
          <span style={{ marginLeft: '10px', color: '#a855f7' }}>
            FID: {farcasterContext.fid}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '10px',
            maxWidth: '300px',
            wordBreak: 'break-word',
          }}
        >
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isContractConfigured()}
        style={{
          background: isContractConfigured() ? '#8b5cf6' : '#666',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: isContractConfigured() ? 'pointer' : 'not-allowed',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 auto',
        }}
      >
        <span style={{ fontSize: '20px' }}>⬡</span>
        Save to Base
      </button>

      {!isContractConfigured() && (
        <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          Contract not deployed yet
        </div>
      )}
    </div>
  );
}
