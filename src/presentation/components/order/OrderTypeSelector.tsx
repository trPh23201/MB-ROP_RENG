import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { ORDER_TYPE_LABELS, ORDER_TYPE_SECTION_TITLES } from './OrderConstants';
import { OrderTypeSelectorProps } from './OrderInterfaces';
import { OrderService } from './OrderService';

export function OrderTypeSelector({ selectedType, store, onPress, editable = true }: OrderTypeSelectorProps) {

    const BRAND_COLORS = useBrandColors();

    const iconName = OrderService.getOrderTypeIcon(selectedType);
    const typeLabel = ORDER_TYPE_LABELS[selectedType];
    const sectionTitle = ORDER_TYPE_SECTION_TITLES[selectedType];

    const Container = editable ? TouchableOpacity : View;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{sectionTitle}</Text>
                {editable && onPress && (
                    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                        <Text style={[styles.changeButton, { color: BRAND_COLORS.bta.primaryBg }]}>Thay đổi</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Container
                style={[styles.content, { backgroundColor: BRAND_COLORS.screenBg.fresh, borderColor: BRAND_COLORS.ui.placeholder }]}
                onPress={editable ? onPress : undefined}
                activeOpacity={0.7}
            >
                <View style={styles.storeSection}>
                    <Text style={[styles.storeName, { color: BRAND_COLORS.ui.heading }]}>{store?.name || 'Chưa chọn cửa hàng'}</Text>
                    <Text style={[styles.storeAddress, { color: BRAND_COLORS.ui.subtitle }]} numberOfLines={1}>
                        {store?.address || '...'}
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: BRAND_COLORS.ui.placeholder }]} />

                <View style={styles.typeRow}>
                    <Ionicons
                        name={iconName as any}
                        size={24}
                        color={BRAND_COLORS.bta.primaryBg}
                    />
                    <View style={styles.typeInfo}>
                        <Text style={[styles.typeLabel, { color: BRAND_COLORS.ui.heading }]}>{typeLabel}</Text>
                        <Text style={[styles.timeEstimate, { color: BRAND_COLORS.ui.subtitle }]}>Càng sớm càng tốt</Text>
                    </View>
                    {editable && (
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={BRAND_COLORS.ui.placeholder}
                        />
                    )}
                </View>
            </Container>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    changeButton: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    content: {
        borderRadius: 12,
        borderWidth: 3,
        padding: 16,
        gap: 12,
    },
    storeSection: {
        gap: 4,
    },
    storeName: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    storeAddress: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    divider: {
        height: 1,
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    typeInfo: {
        flex: 1,
        gap: 2,
    },
    typeLabel: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    timeEstimate: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
});
