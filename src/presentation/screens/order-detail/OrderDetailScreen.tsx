import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Order } from '../../../domain/entities/Order';
import { BaseAuthenticatedLayout } from '../../layouts/BaseAuthenticatedLayout';
import { useBrandColors } from '../../theme/BrandColorContext';
import { PAYMENT_STATUS_LABELS } from '../order-history/OrderHistoryConstants';
import { ORDER_DETAIL_STRINGS, PAYMENT_METHOD_LABELS } from './OrderDetailConstants';
import { OrderDetailService } from './OrderDetailService';
import { InfoRow, OrderDetailHeaderCard } from './components/order-detail-header-card';
import { OrderDetailItemsCard } from './components/order-detail-items-card';

export default function OrderDetailScreen() {
  const BRAND_COLORS = useBrandColors();
  const params = useLocalSearchParams();
  const orderId = Number(params.orderId);
  const service = useMemo(() => new OrderDetailService(), []);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const orderData = await service.loadOrderDetail(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(ORDER_DETAIL_STRINGS.ERROR_LOAD);
    } finally {
      setLoading(false);
    }
  }, [orderId, service]);

  useEffect(() => { loadOrderDetail(); }, [loadOrderDetail]);

  if (loading) {
    return (
      <BaseAuthenticatedLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.bta.primaryBg} />
          <Text style={[styles.loadingText, { color: BRAND_COLORS.ui.subtitle }]}>{ORDER_DETAIL_STRINGS.LOADING}</Text>
        </View>
      </BaseAuthenticatedLayout>
    );
  }

  if (error || !order) {
    return (
      <BaseAuthenticatedLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={BRAND_COLORS.ui.subtitle} />
          <Text style={[styles.errorText, { color: BRAND_COLORS.ui.heading }]}>{error || ORDER_DETAIL_STRINGS.ERROR_LOAD}</Text>
        </View>
      </BaseAuthenticatedLayout>
    );
  }

  return (
    <BaseAuthenticatedLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <OrderDetailHeaderCard
          orderCode={order.orderCode}
          createdAt={order.createdAt}
          orderStatus={order.orderStatus}
        />

        <OrderDetailItemsCard items={order.items} />

        {/* Summary Card */}
        <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={18} color={BRAND_COLORS.ui.heading} />
            <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_DETAIL_STRINGS.SUMMARY}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: BRAND_COLORS.ui.subtitle }]}>{ORDER_DETAIL_STRINGS.SUBTOTAL}</Text>
            <Text style={[styles.summaryValue, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: BRAND_COLORS.ui.subtitle }]}>{ORDER_DETAIL_STRINGS.DELIVERY_FEE}</Text>
            <Text style={[styles.summaryValue, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(order.deliveryFee)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: BRAND_COLORS.ui.subtitle }]}>{ORDER_DETAIL_STRINGS.DISCOUNT}</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>-{service.formatCurrency(order.discountAmount)}</Text>
            </View>
          )}
          <View style={[styles.divider, { backgroundColor: BRAND_COLORS.ui.placeholder }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: BRAND_COLORS.ui.heading }]}>{ORDER_DETAIL_STRINGS.TOTAL}</Text>
            <Text style={[styles.totalValue, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(order.finalAmount)}</Text>
          </View>
        </View>

        {/* Order Info Card */}
        <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={18} color={BRAND_COLORS.ui.heading} />
            <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_DETAIL_STRINGS.ORDER_INFO}</Text>
          </View>
          <InfoRow icon="card-outline" label={ORDER_DETAIL_STRINGS.PAYMENT_METHOD} value={PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod} colors={BRAND_COLORS} />
          <InfoRow icon="checkmark-circle-outline" label={ORDER_DETAIL_STRINGS.PAYMENT_STATUS} value={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus} colors={BRAND_COLORS} />
          <InfoRow icon="time-outline" label={ORDER_DETAIL_STRINGS.CREATED_AT} value={service.formatDate(order.createdAt)} colors={BRAND_COLORS} />
          {order.contactName && (
            <InfoRow icon="person-outline" label={ORDER_DETAIL_STRINGS.CONTACT} value={`${order.contactName} • ${order.contactPhone}`} colors={BRAND_COLORS} />
          )}
          {order.address && (
            <InfoRow icon="location-outline" label={ORDER_DETAIL_STRINGS.ADDRESS} value={typeof order.address === 'string' ? order.address : (order.address as any)?.text} colors={BRAND_COLORS} />
          )}
          {order.note && (
            <InfoRow icon="document-text-outline" label={ORDER_DETAIL_STRINGS.NOTE} value={order.note} colors={BRAND_COLORS} />
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </BaseAuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 12 },
  errorText: { fontSize: 15, fontFamily: 'SpaceGrotesk-Medium', textAlign: 'center' },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' },
  summaryValue: { fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' },
  discountValue: { color: '#EF5350', fontFamily: 'SpaceGrotesk-Medium' },
  divider: { height: 1, marginVertical: 10 },
  totalLabel: { fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
  totalValue: { fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' },
});
