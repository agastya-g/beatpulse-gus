/**
 * Pulse signature: 12-dimensional vector — tap-heavy fingerprint + refine + meta.
 * Tap dimensions are nonlinear mixes so different tap patterns produce visibly different profiles.
 */

export type RefineAnswers = {
  chaosLeansChaos: boolean | null;
  darkLeansDark: boolean | null;
  predictableLeansPredictable: boolean | null;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

/** Deterministic fingerprint 0–1 from tap intervals (changes when rhythm changes) */
function intervalFingerprint(intervals: number[]): number {
  if (intervals.length === 0) return 0.37;
  let h = 2166136261;
  for (let i = 0; i < intervals.length; i++) {
    const v = Math.round(intervals[i] * 10);
    h ^= v;
    h = Math.imul(h, 16777619);
  }
  h ^= intervals.length * 1315423911;
  return ((h >>> 0) % 10007) / 10007;
}

/**
 * Six tap-derived features + session shape — strongly sensitive to different tap sessions.
 */
export function tapTimestampsToFeatures(
  tapMs: number[],
  sessionStartMs: number,
  audioDurationSec: number
): number[] {
  if (tapMs.length === 0) {
    return [0.12, 0.12, 0.15, 0.12, 0.12, 0.15];
  }

  const rel = tapMs.map((t) => Math.max(0, (t - sessionStartMs) / 1000));
  const span = Math.max(rel[rel.length - 1], 0.35);
  const tps = tapMs.length / span;

  const intervals: number[] = [];
  for (let i = 1; i < rel.length; i++) intervals.push(rel[i] - rel[i - 1]);
  const mean = intervals.length
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 0.5;
  const variance =
    intervals.length > 0
      ? intervals.reduce((s, x) => s + (x - mean) ** 2, 0) / intervals.length
      : 0;
  const std = Math.sqrt(variance);

  /** Energy: nonlinear in overall rate */
  const energy = clamp01(1 - Math.exp(-tps / 3.8));

  /** Irregularity: variance with sqrt saturation */
  const irregularity = clamp01(Math.sqrt(std) / 1.15);

  /** Rhythm stability: low variance intervals = high */
  const rhythmStability = clamp01(1 - irregularity * 0.95);

  /** Burstiness: share of "fast" taps (< 220ms) */
  const fast = intervals.filter((x) => x < 0.22).length;
  const burstiness = intervals.length ? clamp01(fast / intervals.length) : 0;

  /** Front/back balance: did energy land early vs late in the session? */
  const mid = span / 2;
  let early = 0;
  let late = 0;
  for (const t of rel) {
    if (t <= mid) early++;
    else late++;
  }
  const balance = clamp01(early / Math.max(early + late, 1));

  /** Unique session hash from intervals — different every distinct pattern */
  const fingerprint = intervalFingerprint(intervals);

  void audioDurationSec;

  return [energy, irregularity, rhythmStability, burstiness, balance, fingerprint];
}

function boolToDim(v: boolean | null, ifTrue: number, ifFalse: number): number {
  if (v === null) return 0.5;
  return v ? ifTrue : ifFalse;
}

/** 12-D pulse: 6 tap + 3 refine + 1 comment + duration + tap density */
export function buildPulseSignature(
  tapMs: number[],
  sessionStartMs: number,
  audioDurationSec: number,
  answers: RefineAnswers,
  comment: string
): number[] {
  const t = tapTimestampsToFeatures(tapMs, sessionStartMs, audioDurationSec);
  const chaos = boolToDim(answers.chaosLeansChaos, 1, 0);
  const dark = boolToDim(answers.darkLeansDark, 1, 0);
  const pred = boolToDim(answers.predictableLeansPredictable, 1, 0);
  const commentSignal = clamp01(comment.trim().length / 280);
  const durationNorm = clamp01(audioDurationSec / 720);
  const tapCountNorm = clamp01(tapMs.length / 120);

  return [...t, chaos, dark, pred, commentSignal, durationNorm, tapCountNorm];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) + 1e-9;
  return dot / denom;
}

export function matchPercent(a: number[], b: number[]): number {
  const c = cosineSimilarity(a, b);
  return Math.round(Math.max(0, Math.min(100, ((c + 1) / 2) * 100)));
}

export function insightLines(sig: number[]): string[] {
  const energy = sig[0] ?? 0;
  const irregularity = sig[1] ?? 0;
  const burstiness = sig[3] ?? 0;
  const chaos = sig[6] ?? 0.5;
  const lines: string[] = [];

  if (energy > 0.65) lines.push('Strong spikes during high-energy moments');
  else if (energy < 0.28) lines.push('Calm, sparse tap pattern — reflective listening');
  else lines.push('Balanced energy across the session');

  if (burstiness > 0.55) lines.push('Burst-heavy tapping — quick hits clustered together');
  else if (irregularity > 0.55) lines.push('High variability in mid-range transitions');
  else lines.push('Steady rhythmic engagement');

  lines.push(`${Math.round(chaos * 100)}% weight toward chaotic vs structured vibe`);
  return lines.slice(0, 3);
}
