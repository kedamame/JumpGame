# Tower Jump - Farcaster Mini App

An endless tower climbing game built as a Farcaster Mini App with on-chain score storage on Base mainnet.

![Tower Jump](./docs/preview.png)

## Features

- **Endless Tower Climbing**: Jump through procedurally generated floors with increasing difficulty
- **6 Chapter System**: Each 50 floors brings new visuals and gimmicks (Stone Tower, Mechanical Factory, Lava Depths, Frozen Spire, Forest Ruins, Void Dimension)
- **Combo System**: Reach floors within 5 seconds to build combos; 10+ combo = 1.5x score multiplier with enhanced effects
- **6 Gimmick Types**: Slide doors, rotating bars, presses, lasers, spikes, and flames
- **On-chain Scores**: Best scores stored on Base mainnet via smart contract
- **Farcaster Integration**: Full Mini App support with wallet connection and FID tracking
- **2.5D Pixel Art**: Procedurally generated isometric graphics (no external images)
- **WebAudio Sound Effects**: Jump, coin, hit, death sounds with mute toggle

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or other Web3 wallet (for score submission)

### Installation

```bash
# Clone and install
git clone <your-repo-url>
cd JumpGame
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Controls

- **Space / Enter / Tap / Click**: Jump
- **M**: Toggle mute
- **ESC**: Pause/Resume
- **JUMP button**: Mobile jump (bottom right)

## Farcaster Mini App Setup

### 1. Deploy to a Public URL

Deploy to Vercel, Netlify, or your preferred hosting:

```bash
# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

Update `NEXT_PUBLIC_APP_URL` in `.env` with your deployed URL.

### 2. Generate Account Association Signature

The Farcaster manifest requires a signed account association to verify app ownership.

#### Using Warpcast Developer Tools:

1. Go to [Warpcast Developer Tools](https://warpcast.com/~/developers)
2. Navigate to "Mini Apps" section
3. Enter your app's domain (e.g., `your-app.vercel.app`)
4. Sign the message with your custody wallet
5. Copy the generated `header`, `payload`, and `signature`

#### Using Base Build CLI:

```bash
# Install Base Build CLI
npm install -g @base-org/build-cli

# Generate signature (requires your Farcaster custody wallet)
base-build miniapp sign --domain your-app.vercel.app
```

### 3. Update the Manifest

Edit `app/.well-known/farcaster.json/route.ts`:

```typescript
accountAssociation: {
  header: 'YOUR_SIGNED_HEADER',
  payload: 'YOUR_SIGNED_PAYLOAD',
  signature: 'YOUR_SIGNATURE',
},
```

### 4. Verify Manifest

Visit `https://your-app.vercel.app/.well-known/farcaster.json` to verify the manifest is served correctly.

### 5. Test in Warpcast

1. Open Warpcast on mobile
2. Navigate to your app's URL
3. The Mini App should load with the splash screen
4. If it doesn't work, check:
   - Manifest is accessible at `/.well-known/farcaster.json`
   - Account association signature is valid
   - `requiredCapabilities` match host capabilities

### Debug Tool

Use the [Farcaster Mini App Debug Tool](https://mini-app-debugger.vercel.app) to:
- Validate your manifest
- Test frame rendering
- Debug wallet connections

## Base Mainnet Contract Deployment

### Contract Details

The `Scoreboard` contract stores player best scores with:
- `submitScore(score, maxFloor, maxCombo, fid)`: Submit a new score
- `best(address)`: Get player's best score record
- Events: `ScoreSubmitted` for indexing

#### Limits (with rationale):
- `MAX_SCORE`: 1 billion (theoretical max with 100k floors at max bonuses)
- `MAX_FLOOR`: 100,000 (extremely high but achievable)
- `MAX_COMBO`: 10,000 (reasonable combo ceiling)

### Deploy with Foundry (Recommended)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Initialize Foundry
forge init --no-commit

# Copy contract to Foundry structure
cp contracts/Scoreboard.sol src/

# Compile
forge build

# Deploy to Base mainnet
forge create --rpc-url https://mainnet.base.org \
  --private-key $DEPLOYER_PRIVATE_KEY \
  src/Scoreboard.sol:Scoreboard
```

### Deploy with Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create new file `Scoreboard.sol` with contract code from `contracts/Scoreboard.sol`
3. Compile with Solidity 0.8.20+
4. Deploy:
   - Environment: "Injected Provider - MetaMask"
   - Network: Base Mainnet (chainId 8453)
   - Click "Deploy"
5. Copy deployed address to `.env`

### After Deployment

```bash
# Update .env
NEXT_PUBLIC_SCOREBOARD_ADDRESS=0xYourContractAddress

# Rebuild and redeploy frontend
npm run build
```

## Embed Meta Tag

The game page includes an `fc:miniapp` meta tag for embedding:

```html
<meta name="fc:miniapp" content='{"version":"next","name":"Tower Jump",...}' />
```

This enables the game to be shared and launched directly in Farcaster clients.

## Project Structure

```
JumpGame/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with meta tags
│   ├── page.tsx             # Main game page
│   ├── globals.css          # Global styles
│   ├── .well-known/farcaster.json/  # Farcaster manifest
│   ├── icon/                # Dynamic icon generation
│   ├── opengraph-image/     # OG image generation
│   └── splash/              # Splash screen image
├── src/
│   ├── abi/                 # Contract ABIs
│   ├── components/          # React components
│   │   ├── GameCanvas.tsx   # Main canvas renderer
│   │   ├── HUD.tsx          # Score/combo display
│   │   ├── Overlay.tsx      # Pause/game over screens
│   │   ├── ScoreSubmit.tsx  # On-chain submission
│   │   └── WalletPanel.tsx  # Wallet connection
│   ├── game/                # Game logic
│   │   ├── audio.ts         # WebAudio sound effects
│   │   ├── chapters.ts      # Chapter definitions
│   │   ├── constants.ts     # Game constants
│   │   ├── gimmicks.ts      # Gimmick logic
│   │   ├── logic.ts         # Core game logic
│   │   ├── render.ts        # 2.5D Canvas rendering
│   │   ├── state.ts         # State reducer
│   │   └── types.ts         # TypeScript types
│   ├── lib/                 # Libraries
│   │   ├── farcaster.ts     # Farcaster SDK wrapper
│   │   └── wagmi.ts         # Wagmi config
│   └── providers/           # React providers
├── contracts/               # Solidity contracts
├── scripts/                 # Deployment scripts
├── tests/                   # Vitest tests
└── .env.example            # Environment template
```

## Testing

```bash
# Run all tests
npm test

# Run tests once
npm run test:run

# Test coverage
npm test -- --coverage
```

## Customization Points

### Scoring
- `BASE_SCORE_PER_FLOOR`: Points per floor (default: 100)
- `CHAPTER_SCORE_BONUS`: Additional points per chapter (default: +50)
- `COMBO_MULTIPLIER`: Multiplier at 10+ combo (default: 1.5x)
- `COMBO_THRESHOLD`: Combo needed for multiplier (default: 10)
- `COMBO_TIMEOUT_MS`: Time to maintain combo (default: 5000ms)

### Difficulty
- `FLOORS_PER_CHAPTER`: Floors before chapter change (default: 50)
- Chapter `speedMultiplier`: Gimmick speed scaling per chapter
- Gimmick phase timings in `gimmicks.ts`

### HP/Damage
- `PLAYER_MAX_HP`: Starting HP (default: 100)
- `DAMAGE_LIGHT`: Light damage (default: 10)
- `DAMAGE_MEDIUM`: Medium damage (default: 20)
- `DAMAGE_HEAVY`: Heavy damage (default: 30)

### Visuals
- Chapter palettes in `chapters.ts`
- Rendering functions in `render.ts`
- Particle counts in `constants.ts`

## Common Issues

### "Manifest not found"
- Ensure `app/.well-known/farcaster.json/route.ts` exists
- Check the URL: `https://your-app/.well-known/farcaster.json`

### "Invalid account association"
- Re-sign with the correct custody wallet
- Verify domain matches exactly (no trailing slash)

### "Wallet not connecting in Mini App"
- Ensure `@farcaster/miniapp-wagmi-connector` is installed
- Check that `sdk.actions.ready()` is called

### "Contract call fails"
- Verify `NEXT_PUBLIC_SCOREBOARD_ADDRESS` is set
- Ensure wallet is on Base mainnet (chainId 8453)
- Check contract is deployed and verified

### "Score not updating"
- Contract only updates if new score > current best
- Check transaction on BaseScan for errors

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Rendering**: HTML5 Canvas
- **Audio**: WebAudio API
- **State**: React useReducer
- **Web3**: wagmi + viem
- **Chain**: Base Mainnet
- **SDK**: @farcaster/miniapp-sdk
- **Testing**: Vitest

## License

MIT

## Credits

Built for Farcaster on Base.
