import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePulse } from '../context/PulseContext';
import type { ProfileStackParamList } from '../navigation/types';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen({}: Props) {
  const { pulseSignature, clearSession } = usePulse();
  const preview = pulseSignature?.map((n) => n.toFixed(2)).join(' · ') ?? '—';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <Text style={[styles.title, font('bold')]}>Profile</Text>
      <Text style={[styles.sub, font('regular')]}>Your current pulse vector preview.</Text>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, font('semibold')]}>Active pulse (12-D)</Text>
        <Text style={[styles.mono, font('regular')]}>{preview}</Text>
        <Pressable style={styles.danger} onPress={clearSession}>
          <Text style={[styles.dangerText, font('medium')]}>Clear session data</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 26, marginBottom: 6 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { color: colors.text, fontSize: 16, marginBottom: 8 },
  mono: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  danger: { marginTop: 14, alignSelf: 'flex-start' },
  dangerText: { color: colors.accent, fontSize: 14 },
});
