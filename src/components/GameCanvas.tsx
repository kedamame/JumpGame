"use client";

import { useEffect, useRef } from "react";
import { renderGame } from "@/game/render";
import { getChapter } from "@/game/logic";
import { playSound } from "@/game/audio";
import type { FarcasterContext } from "@/lib/farcaster";
import { useGame } from "@/providers/GameProvider";

export function GameCanvas({
  farcaster,
  ready
}: {
  farcaster: FarcasterContext | null;
  ready: boolean;
}) {
  const { state, dispatch } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!ready) return;
    dispatch({ type: "START" });
  }, [ready, dispatch]);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      dispatch({ type: "TICK", dt, time: now });

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const snapshot = stateRef.current;
          const chapter = getChapter(snapshot.floor);
          renderGame(snapshot, chapter, {
            ctx,
            width,
            height,
            time: now
          });
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        if (!stateRef.current.muted) playSound("jump");
        dispatch({ type: "JUMP" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  useEffect(() => {
    if (state.gameOver && !state.muted) {
      playSound("death");
    }
  }, [state.gameOver, state.muted]);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const cap = dpr > 2.5 ? 80 : 180;
    dispatch({ type: "SET_PARTICLE_CAP", cap });
  }, [dispatch]);

  return (
    <div className="canvas-wrap">
      <canvas
        ref={canvasRef}
        onPointerDown={() => {
          if (!state.muted) playSound("jump");
          dispatch({ type: "JUMP" });
        }}
      />
      <div className="controls" style={{ position: "absolute", bottom: 12, left: 12, pointerEvents: "auto" }}>
        <button
          onClick={() => {
            if (!state.muted) playSound("jump");
            dispatch({ type: "JUMP" });
          }}
        >
          JUMP
        </button>
        <button className="secondary" onClick={() => dispatch({ type: "TOGGLE_MUTE" })}>
          {state.muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}
