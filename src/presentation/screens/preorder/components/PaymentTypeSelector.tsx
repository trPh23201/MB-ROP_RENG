import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PAYMENT_METHOD_LABELS, PREORDER_TEXT } from '../PreOrderConstants';
import { PaymentTypeSelectorProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

export function PaymentTypeSelector({ selectedMethod, onPress }: PaymentTypeSelectorProps) {
  const BRAND_COLORS = useBrandColors();
  const iconName = PreOrderService.getPaymentMethodIcon(selectedMethod);
  const methodLabel = PAYMENT_METHOD_LABELS[selectedMethod];
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{PREORDER_TEXT.PAYMENT_SECTION_TITLE}</Text>
      
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: BRAND_COLORS.screenBg.fresh, borderColor: BRAND_COLORS.ui.placeholder }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.methodInfo}>
          <Ionicons
            name={iconName as any}
            size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
            color={BRAND_COLORS.bta.primaryBg}
          />
          <Text style={[styles.methodLabel, { color: BRAND_COLORS.ui.heading }]}>{methodLabel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.ui.placeholder} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: PREORDER_LAYOUT.ORDER_TYPE_BORDER_RADIUS,
    borderWidth: 3,
    padding: PREORDER_LAYOUT.ORDER_TYPE_PADDING,
    minHeight: 60,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
});