import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

export function createAppConfig(inMiniApp: boolean, wcProjectId?: string) {
  const transports = { [base.id]: http() };

  const connectors = inMiniApp
    ? [farcasterMiniApp()]
    : [
        injected(),
        ...(wcProjectId ? [walletConnect({ projectId: wcProjectId })] : [])
      ];

  return createConfig({
    chains: [base],
    transports,
    connectors,
    ssr: true
  });
}
