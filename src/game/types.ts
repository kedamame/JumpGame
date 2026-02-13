// ===========================================
// Game Type Definitions
// ===========================================

export type GimmickType =
  | 'slideDoor'
  | 'rotatingBar'
  | 'press'
  | 'laser'
  | 'crumble'
  | 'flame';

export interface Gimmick {
  type: GimmickType;
  x: number;
  y: number;
  width: number;
  height: number;
  phase: number; // 0-1 animation phase
  speed: number; // cycles per second
  damage: number;
  active: boolean; // currently dealing damage?
  floor: number; // which floor this gimmick belongs to
  // Type-specific properties
  variant?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'coin' | 'spark' | 'dust';
  isBig?: boolean;
}

export interface TreasureChest {
  x: number;
  y: number;
  floor: number;
  opened: boolean;
  openPhase: number; // 0-1 animation
}

export interface Player {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
  jumping: boolean;
  hp: number;
  maxHp: number;
  invincibleTimer: number; // frames of invincibility after hit
  knockbackTimer: number;
  landingTimer: number; // frames of gimmick immunity after landing
}

export interface ChapterDef {
  id: number;
  name: string;
  nameJp: string;
  palette: {
    bg: string;
    bgGradient: string;
    floor: string;
    floorSide: string;
    floorTop: string;
    wall: string;
    wallSide: string;
    accent: string;
    gimmick: string;
    gimmickActive: string;
  };
  gimmicks: GimmickType[];
  speedMultiplier: number;
}

export interface GameState {
  status: 'title' | 'playing' | 'paused' | 'gameover';
  player: Player;
  currentFloor: number;
  maxFloor: number;
  score: number;
  combo: number;
  maxCombo: number;
  lastFloorTime: number; // timestamp of last floor reach
  chapter: number;
  chapterTransition: number; // 0-1 for chapter change animation
  cameraY: number;
  gimmicks: Gimmick[];
  treasureChests: TreasureChest[];
  particles: Particle[];
  screenShake: number;
  muted: boolean;
  deltaTime: number;
  timestamp: number;
  // For rendering
  canvasWidth: number;
  canvasHeight: number;
}

export type GameAction =
  | { type: 'INIT'; width: number; height: number }
  | { type: 'START' }
  | { type: 'JUMP' }
  | { type: 'TICK'; deltaTime: number; timestamp: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' }
  | { type: 'RESIZE'; width: number; height: number };

export interface ScoreData {
  score: number;
  maxFloor: number;
  maxCombo: number;
}

export interface FarcasterContext {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  safeAreaInsets?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
