import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AudioSet } from '../lib/data';
import { DEMO_AUDIO } from '../lib/data';
import { buildPulseSignature, type RefineAnswers } from '../lib/pulse';

const STORAGE_LOGGED = 'beatpulse_logged_events';
const STORAGE_REFINE = 'beatpulse_refine_defaults';

export type LoggedEvent = {
  id: string;
  artist: string;
  venue: string;
  dateLabel: string;
  createdAt: string;
};

type PulseContextValue = {
  selectedAudio: AudioSet;
  setSelectedAudio: (a: AudioSet) => void;
  tapTimestampsMs: number[];
  sessionStartMs: number | null;
  setSessionMeta: (startMs: number | null) => void;
  recordTap: (nowMs: number) => void;
  resetTaps: () => void;
  audioDurationSec: number;
  setAudioDurationSec: (s: number) => void;
  refineAnswers: RefineAnswers;
  setRefineAnswers: (r: RefineAnswers) => void;
  refineComment: string;
  setRefineComment: (s: string) => void;
  pulseSignature: number[] | null;
  recomputePulse: () => void;
  commitPulseSignature: (answers: RefineAnswers, comment: string) => void;
  loggedEvents: LoggedEvent[];
  addLoggedEvent: (e: Omit<LoggedEvent, 'id' | 'createdAt'>) => void;
  clearSession: () => void;
};

const defaultRefine: RefineAnswers = {
  chaosLeansChaos: null,
  darkLeansDark: null,
  predictableLeansPredictable: null,
};

const PulseContext = createContext<PulseContextValue | null>(null);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const [selectedAudio, setSelectedAudio] = useState<AudioSet>(DEMO_AUDIO);
  const [tapTimestampsMs, setTapTimestamps] = useState<number[]>([]);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);
  const [audioDurationSec, setAudioDurationSec] = useState(DEMO_AUDIO.durationSec);
  const [refineAnswers, setRefineAnswers] = useState<RefineAnswers>(defaultRefine);
  const [refineComment, setRefineComment] = useState('');
  const [pulseSignature, setPulseSignature] = useState<number[] | null>(null);
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_LOGGED);
        if (raw) setLoggedEvents(JSON.parse(raw));
        const r = await AsyncStorage.getItem(STORAGE_REFINE);
        if (r) setRefineAnswers(JSON.parse(r));
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_REFINE, JSON.stringify(refineAnswers)).catch(() => {});
  }, [refineAnswers]);

  const setSessionMeta = useCallback((startMs: number | null) => {
    setSessionStartMs(startMs);
  }, []);

  const recordTap = useCallback((nowMs: number) => {
    setTapTimestamps((prev) => [...prev, nowMs]);
  }, []);

  const resetTaps = useCallback(() => {
    setTapTimestamps([]);
    setSessionStartMs(null);
    setPulseSignature(null);
  }, []);

  const recomputePulse = useCallback(() => {
    const start = sessionStartMs ?? Date.now();
    const sig = buildPulseSignature(
      tapTimestampsMs,
      start,
      audioDurationSec,
      refineAnswers,
      refineComment
    );
    setPulseSignature(sig);
  }, [tapTimestampsMs, sessionStartMs, audioDurationSec, refineAnswers, refineComment]);

  const commitPulseSignature = useCallback(
    (answers: RefineAnswers, comment: string) => {
      setRefineAnswers(answers);
      setRefineComment(comment);
      const start = sessionStartMs ?? Date.now();
      const sig = buildPulseSignature(
        tapTimestampsMs,
        start,
        audioDurationSec,
        answers,
        comment
      );
      setPulseSignature(sig);
    },
    [tapTimestampsMs, sessionStartMs, audioDurationSec]
  );

  const addLoggedEvent = useCallback((e: Omit<LoggedEvent, 'id' | 'createdAt'>) => {
    const row: LoggedEvent = {
      ...e,
      id: `le_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLoggedEvents((prev) => {
      const next = [row, ...prev];
      AsyncStorage.setItem(STORAGE_LOGGED, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    setTapTimestamps([]);
    setSessionStartMs(null);
    setRefineAnswers(defaultRefine);
    setRefineComment('');
    setPulseSignature(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedAudio,
      setSelectedAudio,
      tapTimestampsMs,
      sessionStartMs,
      setSessionMeta,
      recordTap,
      resetTaps,
      audioDurationSec,
      setAudioDurationSec,
      refineAnswers,
      setRefineAnswers,
      refineComment,
      setRefineComment,
      pulseSignature,
      recomputePulse,
      commitPulseSignature,
      loggedEvents,
      addLoggedEvent,
      clearSession,
    }),
    [
      selectedAudio,
      tapTimestampsMs,
      sessionStartMs,
      setSessionMeta,
      recordTap,
      resetTaps,
      audioDurationSec,
      refineAnswers,
      refineComment,
      pulseSignature,
      recomputePulse,
      commitPulseSignature,
      loggedEvents,
      addLoggedEvent,
      clearSession,
    ]
  );

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error('usePulse inside PulseProvider');
  return ctx;
}
