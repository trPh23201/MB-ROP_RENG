import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectPreOrderType } from '../../../state/slices/preOrderSlice';
import { useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TYPE_LABELS } from '../order/OrderConstants';
import { OrderService } from '../order/OrderService';

interface MiniCartButtonProps {
  onPress: () => void;
}

export function MiniCartButton({ onPress }: MiniCartButtonProps) {
  const insets = useSafeAreaInsets();
  const { totalItems, totalPrice, selectedStore } = useAppSelector((state) => state.orderCart);
  const orderType = useAppSelector(selectPreOrderType);

  const bottomSpacing = 10;

  if (totalItems === 0) {
    return null;
  }

  const orderTypeLabel = ORDER_TYPE_LABELS[orderType];
  const orderTypeIcon = OrderService.getOrderTypeIcon(orderType);

  return (
    <View style={[styles.container, { bottom: bottomSpacing }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.topRow}>
          <View style={styles.storeInfo}>
            <Ionicons name={orderTypeIcon as any} size={14} color={BRAND_COLORS.secondary.nauEspresso} />
            <Text style={styles.storeText} numberOfLines={1}>
              {orderTypeLabel} · {selectedStore?.name || 'Rốp Rẻng'}
            </Text>
          </View>
          <View style={styles.itemCountPill}>
            <Text style={styles.itemCountText}>{totalItems} món</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.cartIconWrap}>
            <Ionicons name="cart" size={20} color={BRAND_COLORS.bta.primaryText} />
          </View>
          <Text style={styles.label}>Xem giỏ hàng</Text>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{OrderService.formatPrice(totalPrice)}</Text>
            <Ionicons name="chevron-forward" size={18} color={BRAND_COLORS.secondary.nauEspresso} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  button: {
    backgroundColor: BRAND_COLORS.secondary.hongSua,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: BRAND_COLORS.secondary.nauEspresso,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  storeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.secondary.nauEspresso,
    opacity: 0.8,
  },
  itemCountPill: {
    backgroundColor: `${BRAND_COLORS.secondary.nauEspresso}20`,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  itemCountText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.secondary.nauEspresso,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.secondary.nauEspresso,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    color: BRAND_COLORS.secondary.nauEspresso,
  },
});