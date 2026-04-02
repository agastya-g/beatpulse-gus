import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePulse } from '../context/PulseContext';
import {
  BASELINE,
  computeLiveMetersFromTaps,
  decayTowardBaseline,
  DECAY_MS,
} from '../lib/tapLive';
import type { HomeStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'TapSession'>;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SPARK_MAX = 18;

export function TapSessionScreen({ navigation }: Props) {
  const {
    selectedAudio,
    recordTap,
    resetTaps,
    setSessionMeta,
    tapTimestampsMs,
    setAudioDurationSec,
    sessionStartMs,
  } = usePulse();

  const soundRef = useRef<Audio.Sound | null>(null);
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(selectedAudio.durationSec);
  const [playing, setPlaying] = useState(false);
  const [energy, setEnergy] = useState(BASELINE);
  const [intensity, setIntensity] = useState(BASELINE);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lastTapAtRef = useRef(0);
  const [sparkTrail, setSparkTrail] = useState<number[]>([]);

  const scale = useRef(new Animated.Value(1)).current;

  const unload = useCallback(async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) await s.unloadAsync();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        await unload();
        const { sound } = await Audio.Sound.createAsync(
          { uri: selectedAudio.uri },
          { shouldPlay: false, progressUpdateIntervalMillis: 250 },
          (status) => {
            if (!status.isLoaded) return;
            const st = status as AVPlaybackStatusSuccess;
            setPositionSec(st.positionMillis / 1000);
            if (st.durationMillis) {
              const d = st.durationMillis / 1000;
              setDurationSec(d);
              setAudioDurationSec(d);
            }
            setPlaying(st.isPlaying);
          }
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        const st = await sound.getStatusAsync();
        if (st.isLoaded && st.durationMillis) {
          const d = st.durationMillis / 1000;
          setDurationSec(d);
          setAudioDurationSec(d);
        }
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : 'Could not load audio');
      }
    })();
    return () => {
      cancelled = true;
      unload();
    };
  }, [selectedAudio.uri, setAudioDurationSec, unload]);

  /** Recompute meters when tap list grows */
  useEffect(() => {
    if (tapTimestampsMs.length === 0) {
      setEnergy(BASELINE);
      setIntensity(BASELINE);
      setSparkTrail([]);
      return;
    }
    const now = Date.now();
    const m = computeLiveMetersFromTaps(tapTimestampsMs, now);
    setEnergy(m.energy);
    setIntensity(m.intensity);
    lastTapAtRef.current = now;
    setSparkTrail((prev) => [...prev, m.intensity].slice(-SPARK_MAX));
  }, [tapTimestampsMs]);

  /** Decay toward baseline when user pauses */
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (now - lastTapAtRef.current < 85) return;
      const factor = 0.91;
      setEnergy((e) => Math.round(decayTowardBaseline(e, BASELINE, factor)));
      setIntensity((i) => Math.round(decayTowardBaseline(i, BASELINE, factor)));
    }, DECAY_MS);
    return () => clearInterval(id);
  }, []);

  const pulseHaptics = () => {
    if (Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* optional */
    }
  };

  const animateTap = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.92,
        friction: 4,
        tension: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const togglePlay = async () => {
    const s = soundRef.current;
    if (!s) return;
    const st = await s.getStatusAsync();
    if (!st.isLoaded) return;
    if (sessionStartMs === null) setSessionMeta(Date.now());
    if (st.isPlaying) await s.pauseAsync();
    else await s.playAsync();
  };

  const canTap = playing;

  const onTap = () => {
    if (!playing) return;
    if (sessionStartMs === null) setSessionMeta(Date.now());
    recordTap(Date.now());
    pulseHaptics();
    animateTap();
  };

  const skipAll = async () => {
    await unload();
    resetTaps();
    navigation.navigate('RefineVibe');
  };

  const finish = async () => {
    await unload();
    navigation.navigate('RefineVibe');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Text style={[styles.timer, font('medium')]}>
        {formatTime(positionSec)} / {formatTime(durationSec)}
      </Text>

      {loadError ? (
        <Text style={[styles.err, font('regular')]}>{loadError}</Text>
      ) : null}

      <View style={styles.mainRow}>
        <View style={styles.sideCol}>
          <Text style={[styles.sideLabel, font('regular')]}>Energy</Text>
          <Text style={[styles.hintLab, font('regular')]}>sustained</Text>
          <View style={styles.barTrack}>
            <View
              style={[styles.barFill, { height: `${energy}%`, backgroundColor: colors.accent }]}
            />
          </View>
          <Text style={[styles.sideVal, { color: colors.accent }, font('semibold')]}>{energy}</Text>
        </View>

        <View style={styles.tapWrap}>
          <Animated.View
            style={[
              styles.tapOuter,
              { transform: [{ scale }], opacity: canTap ? 1 : 0.42 },
            ]}
          >
            <Pressable
              style={styles.tapPress}
              onPress={onTap}
              disabled={!canTap}
            >
              <View style={styles.tapInner}>
                <Text style={[styles.tapText, font('semibold')]}>Tap how it feels</Text>
                <Text style={[styles.tapSub, font('regular')]}>
                  {canTap
                    ? 'fast = intensity · steady = energy'
                    : 'Press Play — tapping unlocks while the set plays'}
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          <View style={styles.sparkRow}>
            {sparkTrail.length === 0
              ? null
              : sparkTrail.map((v, i) => (
                  <View
                    key={`s-${i}`}
                    style={[
                      styles.spark,
                      {
                        height: 4 + (v / 100) * 22,
                        opacity: 0.35 + (i / Math.max(sparkTrail.length, 1)) * 0.5,
                      },
                    ]}
                  />
                ))}
          </View>
        </View>

        <View style={styles.sideCol}>
          <Text style={[styles.sideLabel, font('regular')]}>Intensity</Text>
          <Text style={[styles.hintLab, font('regular')]}>instant</Text>
          <View style={styles.barTrack}>
            <View
              style={[styles.barFill, { height: `${intensity}%`, backgroundColor: colors.cyan }]}
            />
          </View>
          <Text style={[styles.sideVal, { color: colors.cyan }, font('semibold')]}>{intensity}</Text>
        </View>
      </View>

      <Text style={[styles.hint, font('regular')]}>
        {playing ? 'Playing' : 'Paused'} · taps: {tapTimestampsMs.length}
      </Text>

      <Pressable style={styles.playBtn} onPress={togglePlay}>
        <Text style={[styles.playText, font('semibold')]}>{playing ? 'Pause' : 'Play'} set</Text>
      </Pressable>

      <Pressable style={styles.finish} onPress={finish}>
        <Text style={[styles.finishText, font('bold')]}>Finish reflection</Text>
      </Pressable>

      <Pressable onPress={skipAll}>
        <Text style={[styles.skip, font('medium')]}>Opt out: skip taps, go to refine</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  timer: {
    alignSelf: 'center',
    color: colors.text,
    fontSize: 14,
    marginBottom: 12,
  },
  err: { color: colors.accent, textAlign: 'center', marginBottom: 8 },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  sideCol: { width: 58, alignItems: 'center' },
  hintLab: { color: colors.muted, fontSize: 9, marginBottom: 4, textTransform: 'uppercase' },
  tapWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 240 },
  sideLabel: { color: colors.muted, fontSize: 12, marginBottom: 2 },
  barTrack: {
    width: 16,
    height: 160,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 8 },
  sideVal: { marginTop: 8, fontSize: 16 },
  tapOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: 'rgba(255,46,99,0.12)',
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 12,
  },
  tapPress: { flex: 1, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  tapInner: { padding: 16, alignItems: 'center' },
  tapText: { color: colors.text, fontSize: 17, textAlign: 'center' },
  tapSub: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 15 },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 30,
    marginTop: 12,
    gap: 3,
  },
  spark: {
    width: 5,
    borderRadius: 2,
    backgroundColor: colors.cyan,
  },
  hint: { textAlign: 'center', color: colors.muted, marginTop: 16, fontSize: 13 },
  playBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  playText: { color: colors.text, fontSize: 15 },
  finish: {
    marginTop: 14,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  finishText: { color: colors.text, fontSize: 17 },
  skip: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
  },
});
