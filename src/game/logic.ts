// ===========================================
// Core Game Logic (Pure Functions)
// ===========================================

import type {
  GameState,
  Player,
  TreasureChest,
  Particle,
  Gimmick,
} from './types';
import { getChapterForFloor, isChapterTransition } from './chapters';
import {
  updateGimmick,
  checkGimmickCollision,
  generateFloorGimmicks,
} from './gimmicks';
import {
  GRAVITY,
  JUMP_FORCE,
  MAX_FALL_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_MAX_HP,
  FLOOR_HEIGHT,
  BASE_SCORE_PER_FLOOR,
  CHAPTER_SCORE_BONUS,
  COMBO_MULTIPLIER,
  COMBO_THRESHOLD,
  COMBO_TIMEOUT_MS,
  FLOORS_PER_CHAPTER,
  INVINCIBLE_FRAMES,
  KNOCKBACK_FRAMES,
  MAX_PARTICLES,
  COIN_PARTICLE_COUNT,
  BIG_COIN_PARTICLE_COUNT,
  CAMERA_SMOOTHING,
  SHAKE_DECAY,
  HIT_SHAKE,
  BIG_COMBO_SHAKE,
} from './constants';

/**
 * Create initial player state
 */
export function createPlayer(): Player {
  return {
    x: 0,
    y: 0,
    vy: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    grounded: true,
    jumping: false,
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    invincibleTimer: 0,
    knockbackTimer: 0,
    landingTimer: 0,
  };
}

/**
 * Create initial game state
 */
export function createInitialState(width: number, height: number): GameState {
  return {
    status: 'title',
    player: createPlayer(),
    currentFloor: 1,
    maxFloor: 1,
    score: 0,
    combo: 0,
    maxCombo: 0,
    lastFloorTime: 0,
    chapter: 0,
    chapterTransition: 0,
    cameraY: 0,
    gimmicks: [],
    treasureChests: [createTreasureChest(1)],
    particles: [],
    screenShake: 0,
    muted: false,
    deltaTime: 0,
    timestamp: 0,
    canvasWidth: width,
    canvasHeight: height,
  };
}

/**
 * Create a treasure chest for a floor
 */
export function createTreasureChest(floor: number): TreasureChest {
  return {
    x: 0,
    y: -(floor - 1) * FLOOR_HEIGHT,
    floor,
    opened: false,
    openPhase: 0,
  };
}

/**
 * Calculate score for reaching a floor
 */
export function calculateFloorScore(
  floor: number,
  combo: number
): { score: number; hasBonus: boolean } {
  const chapter = Math.floor((floor - 1) / FLOORS_PER_CHAPTER);
  const baseScore = BASE_SCORE_PER_FLOOR + chapter * CHAPTER_SCORE_BONUS;

  const hasBonus = combo >= COMBO_THRESHOLD;
  const multiplier = hasBonus ? COMBO_MULTIPLIER : 1;

  // Floor score, rounded down for consistency
  const score = Math.floor(baseScore * multiplier);

  return { score, hasBonus };
}

/**
 * Check if combo should reset (timeout)
 */
export function shouldResetCombo(
  lastFloorTime: number,
  currentTime: number
): boolean {
  if (lastFloorTime === 0) return false;
  return currentTime - lastFloorTime > COMBO_TIMEOUT_MS;
}

/**
 * Apply jump to player
 */
export function applyJump(player: Player): Player {
  if (!player.grounded || player.knockbackTimer > 0) return player;

  return {
    ...player,
    vy: JUMP_FORCE,
    grounded: false,
    jumping: true,
  };
}

/**
 * Apply physics to player
 *
 * Coordinate system:
 *   y = 0     → floor 1 (ground)
 *   y = -120  → floor 2
 *   y = -240  → floor 3  ... (negative = higher)
 *
 * vy < 0 → moving UP,  vy > 0 → falling DOWN
 */
export function applyPhysics(player: Player, deltaTime: number): Player {
  let { y, vy, grounded, jumping, invincibleTimer, knockbackTimer, landingTimer } = player;
  const wasGrounded = grounded;

  // Don't apply gravity while standing on a platform
  if (grounded) {
    vy = 0;
  } else {
    // Gravity (only when airborne)
    vy += GRAVITY;
    if (vy > MAX_FALL_SPEED) vy = MAX_FALL_SPEED;

    // Remember floor level BEFORE moving (to detect crossing)
    const landingLevel = Math.ceil(y / FLOOR_HEIGHT) * FLOOR_HEIGHT;

    // Apply velocity
    y += vy;

    // Landing check: falling (vy > 0) and crossed or reached a floor boundary
    if (vy > 0 && y >= landingLevel) {
      y = landingLevel;
      vy = 0;
      grounded = true;
      jumping = false;
    }

    // Safety: never fall below ground (y = 0)
    if (y > 0) {
      y = 0;
      vy = 0;
      grounded = true;
      jumping = false;
    }
  }

  // Landing safe zone: brief gimmick immunity when touching down
  if (grounded && !wasGrounded) {
    landingTimer = 15; // ~0.25s grace period
  }

  // Update timers
  if (invincibleTimer > 0) invincibleTimer--;
  if (knockbackTimer > 0) knockbackTimer--;
  if (landingTimer > 0) landingTimer--;

  return {
    ...player,
    y,
    vy,
    grounded,
    jumping,
    invincibleTimer,
    knockbackTimer,
    landingTimer,
  };
}

/**
 * Apply damage to player
 */
export function applyDamage(player: Player, damage: number): Player {
  if (player.invincibleTimer > 0) return player;

  const newHp = Math.max(0, player.hp - damage);

  return {
    ...player,
    hp: newHp,
    invincibleTimer: INVINCIBLE_FRAMES,
    knockbackTimer: KNOCKBACK_FRAMES,
    vy: -8, // knockback upward
  };
}

/**
 * Check if player reached a new floor
 */
export function checkFloorReached(
  player: Player,
  currentFloor: number
): number | null {
  const playerFloor = Math.floor(-player.y / FLOOR_HEIGHT) + 1;
  if (playerFloor > currentFloor) {
    return playerFloor;
  }
  return null;
}

/**
 * Create coin particles for treasure chest
 */
export function createCoinParticles(
  x: number,
  y: number,
  isBigCombo: boolean
): Particle[] {
  const particles: Particle[] = [];
  const count = isBigCombo ? BIG_COIN_PARTICLE_COUNT : COIN_PARTICLE_COUNT;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = 3 + Math.random() * 4;
    const isBig = isBigCombo && Math.random() > 0.5;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: isBig ? 12 : 6,
      color: isBig ? '#ffd700' : '#ffaa00',
      life: 60 + Math.random() * 30,
      maxLife: 90,
      type: 'coin',
      isBig,
    });
  }

  return particles;
}

/**
 * Create spark particles for hit effect
 */
export function createSparkParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const count = 6;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 3,
      color: '#ff4444',
      life: 20 + Math.random() * 10,
      maxLife: 30,
      type: 'spark',
    });
  }

  return particles;
}

/**
 * Update particles
 */
export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.2, // gravity
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0)
    .slice(0, MAX_PARTICLES);
}

/**
 * Update camera to follow player
 */
export function updateCamera(
  cameraY: number,
  playerY: number,
  canvasHeight: number
): number {
  const targetY = playerY - canvasHeight / 3;
  return cameraY + (targetY - cameraY) * CAMERA_SMOOTHING;
}

/**
 * Update screen shake
 */
export function updateScreenShake(shake: number): number {
  return shake * SHAKE_DECAY;
}

/**
 * Main game tick - processes one frame
 */
export function gameTick(
  state: GameState,
  deltaTime: number,
  timestamp: number
): GameState {
  if (state.status !== 'playing') return state;

  let {
    player,
    currentFloor,
    maxFloor,
    score,
    combo,
    maxCombo,
    lastFloorTime,
    chapter,
    chapterTransition,
    cameraY,
    gimmicks,
    treasureChests,
    particles,
    screenShake,
  } = state;

  // Check combo timeout
  if (shouldResetCombo(lastFloorTime, timestamp)) {
    combo = 0;
  }

  // Update player physics
  player = applyPhysics(player, deltaTime);

  // Update gimmicks
  gimmicks = gimmicks.map((g) => updateGimmick(g, deltaTime / 1000));

  // Check gimmick collisions
  for (const gimmick of gimmicks) {
    if (checkGimmickCollision(player, gimmick)) {
      player = applyDamage(player, gimmick.damage);
      particles = [...particles, ...createSparkParticles(player.x, player.y)];
      screenShake = HIT_SHAKE;
      combo = 0; // Reset combo on hit
      break;
    }
  }

  // Check floor reached
  const newFloor = checkFloorReached(player, currentFloor);
  if (newFloor !== null) {
    currentFloor = newFloor;
    if (newFloor > maxFloor) {
      maxFloor = newFloor;

      // Calculate score
      const { score: floorScore, hasBonus } = calculateFloorScore(
        newFloor,
        combo
      );
      score += floorScore;

      // Update combo
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      lastFloorTime = timestamp;

      // Open treasure chest
      const chest = treasureChests.find((c) => c.floor === newFloor);
      if (chest && !chest.opened) {
        chest.opened = true;
        const isBigCombo = combo >= COMBO_THRESHOLD;
        particles = [
          ...particles,
          ...createCoinParticles(chest.x, chest.y, isBigCombo),
        ];
        if (isBigCombo) {
          screenShake = BIG_COMBO_SHAKE;
        }
      }

      // Add next treasure chest
      if (!treasureChests.find((c) => c.floor === newFloor + 1)) {
        treasureChests = [...treasureChests, createTreasureChest(newFloor + 1)];
      }

      // Generate gimmicks for upcoming floors
      const chapterDef = getChapterForFloor(newFloor);
      for (let f = newFloor + 1; f <= newFloor + 5; f++) {
        if (!gimmicks.some((g) => g.floor === f)) {
          gimmicks = [...gimmicks, ...generateFloorGimmicks(f, chapterDef)];
        }
      }

      // Check chapter transition
      if (isChapterTransition(newFloor)) {
        chapter = Math.floor((newFloor - 1) / FLOORS_PER_CHAPTER);
        chapterTransition = 1;
      }
    }
  }

  // Update chapter transition animation
  if (chapterTransition > 0) {
    chapterTransition = Math.max(0, chapterTransition - 0.02);
  }

  // Update particles
  particles = updateParticles(particles);

  // Update camera
  cameraY = updateCamera(cameraY, player.y, state.canvasHeight);

  // Update screen shake
  screenShake = updateScreenShake(screenShake);

  // Check game over
  const status = player.hp <= 0 ? 'gameover' : state.status;

  // Clean up old gimmicks and chests (performance)
  const minFloor = currentFloor - 10;
  gimmicks = gimmicks.filter((g) => g.floor >= minFloor);
  treasureChests = treasureChests.filter((c) => c.floor >= minFloor);

  return {
    ...state,
    status,
    player,
    currentFloor,
    maxFloor,
    score,
    combo,
    maxCombo,
    lastFloorTime,
    chapter,
    chapterTransition,
    cameraY,
    gimmicks,
    treasureChests,
    particles,
    screenShake,
    deltaTime,
    timestamp,
  };
}

/**
 * Start a new game
 */
export function startGame(state: GameState): GameState {
  const chapter = getChapterForFloor(1);

  return {
    ...state,
    status: 'playing',
    player: createPlayer(),
    currentFloor: 1,
    maxFloor: 1,
    score: 0,
    combo: 0,
    maxCombo: 0,
    lastFloorTime: 0,
    chapter: 0,
    chapterTransition: 0,
    cameraY: 0,
    gimmicks: generateFloorGimmicks(4, chapter),
    treasureChests: [createTreasureChest(1), createTreasureChest(2)],
    particles: [],
    screenShake: 0,
    timestamp: Date.now(),
  };
}
