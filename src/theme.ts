import { Platform, TextStyle } from 'react-native';

export const colors = {
  bg: '#0B0F1A',
  surface: '#14182E',
  accent: '#FF2E63',
  cyan: '#00F5FF',
  mint: '#7CFFB2',
  text: '#F8F9FA',
  muted: '#8A8F98',
} as const;

export const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif',
  default: 'System',
});

export function font(weight: 'bold' | 'semibold' | 'medium' | 'regular'): TextStyle {
  const map = {
    bold: '700' as const,
    semibold: '600' as const,
    medium: '500' as const,
    regular: '400' as const,
  };
  return {
    fontFamily,
    fontWeight: map[weight],
  };
}
