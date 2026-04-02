import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniPulseBars } from '../components/MiniPulseBars';
import { usePulse } from '../context/PulseContext';
import { SEED_USERS } from '../lib/data';
import { matchPercent } from '../lib/pulse';
import type { HomeStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'FriendMatch'>;

export function FriendMatchScreen({ navigation }: Props) {
  const { pulseSignature } = usePulse();
  const base = pulseSignature ?? Array.from({ length: 12 }, () => 0.5);

  const ranked = SEED_USERS.map((u) => ({
    ...u,
    score: matchPercent(base, u.pulse),
  })).sort((a, b) => b.score - a.score);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <MiniPulseBars vector={base} barCount={32} />
      </View>
      <Text style={[styles.title, font('bold')]}>Find fans who feel like this</Text>
      <Text style={[styles.sub, font('regular')]}>
        Match % is cosine similarity vs your live pulse vector — not a static list.
      </Text>

      {ranked.map((u) => (
        <View key={u.id} style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: u.avatarColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, font('semibold')]}>{u.name}</Text>
              <Text style={[styles.pct, font('bold')]}>{u.score}% match</Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <MiniPulseBars vector={u.pulse} barCount={28} />
          </View>
        </View>
      ))}

      <Pressable
        style={styles.outline}
        onPress={() => navigation.getParent()?.navigate('Discover')}
      >
        <Text style={[styles.outlineText, font('semibold')]}>Discover events based on this energy</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: { color: colors.text, fontSize: 22, marginBottom: 8 },
  sub: { color: colors.muted, fontSize: 13, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  name: { color: colors.text, fontSize: 17 },
  pct: { color: colors.mint, fontSize: 18, marginTop: 4 },
  outline: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.cyan,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  outlineText: { color: colors.cyan, fontSize: 15, textAlign: 'center', paddingHorizontal: 12 },
});
