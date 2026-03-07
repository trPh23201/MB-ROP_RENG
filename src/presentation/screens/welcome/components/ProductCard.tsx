import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

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

export function ProductCard({ product, onPress }: ProductCardProps) {
  const formattedPrice = `${product.price.toLocaleString('vi-VN')}đ`;
  const formattedOriginalPrice = product.originalPrice
    ? `${product.originalPrice.toLocaleString('vi-VN')}đ`
    : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        {product.badge && (
          <View
            style={[
              styles.badge,
              product.badge === 'NEW' ? styles.badgeNew : styles.badgeHot,
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
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onPress?.(product)}
          >
            <AppIcon name="add" size="xs" style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        {formattedOriginalPrice && (
          <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: WELCOME_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
    marginBottom: WELCOME_LAYOUT.PRODUCT_CARD_MARGIN_BOTTOM,
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
    aspectRatio: WELCOME_LAYOUT.PRODUCT_IMAGE_ASPECT_RATIO,
    borderTopLeftRadius: WELCOME_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
    borderTopRightRadius: WELCOME_LAYOUT.PRODUCT_CARD_BORDER_RADIUS,
  },
  badge: {
    position: 'absolute',
    top: WELCOME_LAYOUT.PRODUCT_BADGE_TOP,
    left: WELCOME_LAYOUT.PRODUCT_BADGE_LEFT,
    paddingHorizontal: WELCOME_LAYOUT.PRODUCT_BADGE_PADDING_HORIZONTAL,
    paddingVertical: WELCOME_LAYOUT.PRODUCT_BADGE_PADDING_VERTICAL,
    borderRadius: WELCOME_LAYOUT.PRODUCT_BADGE_BORDER_RADIUS,
  },
  badgeNew: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
  },
  badgeHot: {
    backgroundColor: '#FF6B6B',
  },
  badgeText: {
    fontSize: WELCOME_LAYOUT.PRODUCT_BADGE_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  discountBadge: {
    position: 'absolute',
    top: WELCOME_LAYOUT.PRODUCT_BADGE_TOP,
    right: WELCOME_LAYOUT.PRODUCT_BADGE_RIGHT,
    backgroundColor: '#FF3B30',
    paddingHorizontal: WELCOME_LAYOUT.PRODUCT_DISCOUNT_BADGE_PADDING_HORIZONTAL,
    paddingVertical: WELCOME_LAYOUT.PRODUCT_DISCOUNT_BADGE_PADDING_VERTICAL,
    borderRadius: WELCOME_LAYOUT.PRODUCT_DISCOUNT_BADGE_BORDER_RADIUS,
  },
  discountText: {
    fontSize: WELCOME_LAYOUT.PRODUCT_BADGE_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  info: {
    padding: WELCOME_LAYOUT.PRODUCT_CARD_INFO_PADDING,
  },
  name: {
    fontSize: WELCOME_LAYOUT.PRODUCT_NAME_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
    marginBottom: WELCOME_LAYOUT.PRODUCT_NAME_MARGIN_BOTTOM,
    minHeight: WELCOME_LAYOUT.PRODUCT_NAME_MIN_HEIGHT,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: WELCOME_LAYOUT.PRODUCT_PRICE_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  originalPrice: {
    fontSize: WELCOME_LAYOUT.PRODUCT_ORIGINAL_PRICE_SIZE,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
    textDecorationLine: 'line-through',
    marginTop: WELCOME_LAYOUT.PRODUCT_ORIGINAL_PRICE_MARGIN_TOP,
  },
  addButton: {
    width: WELCOME_LAYOUT.PRODUCT_ADD_BUTTON_SIZE,
    height: WELCOME_LAYOUT.PRODUCT_ADD_BUTTON_SIZE,
    borderRadius: WELCOME_LAYOUT.PRODUCT_ADD_BUTTON_BORDER_RADIUS,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: BRAND_COLORS.primary.beSua,
  },
});