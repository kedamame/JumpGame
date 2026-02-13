// ===========================================
// Wagmi Configuration for Base Mainnet
// ===========================================

import { http, createConfig, createStorage } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Contract address from environment
export const SCOREBOARD_ADDRESS = (process.env.NEXT_PUBLIC_SCOREBOARD_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Base mainnet RPC
const baseRpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

/**
 * Create wagmi config for web (non-Mini App) environment
 */
export function createWebConfig() {
  const connectors = [injected()];

  // Add WalletConnect if project ID is available
  const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (wcProjectId) {
    // WalletConnect would be added here if needed
    // For now, we rely on injected wallets
  }

  return createConfig({
    chains: [base],
    connectors,
    transports: {
      [base.id]: http(baseRpcUrl),
    },
    storage: createStorage({
      storage:
        typeof window !== 'undefined' ? window.localStorage : undefined,
    }),
  });
}

/**
 * Create wagmi config for Farcaster Mini App environment
 */
export async function createMiniAppConfig() {
  try {
    const { farcasterFrame } = await import(
      '@farcaster/miniapp-wagmi-connector'
    );

    return createConfig({
      chains: [base],
      connectors: [farcasterFrame()],
      transports: {
        [base.id]: http(baseRpcUrl),
      },
      storage: createStorage({
        storage:
          typeof window !== 'undefined' ? window.localStorage : undefined,
      }),
    });
  } catch (error) {
    console.warn('Failed to load Farcaster connector, falling back to web config:', error);
    return createWebConfig();
  }
}

/**
 * Default config for SSR (will be replaced on client)
 */
export const defaultConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(baseRpcUrl),
  },
  ssr: true,
});

/**
 * BaseScan URL for transaction links
 */
export function getBaseScanUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * Check if contract address is configured
 */
export function isContractConfigured(): boolean {
  return (
    SCOREBOARD_ADDRESS !== '0x0000000000000000000000000000000000000000' &&
    SCOREBOARD_ADDRESS.startsWith('0x')
  );
}
