import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { AppIcon } from '../shared/AppIcon';
import { OrderProductItemProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

export function OrderProductItem({ item, onPress, editable = true }: OrderProductItemProps) {
    const BRAND_COLORS = useBrandColors();
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
                { backgroundColor: BRAND_COLORS.screenBg.fresh },
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
                <Text style={[styles.quantityText, { color: BRAND_COLORS.ui.heading }]}>{item.quantity}x</Text>
            </View>

            <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: BRAND_COLORS.ui.heading }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[styles.productOptions, { color: BRAND_COLORS.ui.subtitle }]}>{optionsText}</Text>
                {hasToppings && (
                    <Text style={[styles.productTopping, { color: BRAND_COLORS.ui.subtitle }]}>
                        + {item.options.toppings.map(t => t.name).join(', ')}
                    </Text>
                )}
            </View>

            <Text style={[styles.productPrice, { color: BRAND_COLORS.ui.heading }]}>
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
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    productName: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    productOptions: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    productPrice: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    },
    productTopping: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        marginTop: 2,
    },
});
