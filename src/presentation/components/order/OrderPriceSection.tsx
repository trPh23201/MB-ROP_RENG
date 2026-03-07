import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TEXT } from './OrderConstants';
import { OrderPriceSectionProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

export function OrderPriceSection({ subtotal, shippingFee, discountAmount = 0, onPromotionPress, showPromotionButton = true }: OrderPriceSectionProps) {
    const totalPrice = OrderService.calculateTotalPrice(subtotal, shippingFee, discountAmount);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{ORDER_TEXT.TOTAL_SECTION_TITLE}</Text>

            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.label}>{ORDER_TEXT.SUBTOTAL_LABEL}</Text>
                    <Text style={styles.value}>{OrderService.formatPrice(subtotal)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{ORDER_TEXT.SHIPPING_FEE_LABEL}</Text>
                    <Text style={styles.value}>{OrderService.formatPrice(shippingFee)}</Text>
                </View>

                {discountAmount > 0 && (
                    <View style={styles.row}>
                        <Text style={styles.label}>{ORDER_TEXT.DISCOUNT_LABEL}</Text>
                        <Text style={styles.discountValue}>-{OrderService.formatPrice(discountAmount)}</Text>
                    </View>
                )}

                {showPromotionButton && onPromotionPress && (
                    <TouchableOpacity
                        style={styles.promotionRow}
                        onPress={onPromotionPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.promotionLabel}>{ORDER_TEXT.PROMOTION_LABEL}</Text>
                        <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.ui.placeholder} />
                    </TouchableOpacity>
                )}

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{ORDER_TEXT.FINAL_TOTAL_LABEL}</Text>
                    <Text style={styles.totalValue}>{OrderService.formatPrice(totalPrice)}</Text>
                </View>
            </View>
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
    content: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.ui.subtitle,
    },
    value: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.ui.heading,
    },
    discountValue: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.bta.primaryBg,
    },
    promotionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    promotionLabel: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.bta.primaryBg,
    },
    divider: {
        height: 1,
        backgroundColor: BRAND_COLORS.ui.placeholder,
        marginVertical: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    totalLabel: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.ui.heading,
    },
    totalValue: {
        fontSize: 22,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.bta.primaryBg,
    },
});
