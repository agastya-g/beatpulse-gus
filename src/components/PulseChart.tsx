import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, font } from '../theme';

type Props = {
  vector: number[];
  width: number;
  height: number;
  timeLabels?: string[];
};

export function PulseChart({ vector, width, height, timeLabels }: Props) {
  const path = useMemo(() => {
    const pts = 48;
    const step = width / (pts - 1);
    const base = [0.5, ...vector.slice(0, 6), 0.3];
    const out: string[] = [];
    for (let i = 0; i < pts; i++) {
      const t = i / (pts - 1);
      const phase = Math.sin(t * Math.PI * 4) * 0.15;
      const mix = Math.sin(t * Math.PI * 8) * 0.1;
      const idx = (i % base.length) + Math.floor(i / 8) * 0.1;
      const v = base[Math.floor(idx) % base.length] + phase + mix;
      const y = height - 8 - v * (height - 24);
      const x = i * step;
      out.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return out.join(' ');
  }, [vector, width, height]);

  const fillPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent} stopOpacity="0.45" />
            <Stop offset="1" stopColor={colors.accent} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        <Path d={fillPath} fill="url(#pulseFill)" />
        <Path stroke={colors.accent} strokeWidth={2} fill="none" d={path} />
      </Svg>
      {timeLabels && timeLabels.length ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
            paddingHorizontal: 2,
          }}
        >
          {timeLabels.map((t) => (
            <Text key={t} style={[{ color: colors.muted, fontSize: 11 }, font('regular')]}>
              {t}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
