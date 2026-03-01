import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../../../../domain/entities/Product';
import { AppIcon } from '../../../components/shared/AppIcon';
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
  return (
    <View style={orderStyles.productSection}>
      <Text style={orderStyles.sectionTitle}>{title}</Text>
      {products.map((product) => (
        <View key={product.id} style={orderStyles.productItem}>
          <Image
            source={{ uri: product.imageUrl }}
            style={orderStyles.productImage}
          />
          <View style={orderStyles.productInfo}>
            <Text style={orderStyles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={orderStyles.productPrice}>
              {product.price.toLocaleString('vi-VN')}
              {ORDER_TEXT.CURRENCY_SUFFIX}
            </Text>
          </View>
          <TouchableOpacity
            style={orderStyles.productAddButton}
            onPress={() => onAddPress(product)}
          >
            <AppIcon name="add" size={'xs'} style={orderStyles.productAddText} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}