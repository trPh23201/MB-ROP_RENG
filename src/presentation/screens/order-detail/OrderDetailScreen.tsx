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
      console.error('[OrderDetail] Load error:', err);
      setError(ORDER_DETAIL_STRINGS.ERROR_LOAD);
    } finally {
      setLoading(false);
    }
  }, [orderId, service]);

  useEffect(() => {
    loadOrderDetail();
  }, [loadOrderDetail]);

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

  const statusColor =BRAND_COLORS.secondary.s3;

  return (
    <BaseAuthenticatedLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Card */}
        <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={[styles.orderCode, { color: BRAND_COLORS.ui.heading }]}>{order.orderCode}</Text>
              <Text style={[styles.dateText, { color: BRAND_COLORS.ui.subtitle }]}>{service.formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusLabel, { color: statusColor }]}>
                {order.orderStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Card */}
        <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cafe-outline" size={18} color={BRAND_COLORS.ui.heading} />
            <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_DETAIL_STRINGS.ITEMS}</Text>
          </View>
          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemContainer,
                index < order.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.ui.placeholder },
              ]}
            >
              <View style={styles.itemHeader}>
                <Text style={[styles.itemQty, { color: BRAND_COLORS.ui.subtitle }]}>{item.qty}x</Text>
                <Text style={[styles.itemName, { color: BRAND_COLORS.ui.heading }]}>{item.name || `Món #${item.menuItemId}`}</Text>
                <Text style={[styles.itemPrice, { color: BRAND_COLORS.ui.heading }]}>{service.formatCurrency(item.totalPrice)}</Text>
              </View>
              <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                  <Ionicons name="options-outline" size={13} color={BRAND_COLORS.ui.subtitle} />
                  <Text style={[styles.optionText, { color: BRAND_COLORS.ui.subtitle }]}>
                    {service.getOptionLabel('size', item.options.size)} •{' '}
                    {service.getOptionLabel('ice', item.options.ice)} •{' '}
                    {service.getOptionLabel('sweetness', item.options.sweetness)}
                  </Text>
                </View>
                {item.options.toppings.length > 0 && (
                  <View style={styles.optionRow}>
                    <Ionicons name="add-circle-outline" size={13} color={BRAND_COLORS.ui.subtitle} />
                    <Text style={[styles.optionText, { color: BRAND_COLORS.ui.subtitle }]}>
                      {item.options.toppings.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

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
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{service.formatCurrency(order.discountAmount)}
              </Text>
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

          <InfoRow
            icon="card-outline"
            label={ORDER_DETAIL_STRINGS.PAYMENT_METHOD}
            value={PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
            colors={BRAND_COLORS}
          />
          <InfoRow
            icon="checkmark-circle-outline"
            label={ORDER_DETAIL_STRINGS.PAYMENT_STATUS}
            value={PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
            colors={BRAND_COLORS}
          />
          <InfoRow
            icon="time-outline"
            label={ORDER_DETAIL_STRINGS.CREATED_AT}
            value={service.formatDate(order.createdAt)}
            colors={BRAND_COLORS}
          />
          {order.contactName && (
            <InfoRow
              icon="person-outline"
              label={ORDER_DETAIL_STRINGS.CONTACT}
              value={`${order.contactName} • ${order.contactPhone}`}
              colors={BRAND_COLORS}
            />
          )}
          {order.address && (
            <InfoRow
              icon="location-outline"
              label={ORDER_DETAIL_STRINGS.ADDRESS}
              value={typeof order.address === 'string' ? order.address : (order.address as any)?.text}
              colors={BRAND_COLORS}
            />
          )}
          {order.note && (
            <InfoRow
              icon="document-text-outline"
              label={ORDER_DETAIL_STRINGS.NOTE}
              value={order.note}
              colors={BRAND_COLORS}
            />
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </BaseAuthenticatedLayout>
  );
}

/* --- Info Row Sub-component --- */
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: any;
}

function InfoRow({ icon, label, value, colors }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={colors.ui.subtitle} style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.ui.subtitle }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.ui.heading }]}>{value}</Text>
      </View>
    </View>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },

  /* Card */
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

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  orderCode: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    marginTop: 2,
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
  statusLabel: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-SemiBold',
  },

  /* Section */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },

  /* Items */
  itemContainer: {
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQty: {
    width: 30,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
    marginLeft: 8,
  },
  optionsContainer: {
    marginLeft: 30,
    marginTop: 6,
    gap: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionText: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
  },

  /* Summary */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  discountValue: {
    color: '#EF5350',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
  },

  /* Info */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});