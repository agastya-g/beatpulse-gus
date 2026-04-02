import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniPulseBars } from '../components/MiniPulseBars';
import { usePulse } from '../context/PulseContext';
import { EVENT_CATALOG } from '../lib/data';
import { matchPercent } from '../lib/pulse';
import type { DiscoverStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'DiscoverMain'>;

export function DiscoverScreen({}: Props) {
  const { pulseSignature } = usePulse();
  const [threshold, setThreshold] = useState(0.5);

  const ranked = useMemo(() => {
    const base = pulseSignature ?? Array.from({ length: 12 }, () => 0.5);
    return EVENT_CATALOG.map((e) => ({
      ...e,
      score: matchPercent(base, e.pulse),
    }))
      .filter((x) => x.score / 100 >= threshold - 0.01)
      .sort((a, b) => b.score - a.score);
  }, [pulseSignature, threshold]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={[styles.title, font('bold')]}>Events that match your energy</Text>
      <Text style={[styles.sub, font('regular')]}>Based on your pulse signature</Text>

      <View style={styles.filterCard}>
        <View style={styles.filterHead}>
          <Text style={[styles.filterLabel, font('medium')]}>Match filter</Text>
          <Text style={[styles.filterVal, font('semibold')]}>{Math.round(threshold * 100)}%+</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${threshold * 100}%` }]} />
        </View>
        <View style={styles.filterLabels}>
          <Text style={[styles.muted, font('regular')]}>Outside comfort zone</Text>
          <Text style={[styles.muted, font('regular')]}>Perfect match</Text>
        </View>
        <Pressable
          style={styles.thumbRow}
          onPress={() => setThreshold((t) => (t <= 0.25 ? 0.5 : t <= 0.5 ? 0.75 : 0.25))}
        >
          <Text style={[styles.thumbHint, font('regular')]}>
            Tap bar area to cycle threshold (demo)
          </Text>
        </Pressable>
        <Text style={[styles.worth, font('semibold')]}>
          <Text style={{ color: colors.mint }}>Worth exploring</Text> ({ranked.length} events)
        </Text>
      </View>

      {!pulseSignature ? (
        <Text style={[styles.warn, font('regular')]}>
          Complete a tap session + refine on Home to personalize these scores.
        </Text>
      ) : null}

      {ranked.map((e) => (
        <View key={e.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.artist, font('bold')]}>{e.artist}</Text>
              <Text style={[styles.meta, font('regular')]}>{e.venue}</Text>
              <Text style={[styles.meta, font('regular')]}>{e.dateLabel}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.pct, font('bold')]}>{e.score}%</Text>
              <Text style={[styles.meta, font('regular')]}>energy match</Text>
            </View>
          </View>
          <View style={{ marginVertical: 12 }}>
            <MiniPulseBars vector={e.pulse} />
          </View>
          <Pressable style={styles.outlineBtn}>
            <Text style={[styles.outlineText, font('semibold')]}>View event</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 22, marginBottom: 6 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  filterCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  filterHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  filterLabel: { color: colors.text, fontSize: 15 },
  filterVal: { color: colors.mint, fontSize: 15 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2a3148',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: colors.mint,
  },
  filterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  muted: { color: colors.muted, fontSize: 11 },
  thumbRow: { marginTop: 10 },
  thumbHint: { color: colors.muted, fontSize: 12 },
  worth: { color: colors.text, fontSize: 14, marginTop: 12 },
  warn: { color: colors.cyan, fontSize: 13, marginBottom: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', gap: 12 },
  artist: { color: colors.text, fontSize: 18 },
  meta: { color: colors.muted, fontSize: 13, marginTop: 2 },
  pct: { color: colors.mint, fontSize: 22 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.cyan,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineText: { color: colors.cyan, fontSize: 15 },
});
