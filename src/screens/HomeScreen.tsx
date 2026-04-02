import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniPulseBars } from '../components/MiniPulseBars';
import { usePulse } from '../context/PulseContext';
import { EVENT_CATALOG } from '../lib/data';
import { matchPercent } from '../lib/pulse';
import type { HomeStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export function HomeScreen({ navigation }: Props) {
  const { pulseSignature, loggedEvents, addLoggedEvent } = usePulse();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={[styles.title, font('bold')]}>Your Events</Text>
      <Text style={[styles.sub, font('regular')]}>
        Logged shows appear here. Start a session to capture taps + refine your pulse.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}
        onPress={() => navigation.navigate('TapSession')}
      >
        <MaterialIcons name="graphic-eq" size={22} color={colors.text} />
        <Text style={[styles.primaryText, font('semibold')]}>Start listening + tap session</Text>
      </Pressable>

      {loggedEvents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, font('medium')]}>No logged events yet</Text>
          <Text style={[styles.emptySub, font('regular')]}>
            Use Search → log an event, or add a sample below.
          </Text>
          <Pressable
            style={styles.secondary}
            onPress={() => {
              const e = EVENT_CATALOG[0];
              addLoggedEvent({
                artist: e.artist,
                venue: e.venue,
                dateLabel: e.dateLabel,
              });
            }}
          >
            <Text style={[styles.secondaryText, font('medium')]}>Log sample event</Text>
          </Pressable>
        </View>
      ) : (
        loggedEvents.map((ev) => (
          <View key={ev.id} style={styles.card}>
            <Text style={[styles.artist, font('bold')]}>{ev.artist}</Text>
            <Text style={[styles.meta, font('regular')]}>{ev.venue}</Text>
            <Text style={[styles.meta, font('regular')]}>{ev.dateLabel}</Text>
            {pulseSignature ? (
              <View style={{ marginTop: 12 }}>
                <MiniPulseBars vector={pulseSignature} />
              </View>
            ) : null}
            <Pressable
              style={styles.cardBtn}
              onPress={() => navigation.navigate('TapSession')}
            >
              <Text style={[styles.cardBtnText, font('semibold')]}>Refine experience</Text>
            </Pressable>
          </View>
        ))
      )}

      {pulseSignature ? (
        <View style={styles.hint}>
          <Text style={[styles.hintText, font('regular')]}>
            Match preview vs tonight:{' '}
            <Text style={{ color: colors.mint, fontWeight: '600' }}>
              {matchPercent(pulseSignature, EVENT_CATALOG[0].pulse)}%
            </Text>{' '}
            with {EVENT_CATALOG[0].artist}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 48 },
  title: { color: colors.text, fontSize: 28, marginBottom: 6 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 18 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 22,
  },
  primaryText: { color: colors.text, fontSize: 16 },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
  },
  emptyText: { color: colors.text, fontSize: 16, marginBottom: 6 },
  emptySub: { color: colors.muted, fontSize: 13, marginBottom: 14 },
  secondary: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.cyan,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  secondaryText: { color: colors.cyan, fontSize: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  artist: { color: colors.text, fontSize: 18 },
  meta: { color: colors.muted, fontSize: 14, marginTop: 2 },
  cardBtn: {
    marginTop: 14,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardBtnText: { color: colors.text, fontSize: 15 },
  hint: { marginTop: 8 },
  hintText: { color: colors.muted, fontSize: 13 },
});
