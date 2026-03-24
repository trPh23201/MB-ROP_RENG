import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAddToCart } from '../../../../utils/hooks/useAddToCart';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { HOME_TEXT } from '../HomeConstants';
import { ComboType } from '../HomeEnums';
import { Combo } from '../HomeInterfaces';
import { HOME_LAYOUT } from '../HomeLayout';

interface ComboHotSaleProps {
  combos: Combo[];
  type: ComboType;
}

const ComboItem = ({ combo }: { combo: Combo }) => {
  const BRAND_COLORS = useBrandColors();  
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
          <Text style={[styles.comboTitle, { color: BRAND_COLORS.primary.p3 }]}>{combo.title}</Text>
        </View>

        <View style={styles.countdownContainer}>
          <Text style={[styles.countdownLabel, { color: BRAND_COLORS.secondary.s3 }]}>{HOME_TEXT.COMBO_SECTION.EXPIRES_IN}</Text>
          <Text style={[styles.countdownValue, { color: BRAND_COLORS.primary.p3 }]}>{timeLeft}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        {combo.products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, { backgroundColor: BRAND_COLORS.primary.p1 }]}
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
            <View style={[styles.imageContainer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} contentFit="cover" cachePolicy="disk" />

              {(product.discountAmount ?? 0) > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={[styles.discountText, { color: BRAND_COLORS.primary.p1 }]}>
                    {HOME_TEXT.COMBO_SECTION.DISCOUNT_PREFIX}
                    {product.discountAmount?.toLocaleString('vi-VN')}
                    {HOME_TEXT.COMBO_SECTION.DISCOUNT_SUFFIX}
                  </Text>
                </View>
              )}

              {product.badge && (
                <View style={[styles.bestSellerBadge, { backgroundColor: BRAND_COLORS.secondary.s5 }]}>
                  <Text style={[styles.bestSellerText, { color: BRAND_COLORS.primary.p1 }]}>BEST SELLER</Text>
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: BRAND_COLORS.primary.p3 }]} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={[styles.productPrice, { color: BRAND_COLORS.primary.p3 }]}>
                {product.price.toLocaleString('vi-VN')}{HOME_TEXT.COMBO_SECTION.DISCOUNT_SUFFIX}
              </Text>
              <TouchableOpacity
                style={[styles.chooseButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}
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
                <Text style={[styles.chooseButtonText, { color: BRAND_COLORS.primary.p3 }]}>{HOME_TEXT.COMBO_SECTION.CHOOSE_BUTTON}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export function ComboHotSale({ combos, type }: ComboHotSaleProps) {
  const BRAND_COLORS = useBrandColors();
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
  },
  countdownValue: {
    fontSize: HOME_LAYOUT.COMBO_COUNTDOWN_VALUE_FONT_SIZE,
    fontFamily: 'SpaceMono-Bold',
  },
  scrollView: { paddingVertical: HOME_LAYOUT.COMBO_PRODUCT_SCROLL_PADDING_VERTICAL },
  scrollContent: {
    paddingHorizontal: HOME_LAYOUT.COMBO_SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.COMBO_PRODUCT_SCROLL_GAP,
  },
  productCard: {
    width: HOME_LAYOUT.COMBO_PRODUCT_CARD_WIDTH,
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
  },
  bestSellerBadge: {
    position: 'absolute',
    top: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_TOP,
    right: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_RIGHT,
    width: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE,
    height: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE,
    borderRadius: HOME_LAYOUT.COMBO_BEST_SELLER_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bestSellerText: {
    fontSize: 9,
    fontFamily: 'Phudu-Bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  productInfo: { padding: HOME_LAYOUT.COMBO_PRODUCT_INFO_PADDING },
  productName: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_NAME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: HOME_LAYOUT.COMBO_PRODUCT_NAME_MARGIN_BOTTOM,
    minHeight: HOME_LAYOUT.COMBO_PRODUCT_NAME_MIN_HEIGHT,
  },
  productPrice: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_PRICE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: HOME_LAYOUT.COMBO_PRODUCT_PRICE_MARGIN_BOTTOM,
  },
  chooseButton: {
    borderRadius: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_BORDER_RADIUS,
    paddingVertical: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
  },
  chooseButtonText: {
    fontSize: HOME_LAYOUT.COMBO_PRODUCT_BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
});