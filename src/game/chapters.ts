import type { Chapter } from "./types";

export const chapters: Chapter[] = [
  {
    name: "Stone Keep",
    palette: {
      bg: "#20242f",
      top: "#58606f",
      left: "#424956",
      right: "#333842",
      accent: "#ffc857",
      hazard: "#ff6b6b",
      coin: "#ffd166",
      coinBig: "#ffe6a7",
      glow: "#ffd166"
    },
    gimmicks: ["slide", "spike"]
  },
  {
    name: "Gearworks",
    palette: {
      bg: "#1d2424",
      top: "#4c5c5c",
      left: "#3a4949",
      right: "#2a3535",
      accent: "#ffb703",
      hazard: "#e63946",
      coin: "#ffd166",
      coinBig: "#fff3b0",
      glow: "#ffb703"
    },
    gimmicks: ["rotate", "press", "slide"]
  },
  {
    name: "Lava Forge",
    palette: {
      bg: "#2b1b1b",
      top: "#7d3b3b",
      left: "#5c2b2b",
      right: "#431f1f",
      accent: "#f77f00",
      hazard: "#ff0000",
      coin: "#ffd166",
      coinBig: "#ffe6a7",
      glow: "#ff7b00"
    },
    gimmicks: ["laser", "steam", "press"]
  },
  {
    name: "Ice Hall",
    palette: {
      bg: "#1a2330",
      top: "#8ecae6",
      left: "#5fa8d3",
      right: "#3f7da6",
      accent: "#e0fbfc",
      hazard: "#ff6b6b",
      coin: "#aee6ff",
      coinBig: "#d9f3ff",
      glow: "#bde0fe"
    },
    gimmicks: ["slide", "spike", "laser"]
  },
  {
    name: "Forest Ruins",
    palette: {
      bg: "#1e2a1f",
      top: "#6b8f71",
      left: "#56735b",
      right: "#3d5441",
      accent: "#d9ed92",
      hazard: "#ef476f",
      coin: "#f9c74f",
      coinBig: "#fcefb4",
      glow: "#d9ed92"
    },
    gimmicks: ["steam", "rotate", "spike"]
  },
  {
    name: "Sky Temple",
    palette: {
      bg: "#1b1e3a",
      top: "#7b8cff",
      left: "#5b6fe3",
      right: "#3e4fb3",
      accent: "#ffd6ff",
      hazard: "#ff6b6b",
      coin: "#ffd166",
      coinBig: "#ffe6a7",
      glow: "#cdb4db"
    },
    gimmicks: ["press", "laser", "slide", "rotate"]
  }
];
