import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonShimmerCard } from './skeleton-shimmer-card';

interface SkeletonShimmerListProps {
  count?: number;
  colorMode?: 'light' | 'dark';
}

// Renders skeleton cards in a 2-column grid matching HomeScreen FlatList layout
export function SkeletonShimmerList({ count = 6, colorMode = 'light' }: SkeletonShimmerListProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  // Group items into rows of 2
  const rows: number[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <Skeleton.Group show>
      <View style={styles.container}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((itemIndex) => (
              <SkeletonShimmerCard key={itemIndex} colorMode={colorMode} />
            ))}
            {/* Fill empty slot when odd count on last row */}
            {row.length === 1 && <View style={styles.emptySlot} />}
          </View>
        ))}
      </View>
    </Skeleton.Group>
  );
}

const styles = StyleSheet.create({
  // paddingHorizontal 16 matches HomeScreen listContent style
  container: {
    paddingHorizontal: 16,
  },
  // justifyContent: 'space-between' matches HomeScreen columnWrapperStyle
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptySlot: {
    flex: 1,
  },
});
