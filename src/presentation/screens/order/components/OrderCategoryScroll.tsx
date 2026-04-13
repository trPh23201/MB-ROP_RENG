import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_CATEGORIES } from '../../../../data/mockProducts';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { ORDER_LAYOUT } from '../OrderLayout';

export function OrderCategoryScroll() {
  const BRAND_COLORS = useBrandColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {MOCK_CATEGORIES.map((category) => (
        <TouchableOpacity key={category.id} style={styles.item}>
          <View style={[styles.iconContainer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
            <AppIcon name={category.icon} size="lg" color={BRAND_COLORS.primary.p3} />
          </View>
          <Text style={[styles.label, { color: BRAND_COLORS.primary.p3 }]} numberOfLines={2}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: ORDER_LAYOUT.CATEGORY_SCROLL_PADDING,
    gap: ORDER_LAYOUT.CATEGORY_SCROLL_GAP,
    paddingVertical: 12,
  },
  item: {
    alignItems: 'center',
    width: ORDER_LAYOUT.CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: ORDER_LAYOUT.CATEGORY_ICON_SIZE,
    height: ORDER_LAYOUT.CATEGORY_ICON_SIZE,
    borderRadius: ORDER_LAYOUT.CATEGORY_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: ORDER_LAYOUT.CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
});