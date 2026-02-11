import { describe, it, expect } from "vitest";
import { applyCombo, baseScoreForFloor, getChapterIndex, shouldKeepCombo, computeDifficulty } from "../src/game/logic";

describe("scoring", () => {
  it("base score scales per chapter", () => {
    expect(baseScoreForFloor(0)).toBe(100);
    expect(baseScoreForFloor(50)).toBe(150);
    expect(baseScoreForFloor(100)).toBe(200);
  });

  it("combo bonus applies at 10+", () => {
    expect(applyCombo(100, 9)).toBe(100);
    expect(applyCombo(100, 10)).toBe(150);
  });
});

describe("combo timing", () => {
  it("keeps combo within 5s", () => {
    expect(shouldKeepCombo(0, 4000)).toBe(true);
    expect(shouldKeepCombo(0, 6000)).toBe(false);
  });
});

describe("chapter index", () => {
  it("increments per 50 floors", () => {
    expect(getChapterIndex(0)).toBe(0);
    expect(getChapterIndex(49)).toBe(0);
    expect(getChapterIndex(50)).toBe(1);
  });
});

describe("difficulty scaling", () => {
  it("scales smoothly and clamps", () => {
    expect(computeDifficulty(0)).toBeGreaterThanOrEqual(1);
    expect(computeDifficulty(500)).toBeLessThanOrEqual(2.2);
  });
});
