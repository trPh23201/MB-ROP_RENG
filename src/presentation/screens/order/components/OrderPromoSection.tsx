import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ComboProduct } from '../../home/HomeInterfaces';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { ORDER_TEXT } from '../OrderConstants';
import { orderStyles } from '../styles';

interface OrderPromoSectionProps { title: string; expiresAt: Date; products: ComboProduct[]; onProductPress: (product: ComboProduct) => void;}

export function OrderPromoSection({ title, expiresAt, products, onProductPress }: OrderPromoSectionProps) {
  const BRAND_COLORS = useBrandColors();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiresAt.getTime() - now;

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

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <View style={orderStyles.promoSection}>
      <View style={orderStyles.promoHeader}>
        <Text style={[orderStyles.promoTitle, { color: BRAND_COLORS.ui.heading }]}>{title}</Text>
        <View style={orderStyles.promoCountdown}>
          <Text style={[orderStyles.promoCountdownLabel, { color: BRAND_COLORS.ui.subtitle }]}>
            {ORDER_TEXT.PROMO_EXPIRES_PREFIX}
          </Text>
          <Text style={[orderStyles.promoCountdownValue, { color: BRAND_COLORS.ui.heading }]}>{timeLeft}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={orderStyles.promoScroll}
      >
        {products.map((product) => (
          <View key={product.id} style={[orderStyles.promoCard, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
            <View style={[orderStyles.promoImageContainer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
              <Image
                source={{ uri: product.imageUrl }}
                style={orderStyles.promoImage}
                contentFit="cover"
                cachePolicy="disk"
              />
              
              {(product.discountAmount ?? 0) > 0 && (
                <View style={[orderStyles.discountBadge, { backgroundColor: '#FF0000' }]}>
                  <Text style={[orderStyles.discountText, { color: BRAND_COLORS.bta.primaryText }]}>
                    {`-${(product.discountAmount || 0).toLocaleString('vi-VN')}VND`}
                  </Text>
                </View>
              )}
              
              {/* {!!product.discount && (
                <View style={orderStyles.percentBadge}>
                  <Text style={orderStyles.percentText}>
                    {String(product.discount)}
                  </Text>
                </View>
              )} */}
            </View>

            <View style={orderStyles.promoInfo}>
              <Text style={[orderStyles.promoProductName, { color: BRAND_COLORS.ui.heading }]} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={orderStyles.promoPriceRow}>
                <Text style={[orderStyles.promoPrice, { color: BRAND_COLORS.ui.heading }]}>
                  {`${product.price.toLocaleString('vi-VN')}VND`}
                </Text>
                
                {!!product.originalPrice && product.originalPrice > product.price && (
                  <Text style={[orderStyles.promoOriginalPrice, { color: BRAND_COLORS.ui.placeholder }]}>
                    {`${product.originalPrice.toLocaleString('vi-VN')}VND`}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={[orderStyles.chooseButton, { backgroundColor: BRAND_COLORS.bta.primaryBg }]}
                onPress={() => onProductPress(product)}
              >
                <Text style={[orderStyles.chooseButtonText, { color: BRAND_COLORS.bta.primaryText }]}>
                  {ORDER_TEXT.CHOOSE_BUTTON}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}