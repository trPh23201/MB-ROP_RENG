import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TYPE_LABELS } from './OrderConstants';
import { OrderFooterProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

export function OrderFooter({ orderType, totalItems, totalPrice, buttonText, onButtonPress, disabled }: OrderFooterProps) {
    const insets = useSafeAreaInsets();
    const orderTypeLabel = ORDER_TYPE_LABELS[orderType];

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
        >
            <View style={styles.info}>
                <Text style={styles.infoText}>
                    {orderTypeLabel} : {totalItems} sản phẩm
                </Text>
                <Text style={styles.totalPrice}>
                    {OrderService.formatPrice(totalPrice)}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={onButtonPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BRAND_COLORS.screenBg.warm,
        paddingTop: 24,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: BRAND_COLORS.shadow.heavy,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 16,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.ui.heading,
    },
    totalPrice: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.ui.heading,
    },
    button: {
        height: 56,
        width: '60%',
        alignSelf: 'center',
        backgroundColor: BRAND_COLORS.bta.primaryBg,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_COLORS.shadow.heavy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 24,
    },
    buttonText: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.bta.primaryText,
        letterSpacing: 1,
    },
    buttonDisabled: {
        opacity: 0.6,
        backgroundColor: BRAND_COLORS.ui.placeholder,
    },
});
