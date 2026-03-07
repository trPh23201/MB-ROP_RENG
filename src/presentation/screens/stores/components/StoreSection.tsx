import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { StoreSectionProps } from '../StoresInterfaces';
import { STORES_LAYOUT } from '../StoresLayout';
import { StoreCard } from './StoreCard';

export function StoreSection({ title, stores, onStorePress }: StoreSectionProps) {
  if (stores.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
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
    color: BRAND_COLORS.secondary.reuDam,
    marginBottom: STORES_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
});