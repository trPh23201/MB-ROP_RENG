import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';

interface ProductDetailHeaderProps {
  imageUrl: string;
  productName: string;
}

// Animated header for product detail screen.
// Enters with FadeInUp spring animation on mount.
export function ProductDetailHeader({ imageUrl, productName }: ProductDetailHeaderProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15).stiffness(120)}
      style={styles.container}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        cachePolicy="disk"
      />
      <Text
        style={[styles.name, { color: BRAND_COLORS.ui.heading }]}
        numberOfLines={2}
      >
        {productName}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    marginTop: 12,
    textAlign: 'center',
  },
});
