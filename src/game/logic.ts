import { chapters } from "./chapters";
import { GAME } from "./constants";
import type { Chapter, Floor, GimmickType } from "./types";
import { buildFloor, gateOpen } from "./gimmicks";

export function getChapterIndex(floor: number) {
  return Math.floor(floor / GAME.chapterFloorSpan);
}

export function getChapter(floor: number): Chapter {
  const idx = getChapterIndex(floor) % chapters.length;
  return chapters[idx];
}

export function baseScoreForFloor(floor: number) {
  const chapterIndex = getChapterIndex(floor);
  return GAME.baseScore + chapterIndex * GAME.chapterBaseAdd;
}

export function applyCombo(base: number, combo: number) {
  if (combo >= GAME.comboBonusThreshold) {
    return Math.floor(base * GAME.comboBonusMultiplier);
  }
  return base;
}

export function shouldKeepCombo(lastAt: number, now: number) {
  return now - lastAt <= GAME.comboWindowMs;
}

export function computeDifficulty(floor: number) {
  const base = 1 + floor / 120;
  const clamped = Math.min(2.2, base);
  return clamped;
}

export function canPassGate(gate: Floor, time: number) {
  const difficulty = computeDifficulty(gate.index);
  const open = gateOpen(gate.gimmick, time * difficulty, gate.phase);
  return open;
}

export function makeInitialFloors(): Floor[] {
  const floors: Floor[] = [];
  for (let i = 0; i < GAME.maxFloorsKeep; i += 1) {
    const chap = getChapter(i);
    const gimmick = chap.gimmicks[i % chap.gimmicks.length] as GimmickType;
    floors.push(buildFloor(i, i * GAME.floorGap, gimmick));
  }
  return floors;
}

export function advanceFloors(current: Floor[], playerFloor: number): Floor[] {
  const floors = [...current];
  let topFloor = floors[floors.length - 1];
  while (playerFloor + GAME.maxFloorsKeep - 1 > topFloor.index) {
    const nextIndex = topFloor.index + 1;
    const chap = getChapter(nextIndex);
    const gimmick = chap.gimmicks[nextIndex % chap.gimmicks.length] as GimmickType;
    floors.push(buildFloor(nextIndex, nextIndex * GAME.floorGap, gimmick));
    topFloor = floors[floors.length - 1];
  }
  while (floors.length > GAME.maxFloorsKeep) {
    floors.shift();
  }
  return floors;
}
