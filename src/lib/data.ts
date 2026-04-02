export type AudioSet = {
  id: string;
  title: string;
  artist: string;
  /** Remote HTTPS URL for demo — replace with bundled asset for offline */
  uri: string;
  durationSec: number;
};

export const DEMO_AUDIO: AudioSet = {
  id: 'demo-1',
  title: 'SoundHelix — Song 1',
  artist: 'SoundHelix',
  uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  durationSec: 373,
};

/** Curated list — more tracks for Search / session selection */
export const AUDIO_SETS: AudioSet[] = [
  DEMO_AUDIO,
  {
    id: 'demo-2',
    title: 'SoundHelix — Song 2',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    durationSec: 420,
  },
  {
    id: 'demo-3',
    title: 'SoundHelix — Song 3',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationSec: 380,
  },
  {
    id: 'demo-4',
    title: 'SoundHelix — Song 4',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationSec: 395,
  },
  {
    id: 'demo-5',
    title: 'SoundHelix — Song 5',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    durationSec: 410,
  },
  {
    id: 'demo-6',
    title: 'SoundHelix — Song 6',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    durationSec: 388,
  },
  {
    id: 'demo-7',
    title: 'SoundHelix — Song 7',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    durationSec: 402,
  },
  {
    id: 'demo-8',
    title: 'SoundHelix — Song 8',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    durationSec: 375,
  },
  {
    id: 'demo-9',
    title: 'SoundHelix — Song 9',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    durationSec: 418,
  },
  {
    id: 'demo-10',
    title: 'SoundHelix — Song 10',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    durationSec: 360,
  },
  {
    id: 'demo-11',
    title: 'SoundHelix — Song 11',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    durationSec: 392,
  },
  {
    id: 'demo-12',
    title: 'SoundHelix — Song 12',
    artist: 'SoundHelix',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    durationSec: 405,
  },
];

export type SeedUser = {
  id: string;
  name: string;
  avatarColor: string;
  /** 12-D profile — cosine match vs live pulse */
  pulse: number[];
};

export const SEED_USERS: SeedUser[] = [
  {
    id: 'u1',
    name: 'Dominic Chang',
    avatarColor: '#FF2E63',
    pulse: [0.72, 0.45, 0.4, 0.68, 0.42, 0.55, 0.82, 0.28, 0.22, 0.12, 0.38, 0.42],
  },
  {
    id: 'u2',
    name: 'Maya Singh',
    avatarColor: '#00F5FF',
    pulse: [0.52, 0.58, 0.36, 0.35, 0.55, 0.48, 0.42, 0.68, 0.48, 0.2, 0.42, 0.35],
  },
  {
    id: 'u3',
    name: 'Alex Rivera',
    avatarColor: '#7CFFB2',
    pulse: [0.38, 0.32, 0.68, 0.22, 0.62, 0.62, 0.22, 0.52, 0.78, 0.35, 0.48, 0.28],
  },
];

export type EventProfile = {
  id: string;
  artist: string;
  venue: string;
  dateLabel: string;
  pulse: number[];
};

export const EVENT_CATALOG: EventProfile[] = [
  {
    id: 'e1',
    artist: 'Dom Dolla',
    venue: 'Space Miami',
    dateLabel: 'Mar 18, 2026',
    pulse: [0.85, 0.52, 0.32, 0.72, 0.4, 0.58, 0.72, 0.38, 0.28, 0.18, 0.4, 0.48],
  },
  {
    id: 'e2',
    artist: 'Amelie Lens',
    venue: 'Avant Gardner',
    dateLabel: 'Apr 2, 2026',
    pulse: [0.78, 0.55, 0.38, 0.65, 0.45, 0.52, 0.78, 0.55, 0.32, 0.22, 0.38, 0.42],
  },
  {
    id: 'e3',
    artist: 'John Summit',
    venue: 'Mirage',
    dateLabel: 'May 10, 2026',
    pulse: [0.68, 0.44, 0.46, 0.48, 0.5, 0.5, 0.58, 0.35, 0.42, 0.25, 0.45, 0.52],
  },
  {
    id: 'e4',
    artist: 'Illenium',
    venue: 'Palace',
    dateLabel: 'Jun 1, 2026',
    pulse: [0.45, 0.38, 0.58, 0.28, 0.58, 0.58, 0.38, 0.62, 0.55, 0.32, 0.5, 0.38],
  },
];
