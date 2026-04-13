import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { OrderDetailService } from '../OrderDetailService';

interface OrderDetailHeaderCardProps {
  orderCode: string;
  createdAt: string;
  orderStatus: string;
}

const service = new OrderDetailService();

export const OrderDetailHeaderCard = React.memo(function OrderDetailHeaderCard({
  orderCode,
  createdAt,
  orderStatus,
}: OrderDetailHeaderCardProps) {
  const BRAND_COLORS = useBrandColors();
  const statusColor = BRAND_COLORS.secondary.s3;

  return (
    <View style={[styles.card, { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerInfo}>
          <Text style={[styles.orderCode, { color: BRAND_COLORS.ui.heading }]}>{orderCode}</Text>
          <Text style={[styles.dateText, { color: BRAND_COLORS.ui.subtitle }]}>{service.formatDate(createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusLabel, { color: statusColor }]}>{orderStatus}</Text>
        </View>
      </View>
    </View>
  );
});

export interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof import('../../../theme/BrandColorContext').useBrandColors>;
}

export function InfoRow({ icon, label, value, colors }: InfoRowProps) {
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

const styles = StyleSheet.create({
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
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerInfo: { flex: 1 },
  orderCode: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold' },
  dateText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 13, fontFamily: 'SpaceGrotesk-SemiBold' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 10 },
  infoIcon: { marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 2 },
  infoValue: { fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' },
});
