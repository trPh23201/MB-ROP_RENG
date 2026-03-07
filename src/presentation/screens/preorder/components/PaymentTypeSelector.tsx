import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PAYMENT_METHOD_LABELS, PREORDER_TEXT } from '../PreOrderConstants';
import { PaymentTypeSelectorProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

export function PaymentTypeSelector({ selectedMethod, onPress }: PaymentTypeSelectorProps) {
  const iconName = PreOrderService.getPaymentMethodIcon(selectedMethod);
  const methodLabel = PAYMENT_METHOD_LABELS[selectedMethod];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PREORDER_TEXT.PAYMENT_SECTION_TITLE}</Text>
      
      <TouchableOpacity
        style={styles.selector}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.methodInfo}>
          <Ionicons
            name={iconName as any}
            size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
            color={BRAND_COLORS.bta.primaryBg}
          />
          <Text style={styles.methodLabel}>{methodLabel}</Text>
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
    color: BRAND_COLORS.ui.heading,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.screenBg.fresh,
    borderRadius: PREORDER_LAYOUT.ORDER_TYPE_BORDER_RADIUS,
    borderWidth: 3,
    borderColor: BRAND_COLORS.ui.placeholder,
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
    color: BRAND_COLORS.ui.heading,
  },
});