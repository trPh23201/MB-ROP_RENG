import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TYPE_LABELS } from './OrderConstants';
import { OrderFooterProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

export function OrderFooter({ orderType, totalItems, totalPrice, buttonText, onButtonPress, disabled }: OrderFooterProps) {
    const BRAND_COLORS = useBrandColors();
    const insets = useSafeAreaInsets();
    const orderTypeLabel = ORDER_TYPE_LABELS[orderType];

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: BRAND_COLORS.screenBg.warm, shadowColor: BRAND_COLORS.shadow.heavy },
            ]}
        >
            <View style={styles.info}>
                <Text style={[styles.infoText, { color: BRAND_COLORS.ui.heading }]}>
                    {orderTypeLabel} : {totalItems} sản phẩm
                </Text>
                <Text style={[styles.totalPrice, { color: BRAND_COLORS.ui.heading }]}>
                    {OrderService.formatPrice(totalPrice)}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: BRAND_COLORS.bta.primaryBg, shadowColor: BRAND_COLORS.shadow.heavy }, disabled && styles.buttonDisabled, disabled && { backgroundColor: BRAND_COLORS.ui.placeholder }]}
                onPress={onButtonPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={[styles.buttonText, { color: BRAND_COLORS.bta.primaryText }]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 24,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    },
    totalPrice: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    },
    button: {
        height: 56,
        width: '60%',
        alignSelf: 'center',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 24,
    },
    buttonText: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        letterSpacing: 1,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
