import { Order } from '@/src/domain/entities/Order';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { PAYMENT_STATUS_LABELS } from '../OrderHistoryConstants';
import { OrderHistoryService } from '../OrderHistoryService';

interface OrderHistoryItemProps {
  order: Order;
  onPress: () => void;
}

const STATUS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pending: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  preparing: 'restaurant-outline',
  ready: 'bag-check-outline',
  delivering: 'bicycle-outline',
  completed: 'checkmark-done-circle-outline',
  cancelled: 'close-circle-outline',
};

const service = new OrderHistoryService();

export const OrderHistoryItem = memo(function OrderHistoryItem({ order, onPress }: OrderHistoryItemProps) {
  const BRAND_COLORS = useBrandColors();

  const statusColor = BRAND_COLORS.secondary.s3;
  const statusLabel = order.orderStatus;
  const paymentLabel = PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus;

  const itemsPreview = useMemo(() => {
    const maxShow = 2;
    const shown = order.items.slice(0, maxShow);
    const remaining = order.items.length - maxShow;
    return { shown, remaining };
  }, [order.items]);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={[styles.orderCode, { color: BRAND_COLORS.ui.heading }]}>{order.orderCode}</Text>
          <Text style={[styles.dateText, { color: BRAND_COLORS.ui.subtitle }]}>{service.formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.storeRow}>
        <Ionicons name="storefront-outline" size={14} color={BRAND_COLORS.ui.subtitle} />
        <Text style={[styles.storeText, { color: BRAND_COLORS.ui.subtitle }]}>{service.getStoreLabel(order.storeId)}</Text>
        <Text style={[styles.paymentChip, { backgroundColor: BRAND_COLORS.screenBg.warm, color: BRAND_COLORS.ui.subtitle }]}>{paymentLabel}</Text>
      </View>

      <View style={styles.itemsSection}>
        {itemsPreview.shown.map((item, index) => (
          <View key={item.id || index} style={styles.itemRow}>
            <Text style={[styles.itemQty, { color: BRAND_COLORS.ui.subtitle }]}>{item.qty}x</Text>
            <Text style={[styles.itemName, { color: BRAND_COLORS.ui.subtitle }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.itemPrice, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(item.totalPrice)}</Text>
          </View>
        ))}
        {itemsPreview.remaining > 0 && (
          <Text style={[styles.moreItems, { color: BRAND_COLORS.ui.subtitle }]}>+{itemsPreview.remaining} món khác</Text>
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: BRAND_COLORS.ui.placeholder }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: BRAND_COLORS.ui.subtitle }]}>Tổng cộng</Text>
          <Text style={[styles.totalAmount, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(order.finalAmount)}</Text>
        </View>
        <View style={[styles.viewDetail, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
          <Text style={[styles.viewDetailText, { color: BRAND_COLORS.ui.heading }]}>Chi tiết</Text>
          <Ionicons name="chevron-forward" size={14} color={BRAND_COLORS.ui.heading} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
  },
  orderCode: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Regular',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-SemiBold',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  storeText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  paymentChip: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  itemQty: {
    width: 28,
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
    marginLeft: 8,
  },
  moreItems: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    marginTop: 4,
    paddingLeft: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  totalRow: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    marginTop: 1,
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewDetailText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});