'use client';

// ===========================================
// App Providers (Wagmi + React Query)
// ===========================================

import { useState, useEffect, type ReactNode } from 'react';
import { WagmiProvider, type Config } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initFarcasterSDK } from '@/lib/farcaster';
import { createWebConfig, createMiniAppConfig, defaultConfig } from '@/lib/wagmi';
import { GameProvider } from './GameProvider';
import type { FarcasterContext } from '@/game/types';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [wagmiConfig, setWagmiConfig] = useState<Config>(defaultConfig);
  const [inMiniApp, setInMiniApp] = useState(false);
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      // Initialize Farcaster SDK
      const { inMiniApp: isMiniApp, context } = await initFarcasterSDK();
      setInMiniApp(isMiniApp);
      setFarcasterContext(context);

      // Create appropriate wagmi config
      const config = isMiniApp
        ? await createMiniAppConfig()
        : createWebConfig();
      setWagmiConfig(config);

      setIsInitialized(true);
    }

    init();
  }, []);

  // Show loading until initialized
  if (!isInitialized) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #4a90d9',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div>Loading...</div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GameProvider farcasterContext={farcasterContext} inMiniApp={inMiniApp}>
          {children}
        </GameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
