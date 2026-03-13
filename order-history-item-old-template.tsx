import { Order } from '@/src/domain/entities/Order';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_COLORS } from '../../../theme/colors';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STATUS_COLORS } from '../OrderHistoryConstants';
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
  const statusColor = STATUS_COLORS[order.orderStatus] || API_COLORS.secondary.s3;
  const statusLabel = ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus;
  const paymentLabel = PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus;

  const itemsPreview = useMemo(() => {
    const maxShow = 2;
    const shown = order.items.slice(0, maxShow);
    const remaining = order.items.length - maxShow;
    return { shown, remaining };
  }, [order.items]);

  return (
    <TouchableOpacity
      style={[getStyles().container, { backgroundColor: API_COLORS.background.paper, borderColor: API_COLORS.primary.p2 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={getStyles().header}>
        <View style={getStyles().headerInfo}>
          <Text style={[getStyles().orderCode, { color: API_COLORS.primary.p3 }]}>{order.orderCode}</Text>
          <Text style={[getStyles().dateText, { color: API_COLORS.secondary.s3 }]}>{service.formatDate(order.createdAt)}</Text>
        </View>
        <View style={[getStyles().statusBadge, { backgroundColor: statusColor + '18' }]}>
          <View style={[getStyles().statusDot, { backgroundColor: statusColor }]} />
          <Text style={[getStyles().statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={getStyles().storeRow}>
        <Ionicons name="storefront-outline" size={14} color={API_COLORS.secondary.s5} />
        <Text style={[getStyles().storeText, { color: API_COLORS.secondary.s5 }]}>{service.getStoreLabel(order.storeId)}</Text>
        <Text style={[getStyles().paymentChip, { backgroundColor: API_COLORS.primary.p1, color: API_COLORS.secondary.s5 }]}>{paymentLabel}</Text>
      </View>

      <View style={getStyles().itemsSection}>
        {itemsPreview.shown.map((item, index) => (
          <View key={item.id || index} style={getStyles().itemRow}>
            <Text style={[getStyles().itemQty, { color: API_COLORS.secondary.s4 }]}>{item.qty}x</Text>
            <Text style={[getStyles().itemName, { color: API_COLORS.text.secondary }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[getStyles().itemPrice, { color: API_COLORS.text.primary }]}>{service.formatCurrency(item.totalPrice)}</Text>
          </View>
        ))}
        {itemsPreview.remaining > 0 && (
          <Text style={[getStyles().moreItems, { color: API_COLORS.secondary.s3 }]}>+{itemsPreview.remaining} món khác</Text>
        )}
      </View>

      <View style={[getStyles().footer, { borderTopColor: API_COLORS.primary.p2 }]}>
        <View style={getStyles().totalRow}>
          <Text style={[getStyles().totalLabel, { color: API_COLORS.secondary.s5 }]}>Tổng cộng</Text>
          <Text style={[getStyles().totalAmount, { color: API_COLORS.primary.p3 }]}>{service.formatCurrency(order.finalAmount)}</Text>
        </View>
        <View style={getStyles().viewDetail}>
          <Text style={[getStyles().viewDetailText, { color: API_COLORS.primary.p3 }]}>Chi tiết</Text>
          <Ionicons name="chevron-forward" size={14} color={API_COLORS.primary.p3} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const getStyles = () => StyleSheet.create({
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
  divider: {
    height: 1,
    marginBottom: 10,
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
    backgroundColor: API_COLORS.primary.p1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewDetailText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});