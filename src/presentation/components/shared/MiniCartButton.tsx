import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectPreOrderType } from '../../../state/slices/preOrderSlice';
import { useAppSelector } from '../../../utils/hooks';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TYPE_LABELS } from '../order/OrderConstants';
import { OrderService } from '../order/OrderService';
import { HapticFeedback } from '../../utils/HapticFeedback';

interface MiniCartButtonProps {
  onPress: () => void;
}

export function MiniCartButton({ onPress }: MiniCartButtonProps) {
  const BRAND_COLORS = useBrandColors();
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
        style={[styles.button, { backgroundColor: BRAND_COLORS.secondary.s4, shadowColor: BRAND_COLORS.secondary.s3 }]}
        onPress={() => { HapticFeedback.light(); onPress(); }}
        activeOpacity={0.85}
      >
        <View style={styles.topRow}>
          <View style={styles.storeInfo}>
            <Ionicons name={orderTypeIcon as any} size={14} color={BRAND_COLORS.secondary.s3} />
            <Text style={[styles.storeText, { color: BRAND_COLORS.secondary.s3 }]} numberOfLines={1}>
              {orderTypeLabel} · {selectedStore?.name || 'Rốp Rẻng'}
            </Text>
          </View>
          <View style={[styles.itemCountPill, { backgroundColor: `${BRAND_COLORS.secondary.s3}20` }]}>
            <Text style={[styles.itemCountText, { color: BRAND_COLORS.secondary.s3 }]}>{totalItems} món</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={[styles.cartIconWrap, { backgroundColor: BRAND_COLORS.secondary.s3 }]}>
            <Ionicons name="cart" size={20} color={BRAND_COLORS.bta.primaryText} />
          </View>
          <Text style={[styles.label, { color: BRAND_COLORS.secondary.s3 }]}>Xem giỏ hàng</Text>
          <View style={styles.priceSection}>
            <Text style={[styles.price, { color: BRAND_COLORS.secondary.s3 }]}>{OrderService.formatPrice(totalPrice)}</Text>
            <Ionicons name="chevron-forward" size={18} color={BRAND_COLORS.secondary.s3} />
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
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
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
    opacity: 0.8,
  },
  itemCountPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  itemCountText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
  },
});