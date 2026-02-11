"use client";

import { useMemo, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppConfig } from "@/lib/wagmi";
import { initFarcaster } from "@/lib/farcaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [inMiniApp, setInMiniApp] = useState(false);
  const [wcProjectId] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  );

  useEffect(() => {
    (async () => {
      const ctx = await initFarcaster();
      setInMiniApp(ctx.inMiniApp);
    })();
  }, []);

  const config = useMemo(() => {
    return createAppConfig(inMiniApp, wcProjectId);
  }, [inMiniApp, wcProjectId]);

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
