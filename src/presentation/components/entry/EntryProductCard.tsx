import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../shared/AppIcon';
import { useBrandColors } from '../../theme/BrandColorContext';
import { ENTRY_LAYOUT } from './EntryLayout';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export interface ProductCardData {
  id: string;
  menuItemId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  originalPrice?: number;
  badge?: 'NEW' | 'HOT';
  discount?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  onPress?: (product: ProductCardData) => void;
}

export function EntryProductCard({ product, onPress }: ProductCardProps) {
  const BRAND_COLORS = useBrandColors();
  const formattedPrice = `${product.price.toLocaleString('vi-VN')}đ`;
  const formattedOriginalPrice = product.originalPrice
    ? `${product.originalPrice.toLocaleString('vi-VN')}đ`
    : null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: BRAND_COLORS.primary.p1 }]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" cachePolicy="disk" />
        {product.badge && (
          <View
            style={[
              styles.badge,
              product.badge === 'NEW' ? [styles.badgeNew, { backgroundColor: BRAND_COLORS.primary.p3 }] : styles.badgeHot,
            ]}
          >
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: BRAND_COLORS.text.primary }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: BRAND_COLORS.primary.p3 }]}>{formattedPrice}</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: BRAND_COLORS.primary.p3 }]}
            onPress={() => onPress?.(product)}
          >
            <AppIcon name="add" size="xs" style={[styles.addIcon, { color: BRAND_COLORS.primary.p1 }]} />
          </TouchableOpacity>
        </View>
        {formattedOriginalPrice && (
          <Text style={[styles.originalPrice, { color: BRAND_COLORS.text.secondary }]}>{formattedOriginalPrice}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
    marginBottom: ENTRY_LAYOUT.PRODUCT_CARD_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: ENTRY_LAYOUT.PRODUCT_IMAGE_ASPECT_RATIO,
    borderTopLeftRadius: ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
    borderTopRightRadius: ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
  },
  badge: {
    position: 'absolute',
    top: ENTRY_LAYOUT.PRODUCT_BADGE_TOP,
    left: ENTRY_LAYOUT.PRODUCT_BADGE_LEFT,
    paddingHorizontal: ENTRY_LAYOUT.PRODUCT_BADGE_PADDING_HORIZONTAL,
    paddingVertical: ENTRY_LAYOUT.PRODUCT_BADGE_PADDING_VERTICAL,
    borderRadius: ENTRY_LAYOUT.PRODUCT_BADGE_BORDER_RADIUS,
  },
  badgeNew: {
  },
  badgeHot: {
    backgroundColor: '#FF6B6B',
  },
  badgeText: {
    fontSize: ENTRY_LAYOUT.PRODUCT_BADGE_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  discountBadge: {
    position: 'absolute',
    top: ENTRY_LAYOUT.PRODUCT_BADGE_TOP,
    right: ENTRY_LAYOUT.PRODUCT_BADGE_RIGHT,
    backgroundColor: '#FF3B30',
    paddingHorizontal: ENTRY_LAYOUT.PRODUCT_DISCOUNT_BADGE_PADDING_HORIZONTAL,
    paddingVertical: ENTRY_LAYOUT.PRODUCT_DISCOUNT_BADGE_PADDING_VERTICAL,
    borderRadius: ENTRY_LAYOUT.PRODUCT_DISCOUNT_BADGE_BORDER_RADIUS,
  },
  discountText: {
    fontSize: ENTRY_LAYOUT.PRODUCT_BADGE_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  info: {
    padding: ENTRY_LAYOUT.PRODUCT_CARD_INFO_PADDING,
  },
  name: {
    fontSize: ENTRY_LAYOUT.PRODUCT_NAME_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: ENTRY_LAYOUT.PRODUCT_NAME_MARGIN_BOTTOM,
    minHeight: ENTRY_LAYOUT.PRODUCT_NAME_MIN_HEIGHT,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: ENTRY_LAYOUT.PRODUCT_PRICE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  originalPrice: {
    fontSize: ENTRY_LAYOUT.PRODUCT_ORIGINAL_PRICE_SIZE,
    fontFamily: 'SpaceGrotesk-Regular',
    textDecorationLine: 'line-through',
    marginTop: ENTRY_LAYOUT.PRODUCT_ORIGINAL_PRICE_MARGIN_TOP,
  },
  addButton: {
    width: ENTRY_LAYOUT.PRODUCT_ADD_BUTTON_SIZE,
    height: ENTRY_LAYOUT.PRODUCT_ADD_BUTTON_SIZE,
    borderRadius: ENTRY_LAYOUT.PRODUCT_ADD_BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
  },
});
