import sdk from "@farcaster/miniapp-sdk";

export type FarcasterContext = {
  inMiniApp: boolean;
  context: Awaited<ReturnType<typeof sdk.context>> | null;
  user: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
};

let cached: FarcasterContext | null = null;

export async function initFarcaster(): Promise<FarcasterContext> {
  if (cached) return cached;

  const inMiniApp = await sdk.isInMiniApp();
  let context = null;
  let user = null;

  if (inMiniApp) {
    context = await sdk.context();
    user = context?.user
      ? {
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl
        }
      : null;

    await sdk.actions.ready();
  }

  cached = { inMiniApp, context, user };
  return cached;
}
