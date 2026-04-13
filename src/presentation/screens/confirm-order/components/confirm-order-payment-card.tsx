import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { CONFIRM_ORDER_TEXT, PAYMENT_METHOD_LABELS } from '../ConfirmOrderConstants';

interface ConfirmOrderPaymentCardProps {
  paymentMethod: string;
}

export const ConfirmOrderPaymentCard = React.memo(function ConfirmOrderPaymentCard({
  paymentMethod,
}: ConfirmOrderPaymentCardProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={styles.paymentSection}>
      <Text style={[styles.paymentTitle, { color: BRAND_COLORS.ui.heading }]}>
        {CONFIRM_ORDER_TEXT.PAYMENT_SECTION_TITLE}
      </Text>
      <View style={[styles.paymentCard, { backgroundColor: BRAND_COLORS.screenBg.fresh, borderColor: BRAND_COLORS.ui.placeholder }]}>
        <AppIcon name="card-outline" size={24} color={BRAND_COLORS.bta.primaryBg} />
        <Text style={[styles.paymentMethod, { color: BRAND_COLORS.ui.heading }]}>
          {PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  paymentSection: { gap: 12 },
  paymentTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 3,
    gap: 12,
  },
  paymentMethod: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
});
