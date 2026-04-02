import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePulse } from '../context/PulseContext';
import { AUDIO_SETS, type AudioSet } from '../lib/data';
import { EVENT_CATALOG } from '../lib/data';
import type { SearchStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchMain'>;

export function SearchScreen({}: Props) {
  const [query, setQuery] = useState('');
  const { setSelectedAudio, addLoggedEvent } = usePulse();

  const audioHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUDIO_SETS;
    return AUDIO_SETS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }, [query]);

  const eventHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EVENT_CATALOG;
    return EVENT_CATALOG.filter(
      (e) =>
        e.artist.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.dateLabel.toLowerCase().includes(q)
    );
  }, [query]);

  const pickAudio = (a: AudioSet) => {
    setSelectedAudio(a);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={[styles.title, font('bold')]}>Search</Text>
      <Text style={[styles.sub, font('regular')]}>
        Find DJ sets (audio) and events. Selecting audio sets it for your next tap session.
      </Text>

      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={22} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sets, artists, venues…"
          placeholderTextColor={colors.muted}
          style={[styles.input, font('regular')]}
        />
      </View>

      <Text style={[styles.section, font('semibold')]}>Music sets</Text>
      {audioHits.map((a) => (
        <Pressable
          key={a.id}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
          onPress={() => pickAudio(a)}
        >
          <MaterialIcons name="library-music" size={22} color={colors.cyan} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, font('semibold')]}>{a.title}</Text>
            <Text style={[styles.rowSub, font('regular')]}>{a.artist} · ~{a.durationSec}s</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>
      ))}

      <Text style={[styles.section, font('semibold')]}>Events (log)</Text>
      {eventHits.map((e) => (
        <Pressable
          key={e.id}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
          onPress={() =>
            addLoggedEvent({ artist: e.artist, venue: e.venue, dateLabel: e.dateLabel })
          }
        >
          <MaterialIcons name="event" size={22} color={colors.mint} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, font('semibold')]}>{e.artist}</Text>
            <Text style={[styles.rowSub, font('regular')]}>{e.venue} · {e.dateLabel}</Text>
          </View>
          <Text style={[styles.logHint, font('medium')]}>Log</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 26, marginBottom: 6 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    gap: 8,
  },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12 },
  section: { color: colors.text, fontSize: 17, marginBottom: 10, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rowTitle: { color: colors.text, fontSize: 16 },
  rowSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  logHint: { color: colors.mint, fontSize: 13 },
});
