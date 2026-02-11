# Tower Jump (Farcaster Mini App)

2.5D voxel-style endless tower climb game for Farcaster Mini App.

## Local Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Farcaster Mini App Setup
1. Deploy the app and set `NEXT_PUBLIC_APP_URL` to the public URL.
2. The manifest is served at `/.well-known/farcaster.json` by `app/.well-known/farcaster.json/route.ts`.
3. The embed meta tag is injected via `app/head.tsx` with `fc:miniapp` JSON.
4. `homeUrl` must point to a page that includes the embed meta.

### accountAssociation
The manifest contains placeholder values. You must sign and replace them.
1. Use Base Build or another Farcaster tool to generate account association.
2. Replace `accountAssociation.header`, `payload`, `signature` in `app/.well-known/farcaster.json/route.ts`.
3. Redeploy.

### Debug Tips
1. Use the Farcaster Mini App debug tool to validate manifest and embed.
2. Confirm `actions.ready` is called (this app calls it in `src/lib/farcaster.ts`).
3. Verify `requiredCapabilities` includes `wallet.getEthereumProvider` and `actions.ready`.

## Base Mainnet Score Contract
`contracts/Scoreboard.sol` contains the on-chain best-score storage.

### MAX_* rationale
- `MAX_SCORE = 1_000_000_000` supports long sessions without overflow risk.
- `MAX_FLOOR = 1_000_000` allows extremely deep runs.
- `MAX_COMBO = 10_000` allows long streaks without unrealistic size.

### Deploy (Base mainnet)
1. Compile contract and create artifacts:
   - Create `artifacts/Scoreboard.abi.json` and `artifacts/Scoreboard.bin`.
   - Use your preferred compiler (solc, Foundry, etc.).
2. Set env:
   - `BASE_RPC_URL`
   - `DEPLOYER_PRIVATE_KEY`
3. Run:
   - `node scripts/deploy.ts`

### Frontend Transaction
- Set `NEXT_PUBLIC_SCOREBOARD_ADDRESS` to the deployed address.
- Game Over screen shows `Submit To Base`.
- Transaction uses `writeContract` with Base chainId 8453.
- Success shows BaseScan URL.

## Controls
- Jump: Space / Enter / Tap / JUMP button
- Player stays centered. Only vertical movement.

## Scoring
- Base per floor: 100 + 50 per chapter (50 floors).
- Combo: within 5 seconds to keep.
- Combo bonus: 10+ gives 1.5x (floor bonus uses `Math.floor`).

## Known Pitfalls
1. `NEXT_PUBLIC_APP_URL` must be set on production.
2. Missing `actions.ready` causes mini app to stay on splash.
3. WalletConnect requires `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
4. If `NEXT_PUBLIC_SCOREBOARD_ADDRESS` is unset, score submission is disabled.
