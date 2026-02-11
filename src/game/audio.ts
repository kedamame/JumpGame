export type SoundId = "jump" | "hit" | "coin" | "chest" | "death";

let ctx: AudioContext | null = null;

export function ensureAudio() {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

function playTone(freq: number, duration = 0.08, type: OscillatorType = "square") {
  const audio = ensureAudio();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.08;
  osc.connect(gain).connect(audio.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.stop(audio.currentTime + duration);
}

export function playSound(id: SoundId) {
  switch (id) {
    case "jump":
      playTone(420, 0.08, "square");
      break;
    case "hit":
      playTone(180, 0.12, "sawtooth");
      break;
    case "coin":
      playTone(760, 0.08, "triangle");
      break;
    case "chest":
      playTone(520, 0.12, "square");
      break;
    case "death":
      playTone(90, 0.2, "sawtooth");
      break;
  }
}
