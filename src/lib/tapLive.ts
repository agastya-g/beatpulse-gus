/**
 * Live Energy / Intensity meters: non-linear mapping from tap timing + decay.
 * "Intensity" tracks instantaneous tap speed (short intervals = high intensity).
 * "Energy" tracks sustained activity (rate in a sliding window, sqrt curve).
 */

const WINDOW_MS = 2800;
const DECAY_MS = 55;
const BASELINE = 12;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** Taps per second in sliding window — saturating curve */
function windowRate(tapMs: number[], nowMs: number): number {
  const start = nowMs - WINDOW_MS;
  let c = 0;
  for (let i = tapMs.length - 1; i >= 0; i--) {
    if (tapMs[i] < start) break;
    c++;
  }
  const span = Math.min(WINDOW_MS, nowMs - (tapMs[0] ?? nowMs));
  const sec = Math.max(span / 1000, 0.12);
  return c / sec;
}

/**
 * Last inter-tap interval (ms). Smaller = faster = more intense.
 * First tap uses synthetic "slow" interval so we don't spike from nothing.
 */
function lastIntervalMs(tapMs: number[]): number {
  if (tapMs.length < 2) return 800;
  return tapMs[tapMs.length - 1] - tapMs[tapMs.length - 2];
}

/** Burst bonus: many taps in 400ms */
function burstScore(tapMs: number[], nowMs: number): number {
  const start = nowMs - 400;
  let c = 0;
  for (let i = tapMs.length - 1; i >= 0; i--) {
    if (tapMs[i] < start) break;
    c++;
  }
  return clamp((c - 2) / 5, 0, 1);
}

/** Map tap rate to 0–100 with diminishing returns at high rates */
export function rateToEnergy(rate: number): number {
  const x = 1 - Math.exp(-rate / 4.2);
  return clamp(Math.round(BASELINE + x * 82), 0, 100);
}

/** Map instantaneous speed (taps/sec implied by last interval) to 0–100 */
export function speedToIntensity(intervalMs: number, burst: number): number {
  const safe = Math.max(intervalMs, 40);
  const instTps = 1000 / safe;
  const curve = 1 - Math.exp(-instTps / 5.5);
  const base = BASELINE + curve * 78;
  const bonus = burst * 18;
  return clamp(Math.round(base + bonus), 0, 100);
}

export type LiveMeters = { energy: number; intensity: number };

/** One-shot peaks after a new tap */
export function computeLiveMetersFromTaps(tapMs: number[], nowMs: number): LiveMeters {
  if (tapMs.length === 0) {
    return { energy: BASELINE, intensity: BASELINE };
  }
  const rate = windowRate(tapMs, nowMs);
  const energy = rateToEnergy(rate);
  const interval = lastIntervalMs(tapMs);
  const burst = burstScore(tapMs, nowMs);
  const intensity = speedToIntensity(interval, burst);
  return { energy, intensity };
}

/** Exponential decay toward baseline when user pauses */
export function decayTowardBaseline(
  current: number,
  targetBaseline: number,
  factor: number
): number {
  return targetBaseline + (current - targetBaseline) * factor;
}

export { BASELINE, DECAY_MS };
