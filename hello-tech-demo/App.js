import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

const COLORS = {
  bg: '#08090C',
  panel: '#11131A',
  textPrimary: '#F5F7FA',
  textSecondary: '#B5BED1',
  neonBlue: '#28D7FF',
  neonPink: '#FF3DAA',
  neonGreen: '#39FF9A',
};

const FONT_BY_WEIGHT = {
  regular: Platform.select({ ios: 'SF Pro Display', default: 'System' }),
  medium: Platform.select({ ios: 'SF Pro Display', default: 'System' }),
  semibold: Platform.select({ ios: 'SF Pro Display', default: 'System' }),
  bold: Platform.select({ ios: 'SF Pro Display', default: 'System' }),
};

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active ? styles.tabButtonActive : null]}>
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function HelloWorldScreen() {
  return (
    <View style={styles.centerContent}>
      <Text style={styles.helloLabel}>Hello world</Text>
      <Text style={styles.caption}>React Native + Expo running on iPhone/simulator dimensions.</Text>
    </View>
  );
}

function HelloStylesScreen() {
  const fontExamples = useMemo(
    () => [
      { key: 'regular', label: 'Regular (400)', style: styles.fontRegular },
      { key: 'medium', label: 'Medium (500)', style: styles.fontMedium },
      { key: 'semibold', label: 'Semibold (600)', style: styles.fontSemibold },
      { key: 'bold', label: 'Bold (700)', style: styles.fontBold },
    ],
    []
  );

  return (
    <ScrollView contentContainerStyle={styles.stylesContent}>
      <Text style={styles.sectionTitle}>Colors</Text>
      <View style={styles.colorRow}>
        <View style={[styles.swatch, { backgroundColor: COLORS.bg }]} />
        <View style={[styles.swatch, { backgroundColor: COLORS.neonBlue }]} />
        <View style={[styles.swatch, { backgroundColor: COLORS.neonPink }]} />
        <View style={[styles.swatch, { backgroundColor: COLORS.neonGreen }]} />
      </View>
      <Text style={styles.caption}>Dark base + neon accents from style guide.</Text>

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Typography (SF Pro Display)</Text>
      {fontExamples.map((item) => (
        <Text key={item.key} style={[styles.fontLine, item.style]}>
          {item.label}: The quick brown fox jumps over the lazy dog.
        </Text>
      ))}

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Iconography</Text>
      <View style={styles.iconRow}>
        <Ionicons name="pulse" size={30} color={COLORS.neonBlue} />
        <Ionicons name="moon" size={30} color={COLORS.neonPink} />
        <MaterialCommunityIcons name="music-note-eighth" size={30} color={COLORS.neonGreen} />
        <MaterialCommunityIcons name="headphones" size={30} color={COLORS.textPrimary} />
      </View>
      <Text style={styles.caption}>Consistent rounded-line icon style from Expo icon packs.</Text>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState('helloWorld');
  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.appBackground}>
      <SafeAreaView style={[styles.safeArea, isWeb ? styles.webPhoneShell : null]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TabButton label="Hello world" active={screen === 'helloWorld'} onPress={() => setScreen('helloWorld')} />
          <TabButton label="Hello styles" active={screen === 'helloStyles'} onPress={() => setScreen('helloStyles')} />
        </View>

        <View style={styles.contentCard}>
          {screen === 'helloWorld' ? <HelloWorldScreen /> : <HelloStylesScreen />}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  webPhoneShell: {
    width: 390,
    maxWidth: '100%',
    height: 844,
    maxHeight: '100%',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#1F2638',
    overflow: 'hidden',
    paddingTop: 14,
    paddingBottom: 12,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1C2030',
    backgroundColor: COLORS.panel,
  },
  tabButtonActive: {
    borderColor: COLORS.neonBlue,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  tabText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONT_BY_WEIGHT.medium,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.textPrimary,
  },
  contentCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: '#1A1F2D',
    padding: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloLabel: {
    color: COLORS.textPrimary,
    fontSize: 40,
    fontFamily: FONT_BY_WEIGHT.bold,
    fontWeight: '700',
    marginBottom: 12,
  },
  caption: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FONT_BY_WEIGHT.regular,
    fontWeight: '400',
  },
  stylesContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: FONT_BY_WEIGHT.semibold,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionSpacing: {
    marginTop: 22,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2F42',
  },
  fontLine: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  fontRegular: {
    fontFamily: FONT_BY_WEIGHT.regular,
    fontWeight: '400',
  },
  fontMedium: {
    fontFamily: FONT_BY_WEIGHT.medium,
    fontWeight: '500',
  },
  fontSemibold: {
    fontFamily: FONT_BY_WEIGHT.semibold,
    fontWeight: '600',
  },
  fontBold: {
    fontFamily: FONT_BY_WEIGHT.bold,
    fontWeight: '700',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    marginBottom: 8,
  },
});
