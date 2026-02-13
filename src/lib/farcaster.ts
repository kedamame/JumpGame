// ===========================================
// Farcaster Mini App SDK Integration
// ===========================================

import type { FarcasterContext } from '@/game/types';

// SDK type (we'll use dynamic import for the actual SDK)
type MiniAppSDK = {
  isInMiniApp: () => Promise<boolean>;
  actions: {
    ready: () => Promise<void>;
  };
  context?: {
    user?: {
      fid?: number;
      username?: string;
      displayName?: string;
      pfpUrl?: string;
    };
    client?: {
      safeAreaInsets?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
    };
  };
  wallet?: {
    getEthereumProvider: () => Promise<unknown>;
  };
};

let sdk: MiniAppSDK | null = null;
let isInitialized = false;
let inMiniApp = false;

/**
 * Initialize the Farcaster SDK
 * Must be called on client side only
 */
export async function initFarcasterSDK(): Promise<{
  inMiniApp: boolean;
  context: FarcasterContext;
}> {
  if (typeof window === 'undefined') {
    return { inMiniApp: false, context: {} };
  }

  if (isInitialized && sdk) {
    return {
      inMiniApp,
      context: extractContext(sdk),
    };
  }

  try {
    // Dynamic import to avoid SSR issues
    const miniappSdk = await import('@farcaster/miniapp-sdk');
    const sdkInstance = miniappSdk.sdk;
    sdk = sdkInstance as unknown as MiniAppSDK;

    // Check if we're in a Mini App environment
    inMiniApp = await sdkInstance.isInMiniApp();

    if (inMiniApp) {
      // Signal that app is ready (removes splash screen)
      await sdkInstance.actions.ready();
    }

    isInitialized = true;

    return {
      inMiniApp,
      context: extractContext(sdk),
    };
  } catch (error) {
    console.warn('Farcaster SDK initialization failed:', error);
    isInitialized = true;
    return { inMiniApp: false, context: {} };
  }
}

/**
 * Extract context from SDK
 */
function extractContext(sdkInstance: MiniAppSDK): FarcasterContext {
  if (!sdkInstance.context) return {};

  const user = sdkInstance.context.user;
  const client = sdkInstance.context.client;

  return {
    fid: user?.fid,
    username: user?.username,
    displayName: user?.displayName,
    pfpUrl: user?.pfpUrl,
    safeAreaInsets: client?.safeAreaInsets,
  };
}

/**
 * Get the current SDK instance
 */
export function getSDK(): MiniAppSDK | null {
  return sdk;
}

/**
 * Check if running in Mini App
 */
export function isInMiniApp(): boolean {
  return inMiniApp;
}

/**
 * Get current Farcaster context
 */
export function getFarcasterContext(): FarcasterContext {
  if (!sdk) return {};
  return extractContext(sdk);
}

/**
 * Get user's FID (Farcaster ID)
 */
export function getUserFid(): number {
  return sdk?.context?.user?.fid ?? 0;
}

/**
 * Get safe area insets for UI positioning
 */
export function getSafeAreaInsets(): FarcasterContext['safeAreaInsets'] {
  return sdk?.context?.client?.safeAreaInsets;
}
