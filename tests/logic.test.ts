// ===========================================
// Game Logic Tests
// ===========================================

import { describe, it, expect } from 'vitest';
import {
  calculateFloorScore,
  shouldResetCombo,
  createPlayer,
  applyJump,
  applyPhysics,
  applyDamage,
  checkFloorReached,
  createTreasureChest,
  createCoinParticles,
} from '../src/game/logic';
import {
  BASE_SCORE_PER_FLOOR,
  CHAPTER_SCORE_BONUS,
  COMBO_MULTIPLIER,
  COMBO_THRESHOLD,
  COMBO_TIMEOUT_MS,
  FLOORS_PER_CHAPTER,
  JUMP_FORCE,
  INVINCIBLE_FRAMES,
  PLAYER_MAX_HP,
} from '../src/game/constants';

describe('Score Calculation', () => {
  it('calculates base score for floor 1', () => {
    const result = calculateFloorScore(1, 0);
    expect(result.score).toBe(BASE_SCORE_PER_FLOOR); // 100
    expect(result.hasBonus).toBe(false);
  });

  it('increases base score per chapter', () => {
    // Floor 51 = Chapter 1
    const result = calculateFloorScore(51, 0);
    expect(result.score).toBe(BASE_SCORE_PER_FLOOR + CHAPTER_SCORE_BONUS); // 150
  });

  it('applies combo multiplier at threshold', () => {
    const result = calculateFloorScore(1, COMBO_THRESHOLD);
    expect(result.hasBonus).toBe(true);
    expect(result.score).toBe(Math.floor(BASE_SCORE_PER_FLOOR * COMBO_MULTIPLIER)); // 150
  });

  it('does not apply multiplier below threshold', () => {
    const result = calculateFloorScore(1, COMBO_THRESHOLD - 1);
    expect(result.hasBonus).toBe(false);
    expect(result.score).toBe(BASE_SCORE_PER_FLOOR);
  });

  it('calculates correctly for chapter 2 with combo', () => {
    // Floor 101 = Chapter 2
    const result = calculateFloorScore(101, 15);
    const expectedBase = BASE_SCORE_PER_FLOOR + 2 * CHAPTER_SCORE_BONUS; // 200
    expect(result.score).toBe(Math.floor(expectedBase * COMBO_MULTIPLIER)); // 300
    expect(result.hasBonus).toBe(true);
  });

  it('calculates chapter correctly based on floor', () => {
    // Test chapter boundaries
    const floor49 = calculateFloorScore(49, 0);
    const floor50 = calculateFloorScore(50, 0);
    const floor51 = calculateFloorScore(51, 0);

    // Floors 1-50 = Chapter 0
    expect(floor49.score).toBe(BASE_SCORE_PER_FLOOR);
    expect(floor50.score).toBe(BASE_SCORE_PER_FLOOR);
    // Floor 51 = Chapter 1
    expect(floor51.score).toBe(BASE_SCORE_PER_FLOOR + CHAPTER_SCORE_BONUS);
  });
});

describe('Combo Timeout', () => {
  it('returns false when no previous floor time', () => {
    expect(shouldResetCombo(0, 5000)).toBe(false);
  });

  it('returns false within timeout', () => {
    const now = 10000;
    const lastFloor = now - COMBO_TIMEOUT_MS + 1000; // 1 second before timeout
    expect(shouldResetCombo(lastFloor, now)).toBe(false);
  });

  it('returns true after timeout', () => {
    const now = 10000;
    const lastFloor = now - COMBO_TIMEOUT_MS - 1; // 1ms past timeout
    expect(shouldResetCombo(lastFloor, now)).toBe(true);
  });

  it('returns true exactly at timeout', () => {
    const now = 10000;
    const lastFloor = now - COMBO_TIMEOUT_MS - 1;
    expect(shouldResetCombo(lastFloor, now)).toBe(true);
  });
});

describe('Player Physics', () => {
  it('creates player with correct defaults', () => {
    const player = createPlayer();
    expect(player.hp).toBe(PLAYER_MAX_HP);
    expect(player.grounded).toBe(true);
    expect(player.vy).toBe(0);
  });

  it('applies jump force when grounded', () => {
    const player = createPlayer();
    const jumped = applyJump(player);
    expect(jumped.vy).toBe(JUMP_FORCE);
    expect(jumped.grounded).toBe(false);
    expect(jumped.jumping).toBe(true);
  });

  it('does not jump when not grounded', () => {
    const player = { ...createPlayer(), grounded: false, vy: -5 };
    const result = applyJump(player);
    expect(result.vy).toBe(-5); // unchanged
  });

  it('does not jump during knockback', () => {
    const player = { ...createPlayer(), knockbackTimer: 10 };
    const result = applyJump(player);
    expect(result.vy).toBe(0); // unchanged
  });

  it('applies gravity in physics update', () => {
    const player = { ...createPlayer(), vy: 0, y: -100, grounded: false };
    const result = applyPhysics(player, 16);
    expect(result.vy).toBeGreaterThan(0); // falling
  });

  it('decrements invincibility timer', () => {
    const player = { ...createPlayer(), invincibleTimer: 10 };
    const result = applyPhysics(player, 16);
    expect(result.invincibleTimer).toBe(9);
  });
});

describe('Damage System', () => {
  it('applies damage and sets invincibility', () => {
    const player = createPlayer();
    const damaged = applyDamage(player, 25);
    expect(damaged.hp).toBe(PLAYER_MAX_HP - 25);
    expect(damaged.invincibleTimer).toBe(INVINCIBLE_FRAMES);
  });

  it('does not apply damage during invincibility', () => {
    const player = { ...createPlayer(), invincibleTimer: 30 };
    const result = applyDamage(player, 25);
    expect(result.hp).toBe(PLAYER_MAX_HP); // unchanged
  });

  it('clamps HP to zero', () => {
    const player = createPlayer();
    const damaged = applyDamage(player, 200);
    expect(damaged.hp).toBe(0);
  });

  it('applies knockback velocity', () => {
    const player = createPlayer();
    const damaged = applyDamage(player, 10);
    expect(damaged.vy).toBe(-8); // knockback upward
  });
});

describe('Floor Detection', () => {
  it('detects new floor when player moves up', () => {
    const player = { ...createPlayer(), y: -150 }; // above floor 2
    const result = checkFloorReached(player, 1);
    expect(result).toBe(2);
  });

  it('returns null when on same floor', () => {
    const player = { ...createPlayer(), y: -50 }; // still on floor 1
    const result = checkFloorReached(player, 1);
    expect(result).toBeNull();
  });

  it('handles multiple floor jumps', () => {
    const player = { ...createPlayer(), y: -500 }; // way up
    const result = checkFloorReached(player, 1);
    expect(result).toBeGreaterThan(1);
  });
});

describe('Treasure Chest', () => {
  it('creates chest at correct position', () => {
    const chest = createTreasureChest(5);
    expect(chest.floor).toBe(5);
    expect(chest.opened).toBe(false);
    expect(chest.openPhase).toBe(0);
  });
});

describe('Particles', () => {
  it('creates normal coin particles', () => {
    const particles = createCoinParticles(0, 0, false);
    expect(particles.length).toBeGreaterThan(0);
    expect(particles.every(p => p.type === 'coin')).toBe(true);
  });

  it('creates more particles for big combo', () => {
    const normal = createCoinParticles(0, 0, false);
    const big = createCoinParticles(0, 0, true);
    expect(big.length).toBeGreaterThan(normal.length);
  });

  it('includes big coins for combo', () => {
    const particles = createCoinParticles(0, 0, true);
    const hasBig = particles.some(p => p.isBig);
    expect(hasBig).toBe(true);
  });
});

describe('Chapter System', () => {
  it('correctly calculates chapter from floor', () => {
    // Chapter 0: floors 1-50
    expect(Math.floor((1 - 1) / FLOORS_PER_CHAPTER)).toBe(0);
    expect(Math.floor((50 - 1) / FLOORS_PER_CHAPTER)).toBe(0);
    // Chapter 1: floors 51-100
    expect(Math.floor((51 - 1) / FLOORS_PER_CHAPTER)).toBe(1);
    expect(Math.floor((100 - 1) / FLOORS_PER_CHAPTER)).toBe(1);
    // Chapter 2: floors 101-150
    expect(Math.floor((101 - 1) / FLOORS_PER_CHAPTER)).toBe(2);
  });
});
