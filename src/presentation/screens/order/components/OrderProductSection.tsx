import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../../../../domain/entities/Product';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { ORDER_TEXT } from '../OrderConstants';
import { orderStyles } from '../styles';

interface OrderProductSectionProps {
  title: string;
  products: Product[];
  onAddPress: (product: Product) => void;
}

export function OrderProductSection({
  title,
  products,
  onAddPress,
}: OrderProductSectionProps) {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={orderStyles.productSection}>
      <Text style={[orderStyles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{title}</Text>
      {products.map((product) => (
        <View key={product.id} style={orderStyles.productItem}>
          <Image
            source={{ uri: product.imageUrl }}
            style={[orderStyles.productImage, { backgroundColor: BRAND_COLORS.primary.p1 }]}
            contentFit="cover"
            cachePolicy="disk"
          />
          <View style={orderStyles.productInfo}>
            <Text style={[orderStyles.productName, { color: BRAND_COLORS.ui.heading }]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[orderStyles.productPrice, { color: BRAND_COLORS.ui.heading }]}>
              {product.price.toLocaleString('vi-VN')}
              {ORDER_TEXT.CURRENCY_SUFFIX}
            </Text>
          </View>
          <TouchableOpacity
            style={[orderStyles.productAddButton, { backgroundColor: BRAND_COLORS.bta.primaryBg }]}
            onPress={() => onAddPress(product)}
          >
            <AppIcon name="add" size={'xs'} style={[orderStyles.productAddText, { color: BRAND_COLORS.bta.primaryText }]} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}