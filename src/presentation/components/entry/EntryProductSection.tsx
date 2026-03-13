import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Category, Product } from '@/src/data/mockProducts';
import { useBrandColors } from '../../theme/BrandColorContext';
import { EntryProductCard } from './EntryProductCard';

interface EntryProductSectionProps {
  category?: Category;
  title?: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export function EntryProductSection({ category, title, products, onProductPress }: EntryProductSectionProps) {
  const BRAND_COLORS = useBrandColors();
  if (products.length === 0) return null;

  const displayTitle = title || category?.name || '';

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: BRAND_COLORS.primary.p3 }]}>{displayTitle}</Text>
      <View style={styles.grid}>
        {products.map((product) => (
          <EntryProductCard
            key={product.id}
            product={product}
            onPress={onProductPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
