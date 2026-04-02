import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PulseChart } from '../components/PulseChart';
import { usePulse } from '../context/PulseContext';
import { insightLines } from '../lib/pulse';
import type { HomeStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'PulseSignature'>;

export function PulseSignatureScreen({ navigation }: Props) {
  const { pulseSignature, audioDurationSec } = usePulse();
  const { width } = useWindowDimensions();
  const sig = pulseSignature ?? Array.from({ length: 12 }, () => 0.5);
  const insights = insightLines(sig);
  const total = audioDurationSec;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const totalLabel = `${m}:${s.toString().padStart(2, '0')}`;
  const half = total / 2;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={[styles.title, font('bold')]}>Your pulse signature</Text>

      <View style={styles.card}>
        <PulseChart
          vector={sig}
          width={Math.min(width - 56, 360)}
          height={140}
          timeLabels={['0:00', `${Math.floor(half / 60)}:${Math.floor(half % 60).toString().padStart(2, '0')}`, totalLabel]}
        />
      </View>

      <Text style={[styles.insHead, font('semibold')]}>Insights</Text>
      {insights.map((line) => (
        <View key={line} style={styles.pill}>
          <View style={styles.dot} />
          <Text style={[styles.pillText, font('regular')]}>{line}</Text>
        </View>
      ))}

      <Pressable style={styles.primary} onPress={() => navigation.navigate('FriendMatch')}>
        <Text style={[styles.primaryText, font('bold')]}>Compare with crowd</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 22, marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  insHead: { color: colors.text, fontSize: 17, marginBottom: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a3148',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.mint,
    shadowColor: colors.mint,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  pillText: { color: colors.text, fontSize: 14, flex: 1 },
  primary: {
    marginTop: 20,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: colors.text, fontSize: 17 },
});
