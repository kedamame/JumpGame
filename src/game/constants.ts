// ===========================================
// Game Constants
// ===========================================

// Player physics
export const GRAVITY = 0.6;
export const JUMP_FORCE = -14;
export const MAX_FALL_SPEED = 15;

// Player dimensions
export const PLAYER_WIDTH = 24;
export const PLAYER_HEIGHT = 32;
export const PLAYER_MAX_HP = 100;

// Floor/Level
export const FLOOR_HEIGHT = 120; // pixels between floors
export const FLOOR_WIDTH = 200; // width of floor platform
export const TILE_SIZE = 20; // base tile size for 2.5D rendering

// Scoring
export const BASE_SCORE_PER_FLOOR = 100;
export const CHAPTER_SCORE_BONUS = 50; // added to base per chapter
export const COMBO_MULTIPLIER = 1.5;
export const COMBO_THRESHOLD = 10; // combo needed for multiplier
export const COMBO_TIMEOUT_MS = 5000; // 5 seconds to maintain combo

// Difficulty scaling
export const FLOORS_PER_CHAPTER = 50;
export const MIN_GIMMICK_SPEED = 0.5;
export const MAX_GIMMICK_SPEED = 2.0;

// Damage values
export const DAMAGE_LIGHT = 10; // slideDoor, spike (retracted hit)
export const DAMAGE_MEDIUM = 20; // rotatingBar, flame
export const DAMAGE_HEAVY = 30; // press, laser
export const DAMAGE_INSTANT = 100; // instant kill scenarios

// Invincibility
export const INVINCIBLE_FRAMES = 60; // 1 second at 60fps
export const KNOCKBACK_FRAMES = 15;

// Particles
export const MAX_PARTICLES = 100;
export const PARTICLE_REDUCE_THRESHOLD = 30; // fps below this reduces particles
export const COIN_PARTICLE_COUNT = 4;
export const BIG_COIN_PARTICLE_COUNT = 6;

// Camera
export const CAMERA_SMOOTHING = 0.1;

// Screen shake
export const SHAKE_DECAY = 0.9;
export const HIT_SHAKE = 3;
export const BIG_COMBO_SHAKE = 4;

// Contract limits (must match Solidity)
export const MAX_SCORE = 1_000_000_000; // 1 billion
export const MAX_FLOOR_LIMIT = 100_000; // 100k floors
export const MAX_COMBO_LIMIT = 10_000; // 10k combo

// Colors (default/title screen palette)
export const DEFAULT_PALETTE = {
  bg: '#1a1820',
  bgGradient: '#252230',
  floor: '#504848',
  floorSide: '#3a3030',
  floorTop: '#686060',
  wall: '#353040',
  wallSide: '#201a28',
  accent: '#b09868',
  gimmick: '#504040',
  gimmickActive: '#884444',
};
