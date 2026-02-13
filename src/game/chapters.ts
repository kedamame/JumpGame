// ===========================================
// Chapter Definitions (50 floors each)
// Jump King-inspired muted, atmospheric palettes
// ===========================================

import type { ChapterDef, GimmickType } from './types';

export const CHAPTERS: ChapterDef[] = [
  // Chapter 0: Dark Cellar (Floors 1-50)
  {
    id: 0,
    name: 'Dark Cellar',
    nameJp: '暗い地下室',
    palette: {
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
    },
    gimmicks: ['slideDoor', 'crumble'],
    speedMultiplier: 1.0,
  },

  // Chapter 1: Crumbling Keep (Floors 51-100)
  {
    id: 1,
    name: 'Crumbling Keep',
    nameJp: '崩れる城塞',
    palette: {
      bg: '#1e1e25',
      bgGradient: '#2a2a38',
      floor: '#585060',
      floorSide: '#484050',
      floorTop: '#706878',
      wall: '#404050',
      wallSide: '#2a2a38',
      accent: '#8888a0',
      gimmick: '#505060',
      gimmickActive: '#885555',
    },
    gimmicks: ['slideDoor', 'rotatingBar', 'press'],
    speedMultiplier: 1.1,
  },

  // Chapter 2: Storm Battlement (Floors 101-150)
  {
    id: 2,
    name: 'Storm Battlement',
    nameJp: '嵐の胸壁',
    palette: {
      bg: '#181e25',
      bgGradient: '#253040',
      floor: '#485058',
      floorSide: '#384048',
      floorTop: '#606870',
      wall: '#304050',
      wallSide: '#1a2838',
      accent: '#7090a8',
      gimmick: '#485868',
      gimmickActive: '#708090',
    },
    gimmicks: ['flame', 'crumble', 'press'],
    speedMultiplier: 1.2,
  },

  // Chapter 3: Frozen Parapet (Floors 151-200)
  {
    id: 3,
    name: 'Frozen Parapet',
    nameJp: '凍てつく欄干',
    palette: {
      bg: '#182028',
      bgGradient: '#202840',
      floor: '#485868',
      floorSide: '#384858',
      floorTop: '#607080',
      wall: '#304858',
      wallSide: '#1a3048',
      accent: '#70a0b8',
      gimmick: '#486070',
      gimmickActive: '#709098',
    },
    gimmicks: ['slideDoor', 'laser', 'crumble'],
    speedMultiplier: 1.3,
  },

  // Chapter 4: Mossy Ruins (Floors 201-250)
  {
    id: 4,
    name: 'Mossy Ruins',
    nameJp: '苔むした遺跡',
    palette: {
      bg: '#182018',
      bgGradient: '#203028',
      floor: '#486048',
      floorSide: '#385038',
      floorTop: '#587858',
      wall: '#304830',
      wallSide: '#183020',
      accent: '#78a060',
      gimmick: '#406030',
      gimmickActive: '#886848',
    },
    gimmicks: ['rotatingBar', 'flame', 'crumble'],
    speedMultiplier: 1.4,
  },

  // Chapter 5: Haunted Peak (Floors 251-300)
  {
    id: 5,
    name: 'Haunted Peak',
    nameJp: '憑かれた頂',
    palette: {
      bg: '#1a1825',
      bgGradient: '#282848',
      floor: '#484060',
      floorSide: '#383050',
      floorTop: '#585070',
      wall: '#303050',
      wallSide: '#1a1830',
      accent: '#7868a0',
      gimmick: '#484060',
      gimmickActive: '#786070',
    },
    gimmicks: ['laser', 'rotatingBar', 'press', 'flame'],
    speedMultiplier: 1.5,
  },
];

/**
 * Get chapter definition for a given floor number.
 * After all chapters, loops with increased difficulty.
 */
export function getChapterForFloor(floor: number): ChapterDef {
  const chapterIndex = Math.floor((floor - 1) / 50);
  const loopCount = Math.floor(chapterIndex / CHAPTERS.length);
  const actualIndex = chapterIndex % CHAPTERS.length;

  const baseChapter = CHAPTERS[actualIndex];

  // Each loop increases speed multiplier
  return {
    ...baseChapter,
    id: chapterIndex,
    speedMultiplier: baseChapter.speedMultiplier + loopCount * 0.2,
  };
}

/**
 * Get available gimmick types for a chapter
 */
export function getChapterGimmicks(chapter: ChapterDef): GimmickType[] {
  return chapter.gimmicks;
}

/**
 * Check if floor is a chapter transition
 */
export function isChapterTransition(floor: number): boolean {
  return floor > 1 && (floor - 1) % 50 === 0;
}
