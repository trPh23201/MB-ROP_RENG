import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ENTRY_LAYOUT } from '../entry/EntryLayout';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Matches EntryProductCard: (screenWidth - 48) / 2  (16px padding each side + 16px gap)
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface SkeletonShimmerCardProps {
  width?: number;
  colorMode?: 'light' | 'dark';
}

export function SkeletonShimmerCard({ width = DEFAULT_CARD_WIDTH, colorMode = 'light' }: SkeletonShimmerCardProps) {
  return (
    <View style={[styles.card, { width }]}>
      {/* Image placeholder — same aspectRatio as EntryProductCard */}
      <Skeleton
        colorMode={colorMode}
        width={width}
        height={width} // aspectRatio 1
        radius={ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS}
      />
      <View style={styles.info}>
        {/* Product name line */}
        <Skeleton colorMode={colorMode} width={width * 0.75} height={14} radius={4} />
        <View style={styles.gap} />
        {/* Price line */}
        <Skeleton colorMode={colorMode} width={width * 0.45} height={14} radius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: ENTRY_LAYOUT.PRODUCT_CARD_MARGIN_BOTTOM,
    borderRadius: ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  info: {
    padding: ENTRY_LAYOUT.PRODUCT_CARD_INFO_PADDING,
  },
  gap: {
    height: 8,
  },
});
