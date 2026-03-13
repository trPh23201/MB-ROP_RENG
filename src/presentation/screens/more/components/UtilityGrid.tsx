import { useBrandColors } from '@/src/presentation/theme/BrandColorContext';
import React from 'react';
import { View } from 'react-native';
import { UTILITIES } from '../MoreConstants';
import { styles } from '../styles';
import { UtilityItem } from './UtilityItem';

interface UtilityGridProps {
  onItemPress?: (id: string) => void;
}

export function UtilityGrid({ onItemPress }: UtilityGridProps) {
  const BRAND_COLORS = useBrandColors();
  const handlePress = (id: string) => {
    if (onItemPress) {
      onItemPress(id);
    }
  };

  return (
    <View style={[styles.sectionContainer, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
      <View style={styles.gridContainer}>
        {UTILITIES.map((item) => (
          <UtilityItem key={item.id} item={item} onPress={handlePress} />
        ))}
      </View>
    </View>
  );
};