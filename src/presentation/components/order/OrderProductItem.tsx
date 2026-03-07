import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { AppIcon } from '../shared/AppIcon';
import { OrderProductItemProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

/**
 * Shared product item component for order display.
 * Used in both Pre-order and Confirm Order screens.
 */
export function OrderProductItem({ item, onPress, editable = true }: OrderProductItemProps) {
    const optionsText = OrderService.formatOptionsText(item.options);
    const hasToppings = item.options.toppings && item.options.toppings.length > 0;

    const handlePress = () => {
        if (editable && onPress) {
            onPress(item);
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && editable && { opacity: 0.7 }
            ]}
            onPress={handlePress}
            disabled={!editable}
        >
            {editable && (
                <View>
                    <AppIcon name="create-outline" size={20} color={BRAND_COLORS.ui.subtitle} />
                </View>
            )}

            <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.productOptions}>{optionsText}</Text>
                {hasToppings && (
                    <Text style={styles.productTopping}>
                        + {item.options.toppings.map(t => t.name).join(', ')}
                    </Text>
                )}
            </View>

            <Text style={styles.productPrice}>
                {OrderService.formatPrice(item.totalPrice)}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 64,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: BRAND_COLORS.screenBg.fresh,
        gap: 12,
    },
    quantityContainer: {
        minWidth: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    quantityText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.ui.heading,
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    productName: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.ui.heading,
    },
    productOptions: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.ui.subtitle,
    },
    productPrice: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
        color: BRAND_COLORS.ui.heading,
    },
    productTopping: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.ui.subtitle,
        marginTop: 2,
    },
});
