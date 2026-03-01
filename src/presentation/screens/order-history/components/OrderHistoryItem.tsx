import { Order } from '@/src/domain/entities/Order';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STATUS_COLORS } from '../OrderHistoryConstants';
import { OrderHistoryService } from '../OrderHistoryService';

interface OrderHistoryItemProps {
  order: Order;
  onPress: () => void;
}

export const OrderHistoryItem = memo(function OrderHistoryItem({ order, onPress }: OrderHistoryItemProps) {
  const service = new OrderHistoryService();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderCode}>{order.orderCode}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[order.orderStatus] || '#9E9E9E' },
          ]}
        >
          <Text style={styles.statusText}>
            {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="storefront-outline" size={16} color="#666666" />
        <Text style={styles.infoText}>{service.getStoreLabel(order.storeId)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#666666" />
        <Text style={styles.infoText}>{service.formatDate(order.createdAt)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>
          {order.items.length} món • {PAYMENT_STATUS_LABELS[order.paymentStatus]}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalAmount}>{service.formatCurrency(order.finalAmount)}</Text>
      </View>

      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#606A37',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});