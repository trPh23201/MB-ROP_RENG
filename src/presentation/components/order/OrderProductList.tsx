import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TEXT } from './OrderConstants';
import { OrderProductListProps } from './OrderInterfaces';
import { OrderProductItem } from './OrderProductItem';

export function OrderProductList({
    items,
    title = ORDER_TEXT.PRODUCT_LIST_TITLE,
    onItemPress,
    onAddMore,
    showAddButton = true,
    editable = true,
    emptyText = ORDER_TEXT.EMPTY_PRODUCT_TEXT,
}: OrderProductListProps) {
    const BRAND_COLORS = useBrandColors();
    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: BRAND_COLORS.ui.placeholder }]}>{emptyText}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: BRAND_COLORS.screenBg.fresh, borderColor: BRAND_COLORS.ui.placeholder }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{title}</Text>
                {showAddButton && onAddMore && (
                    <TouchableOpacity onPress={onAddMore} activeOpacity={0.7}>
                        <Text style={[styles.addButton, { color: BRAND_COLORS.bta.primaryBg }]}>{ORDER_TEXT.ADD_MORE_BUTTON}</Text>
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
    },
    addButton: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
});
