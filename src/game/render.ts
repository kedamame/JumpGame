// ===========================================
// Canvas Rendering — Jump King-inspired style
// Dark, muted, atmospheric pixel art
// ===========================================

import type { GameState, Gimmick, TreasureChest, Particle, ChapterDef } from './types';
import { getChapterForFloor } from './chapters';
import { FLOOR_HEIGHT, DEFAULT_PALETTE } from './constants';

// Deterministic pseudo-random from seed (for consistent cracks/details per floor)
function seededRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Main render function
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  dpr: number
): void {
  const { canvasWidth: width, canvasHeight: height } = state;

  ctx.save();
  ctx.scale(dpr, dpr);

  const chapter = getChapterForFloor(state.currentFloor);
  const palette = chapter.palette;

  // Screen shake (subtle)
  if (state.screenShake > 0.1) {
    const shakeX = Math.floor((Math.random() - 0.5) * state.screenShake);
    const shakeY = Math.floor((Math.random() - 0.5) * state.screenShake);
    ctx.translate(shakeX, shakeY);
  }

  drawBackground(ctx, width, height, palette, chapter.id);

  // Camera
  ctx.save();
  ctx.translate(Math.floor(width / 2), Math.floor(height / 2 - state.cameraY));

  drawTower(ctx, state, chapter);

  state.treasureChests.forEach((chest) => {
    drawTreasureChest(ctx, chest, palette);
  });

  state.gimmicks.forEach((gimmick) => {
    drawGimmick(ctx, gimmick, palette);
  });

  drawPlayer(ctx, state, palette);

  state.particles.forEach((particle) => {
    drawParticle(ctx, particle);
  });

  ctx.restore();

  if (state.chapterTransition > 0) {
    drawChapterTransition(ctx, width, height, chapter, state.chapterTransition);
  }

  ctx.restore();
}

// ─── Background ───────────────────────────────────

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: ChapterDef['palette'],
  chapterId: number
): void {
  // Layer 1: dark 3-stop gradient sky
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, palette.bgGradient);
  grad.addColorStop(0.5, palette.bg);
  grad.addColorStop(1, adjustBrightness(palette.bg, -5));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Layer 2: distant silhouette mountains/towers
  ctx.fillStyle = adjustBrightness(palette.bg, 4);
  const seed = chapterId * 7 + 3;
  // Left mountain
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.4 + seededRand(seed) * h * 0.15);
  ctx.lineTo(w * 0.15, h * 0.55 + seededRand(seed + 1) * h * 0.1);
  ctx.lineTo(w * 0.25, h * 0.35 + seededRand(seed + 2) * h * 0.1);
  ctx.lineTo(w * 0.4, h * 0.6);
  ctx.lineTo(w * 0.4, h);
  ctx.closePath();
  ctx.fill();

  // Right mountain
  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w, h * 0.45 + seededRand(seed + 3) * h * 0.1);
  ctx.lineTo(w * 0.85, h * 0.5 + seededRand(seed + 4) * h * 0.1);
  ctx.lineTo(w * 0.7, h * 0.38 + seededRand(seed + 5) * h * 0.1);
  ctx.lineTo(w * 0.6, h * 0.55);
  ctx.lineTo(w * 0.6, h);
  ctx.closePath();
  ctx.fill();

  // Distant tower silhouette (center)
  ctx.fillStyle = adjustBrightness(palette.bg, 3);
  const towerW = 30;
  const towerX = w * 0.5 - towerW / 2;
  ctx.fillRect(towerX, h * 0.2, towerW, h * 0.8);
  // Tower top
  ctx.beginPath();
  ctx.moveTo(towerX - 5, h * 0.2);
  ctx.lineTo(towerX + towerW / 2, h * 0.12);
  ctx.lineTo(towerX + towerW + 5, h * 0.2);
  ctx.closePath();
  ctx.fill();

  // Layer 3: horizontal fog bands
  for (let i = 0; i < 4; i++) {
    const fogY = h * (0.3 + i * 0.18 + seededRand(seed + 10 + i) * 0.05);
    const fogH = 15 + seededRand(seed + 20 + i) * 20;
    ctx.fillStyle = `rgba(${hexToRgb(palette.bg)},0.15)`;
    ctx.fillRect(0, fogY, w, fogH);
  }
}

// ─── Tower Structure ──────────────────────────────

function drawTower(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  chapter: ChapterDef
): void {
  const palette = chapter.palette;
  const minFloor = Math.max(1, state.currentFloor - 5);
  const maxFloor = state.currentFloor + 10;

  for (let floor = minFloor; floor <= maxFloor; floor++) {
    const y = -floor * FLOOR_HEIGHT;
    const platformY = y + FLOOR_HEIGHT;

    // Left wall — dark stone
    drawStoneWall(ctx, -100, y, 30, FLOOR_HEIGHT, palette, floor * 2);

    // Right wall
    drawStoneWall(ctx, 70, y, 30, FLOOR_HEIGHT, palette, floor * 2 + 1);

    // Floor platform (stone ledge)
    drawStoneLedge(ctx, platformY, palette, floor);
  }
}

function drawStoneWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  palette: ChapterDef['palette'],
  seed: number
): void {
  // Main wall body
  ctx.fillStyle = palette.wallSide;
  ctx.fillRect(x, y, w, h);

  // Stone block lines (horizontal mortar)
  ctx.strokeStyle = adjustBrightness(palette.wallSide, -8);
  ctx.lineWidth = 1;
  const rows = 4;
  for (let i = 1; i < rows; i++) {
    const ly = y + (h / rows) * i + seededRand(seed + i) * 4 - 2;
    ctx.beginPath();
    ctx.moveTo(x, Math.floor(ly));
    ctx.lineTo(x + w, Math.floor(ly));
    ctx.stroke();
  }

  // Occasional vertical mortar
  for (let i = 0; i < 2; i++) {
    const lx = x + seededRand(seed + 10 + i) * w;
    const rowIdx = Math.floor(seededRand(seed + 20 + i) * rows);
    const rowY = y + (h / rows) * rowIdx;
    ctx.beginPath();
    ctx.moveTo(Math.floor(lx), rowY);
    ctx.lineTo(Math.floor(lx), rowY + h / rows);
    ctx.stroke();
  }

  // Cracks (thin dark lines)
  if (seededRand(seed + 50) > 0.5) {
    ctx.strokeStyle = adjustBrightness(palette.wallSide, -15);
    const cx = x + seededRand(seed + 51) * w * 0.6 + w * 0.2;
    const cy = y + seededRand(seed + 52) * h * 0.4 + h * 0.3;
    ctx.beginPath();
    ctx.moveTo(Math.floor(cx), Math.floor(cy));
    ctx.lineTo(Math.floor(cx + seededRand(seed + 53) * 8 - 4), Math.floor(cy + 12));
    ctx.lineTo(Math.floor(cx + seededRand(seed + 54) * 6 - 3), Math.floor(cy + 20));
    ctx.stroke();
  }

  // Moss accents (tiny green-ish rectangles)
  if (seededRand(seed + 60) > 0.6) {
    ctx.fillStyle = adjustBrightness(palette.wall, 8);
    ctx.globalAlpha = 0.3;
    const mx = x + seededRand(seed + 61) * (w - 4);
    const my = y + h - 8 - seededRand(seed + 62) * 10;
    ctx.fillRect(Math.floor(mx), Math.floor(my), 4, 3);
    ctx.globalAlpha = 1;
  }
}

function drawStoneLedge(
  ctx: CanvasRenderingContext2D,
  y: number,
  palette: ChapterDef['palette'],
  floor: number
): void {
  const width = 140;
  const height = 14;
  const x = -width / 2;

  // Top surface (stone)
  ctx.fillStyle = palette.floorTop;
  ctx.fillRect(x, y - height, width, height);

  // Front edge (darker, thicker for weight)
  ctx.fillStyle = palette.floorSide;
  ctx.fillRect(x, y, width, 10);

  // Stone texture — varied brightness blocks on top surface
  const seed = floor * 17;
  for (let i = 0; i < 6; i++) {
    const bx = x + 4 + i * 22 + seededRand(seed + i) * 4;
    const bw = 16 + seededRand(seed + i + 10) * 6;
    const bright = (seededRand(seed + i + 20) - 0.5) * 10;
    ctx.fillStyle = adjustBrightness(palette.floorTop, bright);
    ctx.fillRect(Math.floor(bx), y - height + 2, Math.floor(bw), height - 4);
  }

  // Cracks on ledge (1-2 thin dark lines)
  ctx.strokeStyle = adjustBrightness(palette.floorSide, -10);
  ctx.lineWidth = 1;
  if (seededRand(seed + 30) > 0.4) {
    const cx = x + 20 + seededRand(seed + 31) * (width - 40);
    ctx.beginPath();
    ctx.moveTo(Math.floor(cx), y - height);
    ctx.lineTo(Math.floor(cx + seededRand(seed + 32) * 6 - 3), y - 2);
    ctx.stroke();
  }

  // Weathered corners (dark spots at edges)
  ctx.fillStyle = adjustBrightness(palette.floorSide, -8);
  ctx.fillRect(x, y - height, 3, 3);
  ctx.fillRect(x + width - 3, y - height, 3, 3);

  // Bottom drip / stalactite hint
  if (seededRand(seed + 40) > 0.7) {
    ctx.fillStyle = adjustBrightness(palette.floorSide, -5);
    const dx = x + 20 + seededRand(seed + 41) * (width - 40);
    ctx.fillRect(Math.floor(dx), y + 10, 2, 4 + seededRand(seed + 42) * 6);
  }
}

// ─── Player (dark hooded silhouette) ──────────────

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  palette: ChapterDef['palette']
): void {
  const { player } = state;
  const x = Math.floor(player.x);
  const y = Math.floor(player.y);

  // Invincibility flicker
  if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer / 4) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(x, y + 3, player.width / 2 - 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const w = player.width;
  const h = player.height;

  // Cloak / body
  const bodyColor = '#303048';
  const outlineColor = '#484868';

  // Outline (1px border for readability)
  ctx.fillStyle = outlineColor;
  ctx.fillRect(x - w / 2 - 1, y - h - 1, w + 2, h + 2);

  // Body fill
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x - w / 2, y - h, w, h);

  // Hood (triangle on top)
  ctx.fillStyle = outlineColor;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 - 2, y - h + 2);
  ctx.lineTo(x, y - h - 8);
  ctx.lineTo(x + w / 2 + 2, y - h + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h + 2);
  ctx.lineTo(x, y - h - 6);
  ctx.lineTo(x + w / 2, y - h + 2);
  ctx.closePath();
  ctx.fill();

  // Eyes (two tiny dots in accent color)
  ctx.fillStyle = palette.accent;
  ctx.fillRect(x - 3, y - h + 6, 2, 2);
  ctx.fillRect(x + 2, y - h + 6, 2, 2);

  // Cloak bottom edge detail
  ctx.fillStyle = '#282840';
  ctx.fillRect(x - w / 2, y - 3, w, 3);

  // HP bar (minimal, thin)
  const hpW = w + 4;
  const hpH = 3;
  const hpX = x - hpW / 2;
  const hpY = y - h - 14;

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(hpX, hpY, hpW, hpH);

  const hpPercent = player.hp / player.maxHp;
  const hpColor = hpPercent > 0.5 ? '#50a050' : hpPercent > 0.25 ? '#c08030' : '#c04040';
  ctx.fillStyle = hpColor;
  ctx.fillRect(hpX, hpY, Math.floor(hpW * hpPercent), hpH);

  ctx.globalAlpha = 1;
}

// ─── Treasure Chest (stone coffer) ────────────────

function drawTreasureChest(
  ctx: CanvasRenderingContext2D,
  chest: TreasureChest,
  palette: ChapterDef['palette']
): void {
  const x = Math.floor(chest.x);
  const y = Math.floor(chest.y);
  const size = 20;

  if (chest.opened) {
    // Opened coffer — base
    ctx.fillStyle = palette.floorSide;
    ctx.fillRect(x - size / 2, y - size / 3, size, size / 3);

    // Lid tilted
    ctx.fillStyle = palette.floor;
    ctx.save();
    ctx.translate(x - size / 2, y - size / 3);
    ctx.rotate(-0.4);
    ctx.fillRect(0, -size / 3, size, size / 3);
    ctx.restore();

    // Dim glow from inside
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(x - size / 3, y - size / 4, (size * 2) / 3, size / 6);
    ctx.globalAlpha = 1;
  } else {
    // Closed coffer
    ctx.fillStyle = palette.floorSide;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);

    // Lid
    ctx.fillStyle = palette.floor;
    ctx.fillRect(x - size / 2, y - size / 2 - 3, size, 5);

    // Seal mark (accent, subtle)
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(x - 2, y - 3, 4, 4);
    ctx.globalAlpha = 1;

    // Edge shadow
    ctx.fillStyle = adjustBrightness(palette.floorSide, -10);
    ctx.fillRect(x + size / 2 - 2, y - size / 2, 2, size);
  }
}

// ─── Gimmicks (medieval stone theme) ──────────────

function drawGimmick(
  ctx: CanvasRenderingContext2D,
  gimmick: Gimmick,
  palette: ChapterDef['palette']
): void {
  const color = gimmick.active ? palette.gimmickActive : palette.gimmick;
  const x = Math.floor(gimmick.x);
  const y = Math.floor(gimmick.y);

  ctx.fillStyle = color;

  switch (gimmick.type) {
    case 'slideDoor': {
      // Stone portcullis with vertical bars
      const openAmount = Math.sin(gimmick.phase * Math.PI * 2) * 0.5 + 0.5;
      const doorW = (gimmick.width / 2) * (1 - openAmount * 0.8);

      // Left gate
      ctx.fillRect(x, y - gimmick.height / 2, doorW, gimmick.height);
      // Right gate
      ctx.fillRect(x + gimmick.width - doorW, y - gimmick.height / 2, doorW, gimmick.height);

      // Vertical bars (iron grate)
      ctx.fillStyle = adjustBrightness(color, -15);
      const barSpacing = 8;
      for (let bx = x + 3; bx < x + doorW; bx += barSpacing) {
        ctx.fillRect(bx, y - gimmick.height / 2, 2, gimmick.height);
      }
      for (let bx = x + gimmick.width - doorW + 3; bx < x + gimmick.width; bx += barSpacing) {
        ctx.fillRect(bx, y - gimmick.height / 2, 2, gimmick.height);
      }
      break;
    }

    case 'rotatingBar': {
      // Wooden beam with metal studs
      const angle = gimmick.phase * Math.PI * 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Beam (wood brown)
      ctx.fillStyle = '#5a4830';
      ctx.fillRect(-gimmick.width / 2, -gimmick.height / 2, gimmick.width, gimmick.height);

      // Metal studs at ends
      ctx.fillStyle = '#707070';
      ctx.fillRect(-gimmick.width / 2 + 2, -2, 4, 4);
      ctx.fillRect(gimmick.width / 2 - 6, -2, 4, 4);

      // Center pivot (iron)
      ctx.fillStyle = '#505050';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#686868';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      break;
    }

    case 'press': {
      // Heavy stone block
      const pressY = gimmick.active ? 50 : 0;

      ctx.fillStyle = color;
      ctx.fillRect(x, y - gimmick.height + pressY, gimmick.width, gimmick.height);

      // Stone crack lines
      ctx.strokeStyle = adjustBrightness(color, -15);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 15, y - gimmick.height + pressY);
      ctx.lineTo(x + 20, y - gimmick.height / 2 + pressY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + gimmick.width - 20, y - gimmick.height + pressY + 10);
      ctx.lineTo(x + gimmick.width - 15, y + pressY - 5);
      ctx.stroke();

      // Bottom edge (heavier)
      ctx.fillStyle = adjustBrightness(color, -10);
      ctx.fillRect(x, y + pressY - 4, gimmick.width, 4);
      break;
    }

    case 'laser': {
      if (gimmick.active) {
        // Red beam
        ctx.fillStyle = '#c03030';
        ctx.fillRect(x, y - gimmick.height / 2, gimmick.width, gimmick.height);

        // Glow
        ctx.fillStyle = 'rgba(200,50,50,0.15)';
        ctx.fillRect(x, y - gimmick.height, gimmick.width, gimmick.height * 3);
      } else {
        // Stone emitters (gargoyle-like)
        ctx.fillStyle = palette.gimmick;
        ctx.fillRect(x, y - 8, 8, 16);
        ctx.fillRect(x + gimmick.width - 8, y - 8, 8, 16);

        // Warning flicker
        if (gimmick.phase > 0.4 && gimmick.phase < 0.5) {
          ctx.fillStyle = 'rgba(200,50,50,0.4)';
          ctx.fillRect(x, y - 1, gimmick.width, 2);
        }
      }
      break;
    }

    case 'crumble': {
      // Vanishing floor — blinks/shakes before crumbling
      const isWarning = gimmick.phase > 0.35 && gimmick.phase < 0.5;
      const isCrumbled = gimmick.active;

      if (isCrumbled) {
        // Broken fragments — scattered small squares
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = palette.gimmick;
        for (let i = 0; i < 5; i++) {
          const fx = x + seededRand(gimmick.variant ?? 0 + i * 7) * gimmick.width;
          const fy = y - 4 + seededRand(gimmick.variant ?? 0 + i * 13) * 12;
          ctx.fillRect(Math.floor(fx), Math.floor(fy), 4, 3);
        }
        ctx.globalAlpha = 1;
      } else {
        // Intact or warning state
        const shakeX = isWarning ? (Math.random() - 0.5) * 3 : 0;

        // Floor section (slightly different tone from normal ledge)
        ctx.fillStyle = isWarning
          ? adjustBrightness(palette.floorTop, -10)
          : adjustBrightness(palette.floorTop, -5);
        ctx.fillRect(Math.floor(x + shakeX), y - gimmick.height, gimmick.width, gimmick.height);

        // Crack lines to hint fragility
        ctx.strokeStyle = adjustBrightness(palette.floorSide, -15);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + gimmick.width * 0.3, y - gimmick.height);
        ctx.lineTo(x + gimmick.width * 0.35, y);
        ctx.moveTo(x + gimmick.width * 0.65, y - gimmick.height);
        ctx.lineTo(x + gimmick.width * 0.6, y);
        ctx.stroke();

        // Warning: blinking edge
        if (isWarning && Math.floor(gimmick.phase * 30) % 2 === 0) {
          ctx.fillStyle = palette.gimmickActive;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(x, y - 2, gimmick.width, 2);
          ctx.globalAlpha = 1;
        }
      }
      break;
    }

    case 'flame': {
      if (gimmick.active) {
        // Muted fire
        for (let i = 0; i < 3; i++) {
          const fx = x + Math.sin(gimmick.phase * 10 + i) * 6;
          const fy = y - i * 10;
          const size = 10 - i * 2;

          ctx.fillStyle = i < 1 ? '#c05010' : i < 2 ? '#d07020' : '#e0a040';
          ctx.fillRect(
            Math.floor(fx + gimmick.width / 2 - size / 2),
            Math.floor(fy - size),
            size,
            size
          );
        }
      }

      // Stone brazier
      ctx.fillStyle = '#404040';
      ctx.fillRect(x + 2, y + 8, gimmick.width - 4, 12);

      // Brazier rim
      ctx.fillStyle = '#585858';
      ctx.fillRect(x, y + 6, gimmick.width, 3);
      break;
    }
  }
}

// ─── Particles (muted dust/stone) ─────────────────

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
  const alpha = particle.life / particle.maxLife;
  ctx.globalAlpha = alpha * 0.7;
  ctx.fillStyle = particle.color;

  // All particles as small squares (pixel style)
  const size = Math.max(2, Math.floor(particle.size * 0.7));
  ctx.fillRect(
    Math.floor(particle.x - size / 2),
    Math.floor(particle.y - size / 2),
    size,
    size
  );

  ctx.globalAlpha = 1;
}

// ─── Chapter Transition ───────────────────────────

function drawChapterTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  chapter: ChapterDef,
  progress: number
): void {
  // Dark overlay
  ctx.fillStyle = `rgba(0,0,0,${progress * 0.9})`;
  ctx.fillRect(0, 0, width, height);

  const alpha = Math.min(1, progress * 2);
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textY = height / 2 - 15;

  // Decorative line above
  ctx.fillStyle = chapter.palette.accent;
  ctx.fillRect(width / 2 - 40, textY - 20, 80, 1);

  // Chapter name
  ctx.fillStyle = chapter.palette.accent;
  ctx.font = '20px monospace';
  ctx.fillText(chapter.name.toUpperCase(), width / 2, textY);

  // Japanese name
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.fillText(chapter.nameJp, width / 2, textY + 24);

  // Decorative line below
  ctx.fillStyle = chapter.palette.accent;
  ctx.fillRect(width / 2 - 40, textY + 36, 80, 1);

  ctx.globalAlpha = 1;
}

// ─── Title Screen ─────────────────────────────────

export function renderTitle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number
): void {
  ctx.save();
  ctx.scale(dpr, dpr);

  // Dark atmospheric background
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, DEFAULT_PALETTE.bgGradient);
  grad.addColorStop(0.5, DEFAULT_PALETTE.bg);
  grad.addColorStop(1, adjustBrightness(DEFAULT_PALETTE.bg, -3));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Distant tower silhouette
  ctx.fillStyle = adjustBrightness(DEFAULT_PALETTE.bg, 3);
  const tw = 24;
  const tx = width / 2 - tw / 2;
  ctx.fillRect(tx, height * 0.15, tw, height * 0.85);
  // Tower peak
  ctx.beginPath();
  ctx.moveTo(tx - 4, height * 0.15);
  ctx.lineTo(tx + tw / 2, height * 0.08);
  ctx.lineTo(tx + tw + 4, height * 0.15);
  ctx.closePath();
  ctx.fill();

  // Decorative line
  ctx.fillStyle = DEFAULT_PALETTE.accent;
  ctx.fillRect(width / 2 - 50, height / 3 - 24, 100, 1);

  // Title
  ctx.fillStyle = DEFAULT_PALETTE.accent;
  ctx.font = '28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOWER JUMP', width / 2, height / 3);

  // Decorative line below title
  ctx.fillRect(width / 2 - 50, height / 3 + 16, 100, 1);

  // Instructions
  ctx.font = '11px monospace';
  ctx.fillStyle = '#666';
  ctx.fillText('SPACE or tap to begin', width / 2, height * 0.75);

  ctx.restore();
}

// ─── Utilities ────────────────────────────────────

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function hexToRgb(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  return `${(num >> 16) & 0xff},${(num >> 8) & 0xff},${num & 0xff}`;
}
