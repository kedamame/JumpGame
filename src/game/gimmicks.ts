import type { GimmickType, Floor } from "./types";

export function gimmickDamage(type: GimmickType) {
  switch (type) {
    case "slide":
      return 10;
    case "rotate":
      return 15;
    case "press":
      return 25;
    case "laser":
      return 30;
    case "spike":
      return 20;
    case "steam":
      return 15;
    default:
      return 10;
  }
}

export function gateOpen(type: GimmickType, time: number, phase: number) {
  const t = (time / 1000 + phase) % 1;
  switch (type) {
    case "slide":
      return t < 0.6;
    case "rotate":
      return Math.sin(t * Math.PI * 2) > 0.2;
    case "press":
      return t > 0.3 && t < 0.7;
    case "laser":
      return t > 0.45 && t < 0.7;
    case "spike":
      return t < 0.5;
    case "steam":
      return t > 0.6;
    default:
      return true;
  }
}

export function gateWarning(type: GimmickType, time: number, phase: number) {
  const t = (time / 1000 + phase) % 1;
  if (type === "laser") return t > 0.38 && t <= 0.45;
  if (type === "steam") return t > 0.52 && t <= 0.6;
  return false;
}

export function buildFloor(index: number, y: number, gimmick: GimmickType): Floor {
  return {
    index,
    y,
    gimmick,
    phase: Math.random(),
    damage: gimmickDamage(gimmick)
  };
}
