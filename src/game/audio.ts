// ===========================================
// WebAudio Sound Effects
// ===========================================

type SoundType = 'jump' | 'hit' | 'coin' | 'bigCoin' | 'death' | 'chapter';

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;

/**
 * Initialize audio context (must be called from user interaction)
 */
export function initAudio(): void {
  if (audioContext) return;

  try {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.3;
  } catch {
    console.warn('WebAudio not supported');
  }
}

/**
 * Set mute state
 */
export function setMuted(isMuted: boolean): void {
  muted = isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.3;
  }
}

/**
 * Play a sound effect
 */
export function playSound(type: SoundType): void {
  if (!audioContext || !masterGain || muted) return;

  // Resume context if suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  const now = audioContext.currentTime;

  switch (type) {
    case 'jump':
      // Quick upward sweep
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case 'hit':
      // Harsh noise burst
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;

    case 'coin':
      // Bright ding
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.setValueAtTime(1100, now + 0.05);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;

    case 'bigCoin':
      // Grand fanfare chord
      playChord([523, 659, 784, 1047], 0.3);
      break;

    case 'death':
      // Descending sad tone
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      break;

    case 'chapter':
      // Triumphant fanfare
      playChord([262, 330, 392, 523], 0.5);
      setTimeout(() => playChord([330, 415, 494, 659], 0.3), 200);
      break;
  }
}

/**
 * Play multiple notes as a chord
 */
function playChord(frequencies: number[], duration: number): void {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime;

  frequencies.forEach((freq, i) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();

    osc.connect(gain);
    gain.connect(masterGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.15, now + i * 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now + i * 0.02);
    osc.stop(now + duration);
  });
}

/**
 * Cleanup audio context
 */
export function cleanupAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    masterGain = null;
  }
}
