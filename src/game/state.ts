import { GAME } from "./constants";
import { advanceFloors, applyCombo, baseScoreForFloor, canPassGate, getChapter, makeInitialFloors, shouldKeepCombo } from "./logic";
import type { CoinParticle, GameAction, GameState } from "./types";

const initialChapter = getChapter(0);

export const initialState: GameState = {
  running: false,
  gameOver: false,
  score: 0,
  displayScore: 0,
  combo: 0,
  maxCombo: 0,
  floor: 0,
  maxFloor: 0,
  hp: GAME.maxHp,
  maxHp: GAME.maxHp,
  lastFloorAt: 0,
  chapterIndex: 0,
  chapterName: initialChapter.name,
  chapterFlash: 0,
  velocity: 0,
  playerY: 0,
  floors: makeInitialFloors(),
  cameraY: 0,
  coins: [],
  shake: 0,
  muted: false,
  lastDamageAt: 0,
  lastHitFloorIndex: -1,
  particleCap: GAME.maxParticles,
  chest: {
    active: false,
    floorIndex: 0,
    open: 0,
    timer: 0
  }
};

function spawnCoins(state: GameState, bigMode: boolean): CoinParticle[] {
  const baseCount = bigMode ? 16 : 8;
  const bigCount = bigMode ? 6 : 2;
  const cap = state.particleCap;
  const targetCount = Math.min(cap, baseCount + bigCount);
  const coins: CoinParticle[] = [];

  for (let i = 0; i < targetCount; i += 1) {
    const big = i < bigCount;
    coins.push({
      x: (Math.random() - 0.5) * (big ? 120 : 80),
      y: state.playerY + 40,
      vx: (Math.random() - 0.5) * (big ? 160 : 120),
      vy: 420 + Math.random() * (big ? 280 : 200),
      life: GAME.coinLife,
      big
    });
  }

  return coins;
}

function updateDisplayScore(display: number, score: number) {
  if (display >= score) return display;
  const diff = score - display;
  const step = Math.max(1, Math.ceil(diff * 0.2));
  return Math.min(score, display + step);
}

function updateCoins(coins: CoinParticle[], dt: number) {
  const next: CoinParticle[] = [];
  for (const coin of coins) {
    const vy = coin.vy + GAME.gravity * 0.6 * dt;
    const y = coin.y + vy * dt;
    const x = coin.x + coin.vx * dt;
    const life = coin.life - dt;
    if (life > 0) {
      next.push({ ...coin, x, y, vy, life });
    }
  }
  return next;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return { ...state, running: true, gameOver: false };
    case "RESET": {
      const cap = state.particleCap;
      return { ...initialState, particleCap: cap };
    }
    case "SET_PARTICLE_CAP":
      return { ...state, particleCap: action.cap };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "JUMP":
      if (!state.running || state.gameOver) return state;
      if (state.velocity > 60) return state;
      return { ...state, velocity: GAME.jumpVelocity };
    case "DAMAGE": {
      const hp = Math.max(0, state.hp - action.amount);
      return {
        ...state,
        hp,
        gameOver: hp <= 0,
        running: hp > 0,
        lastDamageAt: action.time,
        combo: 0,
        velocity: Math.min(state.velocity, -240),
        lastHitFloorIndex: action.floorIndex
      };
    }
    case "FLOOR_REACHED": {
      const keepCombo = shouldKeepCombo(state.lastFloorAt, action.time);
      const combo = keepCombo ? state.combo + 1 : 1;
      const base = baseScoreForFloor(state.floor + 1);
      const gained = applyCombo(base, combo);
      const score = state.score + gained;
      const nextFloor = state.floor + 1;
      const chapterIndex = Math.floor(nextFloor / GAME.chapterFloorSpan);
      const chapter = getChapter(nextFloor);
      const chapterFlash = nextFloor % GAME.chapterFloorSpan === 0 ? 1 : state.chapterFlash;
      const bigMode = combo >= GAME.comboBonusThreshold;

      return {
        ...state,
        floor: nextFloor,
        maxFloor: Math.max(state.maxFloor, nextFloor),
        combo,
        maxCombo: Math.max(state.maxCombo, combo),
        score,
        lastFloorAt: action.time,
        chapterIndex,
        chapterName: chapter.name,
        chapterFlash,
        coins: spawnCoins(state, bigMode),
        shake: bigMode ? 8 : 3,
        chest: {
          active: true,
          floorIndex: nextFloor,
          open: 0,
          timer: 0
        }
      };
    }
    case "TICK": {
      const dt = action.dt / 1000;
      const displayScore = updateDisplayScore(state.displayScore, state.score);
      const coins = updateCoins(state.coins, dt);
      const shake = Math.max(0, state.shake - dt * GAME.shakeDecay);
      const chapterFlash = Math.max(0, state.chapterFlash - dt * 0.6);
      const chest = state.chest.active
        ? {
            ...state.chest,
            open: Math.min(1, state.chest.open + dt * GAME.chestOpenSpeed),
            timer: state.chest.timer + dt,
            active: state.chest.timer + dt < 2.2
          }
        : state.chest;

      let nextState: GameState = {
        ...state,
        displayScore,
        coins,
        shake,
        chapterFlash,
        chest
      };

      if (!state.running) {
        return nextState;
      }

      const velocity = state.velocity + GAME.gravity * dt;
      const playerY = Math.max(0, state.playerY + velocity * dt);
      nextState = { ...nextState, velocity, playerY, cameraY: playerY };

      const nextFloor = state.floor + 1;
      const gate = state.floors.find((f) => f.index === nextFloor);
      if (gate) {
        const gateY = gate.y - GAME.gateOffset;
        const crossed = state.playerY < gateY && playerY >= gateY;
        if (crossed && action.time - state.lastDamageAt > 400 && state.lastHitFloorIndex !== gate.index) {
          const pass = canPassGate(gate, action.time);
          if (!pass) {
            return gameReducer(nextState, { type: "DAMAGE", amount: gate.damage, time: action.time, floorIndex: gate.index });
          }
        }
      }

      if (playerY >= nextFloor * GAME.floorGap) {
        nextState = { ...nextState, playerY: nextFloor * GAME.floorGap, velocity: 0 };
        nextState = gameReducer(nextState, { type: "FLOOR_REACHED", time: action.time });
      }

      nextState = { ...nextState, floors: advanceFloors(nextState.floors, nextState.floor) };
      return nextState;
    }
    default:
      return state;
  }
}
