import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ComboProduct } from '../../home/HomeInterfaces';
import { ORDER_TEXT } from '../OrderConstants';
import { orderStyles } from '../styles';

interface OrderPromoSectionProps { title: string; expiresAt: Date; products: ComboProduct[]; onProductPress: (product: ComboProduct) => void;}

export function OrderPromoSection({ title, expiresAt, products, onProductPress }: OrderPromoSectionProps) {
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
        <Text style={orderStyles.promoTitle}>{title}</Text>
        <View style={orderStyles.promoCountdown}>
          <Text style={orderStyles.promoCountdownLabel}>
            {ORDER_TEXT.PROMO_EXPIRES_PREFIX}
          </Text>
          <Text style={orderStyles.promoCountdownValue}>{timeLeft}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={orderStyles.promoScroll}
      >
        {products.map((product) => (
          <View key={product.id} style={orderStyles.promoCard}>
            <View style={orderStyles.promoImageContainer}>
              <Image
                source={{ uri: product.imageUrl }}
                style={orderStyles.promoImage}
              />
              
              {(product.discountAmount ?? 0) > 0 && (
                <View style={orderStyles.discountBadge}>
                  <Text style={orderStyles.discountText}>
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
              <Text style={orderStyles.promoProductName} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={orderStyles.promoPriceRow}>
                <Text style={orderStyles.promoPrice}>
                  {`${product.price.toLocaleString('vi-VN')}VND`}
                </Text>
                
                {!!product.originalPrice && product.originalPrice > product.price && (
                  <Text style={orderStyles.promoOriginalPrice}>
                    {`${product.originalPrice.toLocaleString('vi-VN')}VND`}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={orderStyles.chooseButton}
                onPress={() => onProductPress(product)}
              >
                <Text style={orderStyles.chooseButtonText}>
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