import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { StoreSectionProps } from '../StoresInterfaces';
import { STORES_LAYOUT } from '../StoresLayout';
import { StoreCard } from './StoreCard';

export function StoreSection({ title, stores, onStorePress }: StoreSectionProps) {
  const BRAND_COLORS = useBrandColors();
  if (stores.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: BRAND_COLORS.secondary.s5 }]}>{title}</Text>
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onPress={() => onStorePress(store)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: STORES_LAYOUT.SECTION_MARGIN_HORIZONTAL,
    marginBottom: STORES_LAYOUT.SECTION_MARGIN_BOTTOM,
  },
  title: {
    fontSize: STORES_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: STORES_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
});