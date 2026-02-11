export type GimmickType =
  | "slide"
  | "rotate"
  | "press"
  | "laser"
  | "spike"
  | "steam";

export type Chapter = {
  name: string;
  palette: {
    bg: string;
    top: string;
    left: string;
    right: string;
    accent: string;
    hazard: string;
    coin: string;
    coinBig: string;
    glow: string;
  };
  gimmicks: GimmickType[];
};

export type Floor = {
  index: number;
  y: number;
  gimmick: GimmickType;
  phase: number;
  damage: number;
};

export type CoinParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  big: boolean;
};

export type ChestState = {
  active: boolean;
  floorIndex: number;
  open: number;
  timer: number;
};

export type GameState = {
  running: boolean;
  gameOver: boolean;
  score: number;
  displayScore: number;
  combo: number;
  maxCombo: number;
  floor: number;
  maxFloor: number;
  hp: number;
  maxHp: number;
  lastFloorAt: number;
  chapterIndex: number;
  chapterName: string;
  chapterFlash: number;
  velocity: number;
  playerY: number;
  floors: Floor[];
  cameraY: number;
  coins: CoinParticle[];
  shake: number;
  muted: boolean;
  lastDamageAt: number;
  lastHitFloorIndex: number;
  particleCap: number;
  chest: ChestState;
};

export type GameAction =
  | { type: "START" }
  | { type: "JUMP" }
  | { type: "TICK"; dt: number; time: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "RESET" }
  | { type: "DAMAGE"; amount: number; time: number; floorIndex: number }
  | { type: "FLOOR_REACHED"; time: number }
  | { type: "SET_PARTICLE_CAP"; cap: number };
