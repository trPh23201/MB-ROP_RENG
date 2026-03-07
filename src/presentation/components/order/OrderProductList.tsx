import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TEXT } from './OrderConstants';
import { OrderProductListProps } from './OrderInterfaces';
import { OrderProductItem } from './OrderProductItem';

/**
 * Shared product list component for order display.
 * Used in both Pre-order and Confirm Order screens.
 */
export function OrderProductList({
    items,
    title = ORDER_TEXT.PRODUCT_LIST_TITLE,
    onItemPress,
    onAddMore,
    showAddButton = true,
    editable = true,
    emptyText = ORDER_TEXT.EMPTY_PRODUCT_TEXT,
}: OrderProductListProps) {
    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {showAddButton && onAddMore && (
                    <TouchableOpacity onPress={onAddMore} activeOpacity={0.7}>
                        <Text style={styles.addButton}>{ORDER_TEXT.ADD_MORE_BUTTON}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {items.map((item) => (
                <OrderProductItem
                    key={item.id.toString()}
                    item={item}
                    onPress={onItemPress}
                    editable={editable}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        backgroundColor: BRAND_COLORS.screenBg.fresh,
        borderColor: BRAND_COLORS.ui.placeholder,
        borderWidth: 3,
        paddingVertical: 8,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.ui.heading,
    },
    addButton: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.bta.primaryBg,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.ui.placeholder,
    },
});
