import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAddToCart } from '../../../../utils/hooks/useAddToCart';
import { BRAND_COLORS } from '../../../theme/colors';
import { HOME_TEXT } from '../HomeConstants';
import { ComboType } from '../HomeEnums';
import { Combo } from '../HomeInterfaces';
import { HOME_LAYOUT } from '../HomeLayout';

interface ComboHotSaleProps {
  combos: Combo[];
  type: ComboType;
}

const ComboItem = ({ combo }: { combo: Combo }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const handleAddToCart = useAddToCart();

  useEffect(() => {
    if (!combo.expiresAt) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = combo.expiresAt.getTime() - now;
      if (distance < 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [combo.expiresAt]);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.headerContainer}>
          <Text style={styles.comboTitle}>{combo.title}</Text>
        </View>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>{HOME_TEXT.COMBO_SECTION.EXPIRES_IN}</Text>
          <Text style={styles.countdownValue}>{timeLeft}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        {combo.products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleAddToCart({
              id: product.id,
              menuItemId: product.menuItemId || 0,
              productId: product.productId || parseInt(product.id) || 0,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl || '',
              categoryId: '',
              originalPrice: product.originalPrice,
              badge: product.badge,
              discount: undefined,
              status: 'AVAILABLE'
            })}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

              {(product.discountAmount ?? 0) > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {HOME_TEXT.COMBO_SECTION.DISCOUNT_PREFIX}
                    {product.discountAmount?.toLocaleString('vi-VN')}
                    {HOME_TEXT.COMBO_SECTION.DISCOUNT_SUFFIX}
                  </Text>
                </View>
              )}

              {product.badge && (
                <View style={styles.bestSellerBadge}>
                  <Text style={styles.bestSellerText}>BEST SELLER</Text>
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                {product.price.toLocaleString('vi-VN')}{HOME_TEXT.COMBO_SECTION.DISCOUNT_SUFFIX}
              </Text>
              <TouchableOpacity
                style={styles.chooseButton}
                onPress={() => ({
                  id: product.id,
                  menuItemId: product.menuItemId,
                  productId: product.productId,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  categoryId: product.categoryId,
                  originalPrice: product.originalPrice,
                  badge: product.badge,
                  discount: undefined,
                  status: 'AVAILABLE'
                })}
              >
                <Text style={styles.chooseButtonText}>{HOME_TEXT.COMBO_SECTION.CHOOSE_BUTTON}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export function ComboHotSale({ combos, type }: ComboHotSaleProps) {
  const filteredCombos = combos.filter((c) => c.type === type);

  if (!filteredCombos || filteredCombos.length === 0) return null;

  return (
    <View>
      {filteredCombos.map((combo) => (
        <ComboItem key={combo.id} combo={combo} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: HOME_LAYOUT.COMBO_SECTION_MARGIN_BOTTOM },
  headerRow: { marginBottom: HOME_LAYOUT.COMBO_TITLE_MARGIN_BOTTOM },
  headerContainer: {
    paddingHorizontal: HOME_LAYOUT.COMBO_SECTION_PADDING_HORIZONTAL,
    marginBottom: HOME_LAYOUT.COMBO_TITLE_MARGIN_BOTTOM,
  },
  comboTitle: {
    fontSize: HOME_LAYOUT.COMBO_TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: HOME_LAYOUT.COMBO_TITLE_LINE_HEIGHT,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.COMBO_SECTION_PADDING_HORIZONTAL,
    marginBottom: HOME_LAYOUT.COMBO_COUNTDOWN_CONTAINER_MARGIN_BOTTOM,
    gap: HOME_LAYOUT.COMBO_COUNTDOWN_GAP,
  },
  countdownLabel: {
    fontSize: HOME_LAYOUT.COMBO_COUNTDOWN_LABEL_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666666',
  },
  countdownValue: {
    fontSize: HOME_LAYOUT.COMBO_COUNTDOWN_VALUE_FONT_SIZE,
    fontFamily: 'SpaceMono-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  scrollView: { paddingVertical: HOME_LAYOUT.COMBO_PRODUCT_SCROLL_PADDING_VERTICAL },
  scrollContent: {
    paddingHorizontal: HOME_LAYOUT.COMBO_SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.COMBO_PRODUCT_SCROLL_GAP,
  },
  productCard: {
    width: HOME_LAYOUT.COMBO_PRODUCT_CARD_WIDTH,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: HOME_LAYOUT.COMBO_PRODUCT_CARD_BORDER_RADIUS,
    marginBottom: HOME_LAYOUT.COMBO_PRODUCT_CARD_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: HOME_LAYOUT.COMBO_PRODUCT_IMAGE_ASPECT_RATIO,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderTopLeftRadius: HOME_LAYOUT.COMBO_PRODUCT_IMAGE_BORDER_RADIUS_TOP_LEFT,
    borderTopRightRadius: HOME_LAYOUT.COMBO_PRODUCT_IMAGE_BORDER_RADIUS_TOP_RIGHT,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: HOME_LAYOUT.COMBO_PRODUCT_IMAGE_BORDER_RADIUS_TOP_LEFT,
    borderTopRightRadius: HOME_LAYOUT.COMBO_PRODUCT_IMAGE_BORDER_RADIUS_TOP_RIGHT,
  },
  discountBadge: {
    position: 'absolute',
    top: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_TOP,
    left: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_LEFT,
    backgroundColor: '#FF0000',
    borderRadius: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_BORDER_RADIUS,
    paddingHorizontal: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_PADDING_VERTICAL,
  },
  discountText: {
    fontSize: HOME_LAYOUT.COMBO_DISCOUNT_BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  bestSellerBadge: {
    position: 'absolute',
    top: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_TOP,
    right: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_RIGHT,
    width: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE,
    height: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE,
    backgroundColor: BRAND_COLORS.secondary.hongSua,
    borderRadius: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bestSellerText: {
    fontSize: 9,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
    textAlign: 'center',
    lineHeight: 12,
  },
  productInfo: { padding: HOME_LAYOUT.COMBO_PRODUCT_INFO_PADDING },
  productName: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_NAME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: HOME_LAYOUT.COMBO_PRODUCT_NAME_MARGIN_BOTTOM,
    minHeight: HOME_LAYOUT.COMBO_PRODUCT_NAME_MIN_HEIGHT,
  },
  productPrice: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_PRICE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: HOME_LAYOUT.COMBO_PRODUCT_PRICE_MARGIN_BOTTOM,
  },
  chooseButton: {
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_BORDER_RADIUS,
    paddingVertical: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
  },
  chooseButtonText: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
});