import type { Chapter, Floor, GameState } from "./types";
import { GAME } from "./constants";
import { gateOpen, gateWarning } from "./gimmicks";

type RenderContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
};

function isoBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  palette: Chapter["palette"]
) {
  const top = palette.top;
  const left = palette.left;
  const right = palette.right;

  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y - size * 0.5);
  ctx.lineTo(x + size * 2, y);
  ctx.lineTo(x + size, y + size * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = left;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y + size * 0.5);
  ctx.lineTo(x + size, y + size * 1.5);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = right;
  ctx.beginPath();
  ctx.moveTo(x + size * 2, y);
  ctx.lineTo(x + size, y + size * 0.5);
  ctx.lineTo(x + size, y + size * 1.5);
  ctx.lineTo(x + size * 2, y + size);
  ctx.closePath();
  ctx.fill();
}

function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  open: boolean,
  warn: boolean,
  palette: Chapter["palette"],
  type: Floor["gimmick"]
) {
  ctx.save();
  const color = warn ? "#ffe66d" : palette.hazard;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.globalAlpha = open ? 0.35 : 0.95;

  if (type === "rotate") {
    const r = width * 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
  } else if (type === "press") {
    ctx.beginPath();
    ctx.moveTo(x - width * 0.45, y - 10);
    ctx.lineTo(x + width * 0.45, y - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - width * 0.45, y + 10);
    ctx.lineTo(x + width * 0.45, y + 10);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - width * 0.5, y);
    ctx.lineTo(x + width * 0.5, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawChest(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  open: number,
  palette: Chapter["palette"]
) {
  const size = 18;
  const lid = open * 10;
  ctx.fillStyle = palette.accent;
  ctx.fillRect(x - size, y - size, size * 2, size);
  ctx.fillStyle = palette.left;
  ctx.fillRect(x - size, y, size * 2, size * 0.7);
  ctx.strokeStyle = palette.glow;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - size, y - size, size * 2, size);
  ctx.save();
  ctx.translate(x, y - size);
  ctx.rotate(-open * 0.6);
  ctx.fillStyle = palette.glow;
  ctx.fillRect(-size, -size - lid, size * 2, size * 0.4);
  ctx.restore();
}

export function renderGame(state: GameState, chapter: Chapter, r: RenderContext) {
  const { ctx, width, height, time } = r;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = chapter.palette.bg;
  ctx.fillRect(0, 0, width, height);

  if (state.chapterFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${state.chapterFlash * 0.2})`;
    ctx.fillRect(0, 0, width, height);
  }

  const centerX = width * 0.5;
  const centerY = height * 0.6;
  const cameraY = state.cameraY;

  ctx.save();
  ctx.translate(
    Math.sin(time / 80) * state.shake,
    Math.cos(time / 90) * state.shake
  );

  for (const floor of state.floors) {
    const screenY = centerY - (floor.y - cameraY) * 0.5;
    if (screenY < -200 || screenY > height + 200) continue;

    isoBlock(ctx, centerX - 60, screenY, 30, chapter.palette);

    const gateY = screenY - GAME.gateOffset * 0.5;
    const open = gateOpen(floor.gimmick, time * 0.001, floor.phase);
    const warn = gateWarning(floor.gimmick, time * 0.001, floor.phase);
    drawGate(ctx, centerX, gateY, 120, open, warn, chapter.palette, floor.gimmick);
  }

  const playerY = centerY - (state.playerY - cameraY) * 0.5;
  isoBlock(ctx, centerX - 20, playerY - 30, 16, {
    ...chapter.palette,
    top: "#f4f4f4",
    left: "#c7c7c7",
    right: "#a0a0a0"
  });

  if (state.chest.active) {
    const chestY = centerY - (state.playerY + 60 - cameraY) * 0.5;
    drawChest(ctx, centerX, chestY, state.chest.open, chapter.palette);
  }

  for (const coin of state.coins) {
    const cY = centerY - (coin.y - cameraY) * 0.5;
    const size = coin.big ? 10 : 6;
    ctx.fillStyle = coin.big ? chapter.palette.coinBig : chapter.palette.coin;
    ctx.beginPath();
    ctx.arc(centerX + coin.x, cY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
