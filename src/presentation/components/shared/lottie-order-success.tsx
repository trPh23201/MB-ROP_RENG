import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { HapticFeedback } from '../../utils/HapticFeedback';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';

interface LottieOrderSuccessProps {
  visible: boolean;
  onAnimationFinish: () => void;
}

export function LottieOrderSuccess({ visible, onAnimationFinish }: LottieOrderSuccessProps) {
  const BRAND_COLORS = useBrandColors();
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible) {
      HapticFeedback.success();
      lottieRef.current?.play();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={styles.content}>
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/lottie/order-success.json')}
          style={styles.lottie}
          autoPlay={false}
          loop={false}
          onAnimationFinish={onAnimationFinish}
        />
        <Animated.View entering={FadeInUp.delay(500).springify().damping(15).stiffness(120)}>
          <Text style={[styles.successText, { color: BRAND_COLORS.semantic?.success || '#4CAF50' }]}>
            Đặt hàng thành công!
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: { alignItems: 'center', gap: 24 },
  lottie: { width: 200, height: 200 },
  successText: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    textAlign: 'center',
  },
});
