'use client';

// ===========================================
// Wallet Connection Panel
// ===========================================

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { FarcasterContext } from '@/game/types';

interface WalletPanelProps {
  inMiniApp: boolean;
  farcasterContext: FarcasterContext;
}

function toSafeNum(v: unknown): number {
  return typeof v === 'number' && isFinite(v) ? v : 0;
}

export function WalletPanel({ inMiniApp, farcasterContext }: WalletPanelProps) {
  const { isConnected, address, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const safeBottom = toSafeNum(farcasterContext?.safeAreaInsets?.bottom);

  if (isConnected) {
    const addrStr = typeof address === 'string' ? address : '';

    return (
      <div
        style={{
          position: 'absolute',
          bottom: String(safeBottom + 10) + 'px',
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#fff',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: chain?.id === 8453 ? '#4ade80' : '#fbbf24',
          }}
        />

        <span>
          {addrStr.slice(0, 6)}...{addrStr.slice(-4)}
        </span>

        {typeof farcasterContext?.username === 'string' && (
          <span style={{ color: '#a855f7' }}>
            @{farcasterContext.username}
          </span>
        )}

        <button
          onClick={() => disconnect()}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            color: '#888',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Filter to connectors with a valid string name
  const safeConnectors = (Array.isArray(connectors) ? connectors : []).filter(
    (c): c is (typeof connectors)[number] => !!c && typeof c.name === 'string'
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: String(safeBottom + 10) + 'px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
        padding: '10px',
        fontFamily: 'monospace',
      }}
    >
      {inMiniApp ? (
        <button
          onClick={() => {
            const connector = connectors[0];
            if (connector) connect({ connector });
          }}
          disabled={isPending}
          style={{
            background: '#8b5cf6',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            padding: '10px 16px',
            fontSize: '14px',
            cursor: isPending ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            Connect to save scores
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {safeConnectors.map((connector, i) => (
              <button
                key={String(connector.uid ?? i)}
                onClick={() => connect({ connector })}
                disabled={isPending}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px 12px',
                  fontSize: '13px',
                  cursor: isPending ? 'wait' : 'pointer',
                  textAlign: 'left' as const,
                }}
              >
                {String(connector.name)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
