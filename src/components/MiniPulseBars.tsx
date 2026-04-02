import React, { useMemo } from 'react';
import { View } from 'react-native';
import { colors } from '../theme';

export function MiniPulseBars({ vector, barCount = 24 }: { vector: number[]; barCount?: number }) {
  const heights = useMemo(() => {
    const base = vector.length ? vector : [0.5];
    const out: number[] = [];
    for (let i = 0; i < barCount; i++) {
      const v = base[i % base.length];
      const wobble = Math.sin((i / barCount) * Math.PI * 2) * 0.08;
      out.push(Math.max(0.15, Math.min(1, v + wobble)));
    }
    return out;
  }, [vector, barCount]);

  const maxH = 52;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 56 }}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            width: 6,
            marginRight: i === heights.length - 1 ? 0 : 3,
            height: 4 + h * maxH,
            backgroundColor: colors.accent,
            borderRadius: 2,
            opacity: 0.9,
          }}
        />
      ))}
    </View>
  );
}
