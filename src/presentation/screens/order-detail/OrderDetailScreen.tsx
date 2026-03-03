import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Order } from '../../../domain/entities/Order';
import { BaseAuthenticatedLayout } from '../../layouts/BaseAuthenticatedLayout';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STATUS_COLORS } from '../order-history/OrderHistoryConstants';
import { ORDER_DETAIL_STRINGS, PAYMENT_METHOD_LABELS } from './OrderDetailConstants';
import { OrderDetailService } from './OrderDetailService';

export default function OrderDetailScreen() {
  const params = useLocalSearchParams();
  const orderId = Number(params.orderId);
  const service = new OrderDetailService();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const orderData = await service.loadOrderDetail(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error('[OrderDetail] Load error:', err);
      setError(ORDER_DETAIL_STRINGS.ERROR_LOAD);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#606A37" />
          <Text style={styles.loadingText}>{ORDER_DETAIL_STRINGS.LOADING}</Text>
        </View>
      </BaseAuthenticatedLayout>
    );
  }

  if (error || !order) {
    return (
      <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || ORDER_DETAIL_STRINGS.ERROR_LOAD}</Text>
        </View>
      </BaseAuthenticatedLayout>
    );
  }

  return (
    <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{ORDER_DETAIL_STRINGS.ITEMS}</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemQty}>{item.qty}x</Text>
                <Text style={styles.itemName}>{item.name || `Món #${item.menuItemId}`}</Text>
                <Text style={styles.itemPrice}>{service.formatCurrency(item.totalPrice)}</Text>
              </View>
              <View style={styles.optionsContainer}>
                <Text style={styles.optionText}>
                  {service.getOptionLabel('size', item.options.size)} •{' '}
                  {service.getOptionLabel('ice', item.options.ice)} •{' '}
                  {service.getOptionLabel('sweetness', item.options.sweetness)}
                </Text>
                {item.options.toppings.length > 0 && (
                  <Text style={styles.optionText}>
                    Topping: {item.options.toppings.join(', ')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{ORDER_DETAIL_STRINGS.SUMMARY}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{ORDER_DETAIL_STRINGS.SUBTOTAL}</Text>
            <Text style={styles.summaryValue}>{service.formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{ORDER_DETAIL_STRINGS.DELIVERY_FEE}</Text>
            <Text style={styles.summaryValue}>{service.formatCurrency(order.deliveryFee)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{ORDER_DETAIL_STRINGS.DISCOUNT}</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{service.formatCurrency(order.discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{ORDER_DETAIL_STRINGS.TOTAL}</Text>
            <Text style={styles.totalValue}>{service.formatCurrency(order.finalAmount)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{ORDER_DETAIL_STRINGS.ORDER_INFO}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.PAYMENT_METHOD}</Text>
            <Text style={styles.infoValue}>
              {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.PAYMENT_STATUS}</Text>
            <Text style={styles.infoValue}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.CREATED_AT}</Text>
            <Text style={styles.infoValue}>{service.formatDate(order.createdAt)}</Text>
          </View>
          {order.contactName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.CONTACT}</Text>
              <Text style={styles.infoValue}>
                {order.contactName} • {order.contactPhone}
              </Text>
            </View>
          )}
          {order.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.ADDRESS}</Text>
              <Text style={styles.infoValue}>
                {typeof order.address === 'string' ? order.address : (order.address as any)?.text}
              </Text>
            </View>
          )}
          {order.note && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{ORDER_DETAIL_STRINGS.NOTE}</Text>
              <Text style={styles.infoValue}>{order.note}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </BaseAuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF5350',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  itemContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#606A37',
    minWidth: 40,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  optionsContainer: {
    marginLeft: 40,
  },
  optionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
  },
  discountValue: {
    color: '#EF5350',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#606A37',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
  },
});