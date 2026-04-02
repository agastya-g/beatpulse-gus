import React, { useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

/** iPhone 14 Pro–style logical size (CSS points) */
const PHONE_W = 390;
const PHONE_H = 844;

type Props = { children: React.ReactNode };

export function WebPhoneFrame({ children }: Props) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return <WebPhoneFrameInner>{children}</WebPhoneFrameInner>;
}

function WebPhoneFrameInner({ children }: Props) {
  const { width: vw, height: vh } = useWindowDimensions();

  const { frameW, frameH, radius } = useMemo(() => {
    const margin = 28;
    const maxW = Math.max(280, vw - margin);
    const maxH = Math.max(400, vh - margin);
    let fw = Math.min(PHONE_W, maxW);
    let fh = (fw * PHONE_H) / PHONE_W;
    if (fh > maxH) {
      fh = maxH;
      fw = (fh * PHONE_W) / PHONE_H;
    }
    return { frameW: fw, frameH: fh, radius: Math.min(44, fw * 0.11) };
  }, [vw, vh]);

  return (
    <View style={[styles.backdrop, { height: vh, minHeight: vh }]}>
      <View
        style={[
          styles.bezel,
          {
            width: frameW,
            height: frameH,
            borderRadius: radius,
          },
        ]}
      >
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: '100%',
    backgroundColor: '#0a0a0c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  bezel: {
    backgroundColor: '#1a1a1e',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#2e2e33',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 28,
  },
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0B0F1A',
    overflow: 'hidden',
  },
});
