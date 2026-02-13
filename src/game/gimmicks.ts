// ===========================================
// Gimmick Logic
// ===========================================

import type { Gimmick, GimmickType, ChapterDef, Player } from './types';
import {
  DAMAGE_LIGHT,
  DAMAGE_MEDIUM,
  DAMAGE_HEAVY,
  FLOOR_HEIGHT,
  FLOOR_WIDTH,
} from './constants';

/**
 * Create a gimmick for a specific floor
 */
export function createGimmick(
  type: GimmickType,
  floor: number,
  chapter: ChapterDef,
  variant: number = 0
): Gimmick {
  const baseY = -(floor - 1) * FLOOR_HEIGHT - FLOOR_HEIGHT / 2;
  const centerX = 0; // center of tower

  const speed = getGimmickBaseSpeed(type) * chapter.speedMultiplier;
  const damage = getGimmickDamage(type);

  let base: Omit<Gimmick, 'floor'>;

  switch (type) {
    case 'slideDoor':
      base = {
        type,
        x: centerX - FLOOR_WIDTH / 2,
        y: baseY - 30,
        width: FLOOR_WIDTH,
        height: 60,
        phase: Math.random(),
        speed,
        damage,
        active: false,
        variant,
      };
      break;

    case 'rotatingBar':
      base = {
        type,
        x: centerX,
        y: baseY,
        width: 80,
        height: 12,
        phase: Math.random(),
        speed,
        damage,
        active: true,
        variant,
      };
      break;

    case 'press':
      base = {
        type,
        x: centerX - 40,
        y: baseY - 60,
        width: 80,
        height: 80,
        phase: Math.random(),
        speed: speed * 0.7,
        damage,
        active: false,
        variant,
      };
      break;

    case 'laser':
      base = {
        type,
        x: centerX - FLOOR_WIDTH / 2,
        y: baseY,
        width: FLOOR_WIDTH,
        height: 8,
        phase: Math.random(),
        speed: speed * 0.5,
        damage,
        active: false,
        variant,
      };
      break;

    case 'crumble':
      // Placed at floor level — covers the platform
      base = {
        type,
        x: centerX - FLOOR_WIDTH / 2,
        y: -(floor - 1) * FLOOR_HEIGHT,
        width: FLOOR_WIDTH,
        height: 10,
        phase: Math.random(),
        speed,
        damage,
        active: false,
        variant,
      };
      break;

    case 'flame':
      base = {
        type,
        x: centerX - 20 + (variant % 2) * 40,
        y: baseY - 40,
        width: 30,
        height: 50,
        phase: Math.random(),
        speed: speed * 0.8,
        damage,
        active: false,
        variant,
      };
      break;

    default:
      base = {
        type: 'crumble',
        x: centerX,
        y: baseY,
        width: FLOOR_WIDTH,
        height: 10,
        phase: 0,
        speed: 0.4,
        damage: DAMAGE_LIGHT,
        active: false,
      };
      break;
  }

  return { ...base, floor };
}

/**
 * Get base speed for a gimmick type
 */
function getGimmickBaseSpeed(type: GimmickType): number {
  switch (type) {
    case 'slideDoor':
      return 0.6;
    case 'rotatingBar':
      return 0.8;
    case 'press':
      return 0.4;
    case 'laser':
      return 0.3;
    case 'crumble':
      return 0.4;
    case 'flame':
      return 0.5;
    default:
      return 0.5;
  }
}

/**
 * Get damage for a gimmick type
 */
function getGimmickDamage(type: GimmickType): number {
  switch (type) {
    case 'slideDoor':
      return DAMAGE_LIGHT;
    case 'rotatingBar':
      return DAMAGE_MEDIUM;
    case 'press':
      return DAMAGE_HEAVY;
    case 'laser':
      return DAMAGE_HEAVY;
    case 'crumble':
      return DAMAGE_LIGHT;
    case 'flame':
      return DAMAGE_MEDIUM;
    default:
      return DAMAGE_LIGHT;
  }
}

/**
 * Update gimmick state based on time
 */
export function updateGimmick(gimmick: Gimmick, deltaTime: number): Gimmick {
  const newPhase = (gimmick.phase + gimmick.speed * deltaTime) % 1;

  let active = false;

  switch (gimmick.type) {
    case 'slideDoor':
      // Door is closed (dangerous) when phase is 0.3-0.7
      active = newPhase > 0.3 && newPhase < 0.7;
      break;

    case 'rotatingBar':
      // Bar is dangerous when horizontal (phase near 0.25 or 0.75)
      const angle = newPhase * Math.PI * 2;
      const horizontal = Math.abs(Math.sin(angle));
      active = horizontal > 0.7;
      break;

    case 'press':
      // Press is down (dangerous) when phase is 0.6-0.9
      active = newPhase > 0.6 && newPhase < 0.9;
      break;

    case 'laser':
      // Laser is on when phase is 0.5-0.8
      active = newPhase > 0.5 && newPhase < 0.8;
      break;

    case 'crumble':
      // Crumble activates at phase 0.5-0.85 — stay too long and it hurts
      active = newPhase > 0.5 && newPhase < 0.85;
      break;

    case 'flame':
      // Flame bursts when phase is 0.3-0.6
      active = newPhase > 0.3 && newPhase < 0.6;
      break;
  }

  return {
    ...gimmick,
    phase: newPhase,
    active,
  };
}

/**
 * Check collision between player and gimmick
 */
export function checkGimmickCollision(
  player: Player,
  gimmick: Gimmick
): boolean {
  if (!gimmick.active) return false;
  if (player.invincibleTimer > 0) return false;
  // Landing safe zone — brief immunity after touching down
  if (player.landingTimer > 0) return false;
  // Only collide with gimmicks on the player's current floor
  const playerFloor = Math.floor(-player.y / FLOOR_HEIGHT) + 1;
  if (gimmick.floor !== playerFloor) return false;
  // Crumble only hurts grounded players (airborne players pass through)
  if (gimmick.type === 'crumble' && !player.grounded) return false;

  // Get hitboxes
  const playerBox = getPlayerHitbox(player);
  const gimmickBox = getGimmickHitbox(gimmick);

  // AABB collision
  return (
    playerBox.left < gimmickBox.right &&
    playerBox.right > gimmickBox.left &&
    playerBox.top < gimmickBox.bottom &&
    playerBox.bottom > gimmickBox.top
  );
}

function getPlayerHitbox(player: Player) {
  // Generous shrink for fairness — only the core body collides
  const shrinkX = 6;
  const shrinkTop = 8;
  const shrinkBottom = 4;
  return {
    left: player.x - player.width / 2 + shrinkX,
    right: player.x + player.width / 2 - shrinkX,
    top: player.y - player.height + shrinkTop,
    bottom: player.y - shrinkBottom,
  };
}

function getGimmickHitbox(gimmick: Gimmick) {
  switch (gimmick.type) {
    case 'rotatingBar': {
      // Rotating bar hitbox depends on angle — shrunk for fairness
      const angle = gimmick.phase * Math.PI * 2;
      const halfWidth = (gimmick.width / 2 - 6) * Math.abs(Math.cos(angle));
      const halfHeight = (gimmick.width / 2 - 6) * Math.abs(Math.sin(angle));
      return {
        left: gimmick.x - halfWidth,
        right: gimmick.x + halfWidth,
        top: gimmick.y - halfHeight - gimmick.height / 2 + 2,
        bottom: gimmick.y + halfHeight + gimmick.height / 2 - 2,
      };
    }

    case 'press': {
      // Press hitbox moves down when active — shrunk inward
      const pressOffset = gimmick.active ? 50 : 0;
      const inset = 8;
      return {
        left: gimmick.x + inset,
        right: gimmick.x + gimmick.width - inset,
        top: gimmick.y - gimmick.height + pressOffset + inset,
        bottom: gimmick.y + pressOffset - 4,
      };
    }

    case 'crumble': {
      // Thin zone at floor level — player stands on it
      return {
        left: gimmick.x + 4,
        right: gimmick.x + gimmick.width - 4,
        top: gimmick.y - gimmick.height,
        bottom: gimmick.y,
      };
    }

    default: {
      // Default hitbox with inset for fairness
      const inset = 6;
      return {
        left: gimmick.x + inset,
        right: gimmick.x + gimmick.width - inset,
        top: gimmick.y - gimmick.height / 2 + inset,
        bottom: gimmick.y + gimmick.height / 2 - inset,
      };
    }
  }
}

/**
 * Generate gimmicks for a floor
 */
export function generateFloorGimmicks(
  floor: number,
  chapter: ChapterDef
): Gimmick[] {
  const gimmicks: Gimmick[] = [];

  // First few floors have no gimmicks (tutorial zone)
  if (floor <= 3) return gimmicks;

  // Select gimmick types for this floor
  const availableTypes = chapter.gimmicks;
  const numGimmicks = Math.min(1 + Math.floor((floor - 3) / 20), 3);

  for (let i = 0; i < numGimmicks; i++) {
    const typeIndex = (floor + i) % availableTypes.length;
    const type = availableTypes[typeIndex];
    gimmicks.push(createGimmick(type, floor, chapter, i));
  }

  return gimmicks;
}
