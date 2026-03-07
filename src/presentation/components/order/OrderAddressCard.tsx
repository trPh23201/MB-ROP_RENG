import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderType } from '../../../domain/shared';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { AppIcon } from '../shared/AppIcon';
import { ORDER_TEXT } from './OrderConstants';
import { OrderAddressCardProps } from './OrderInterfaces';


export function OrderAddressCard({ orderType, address, onChangeAddress, editable = true }: OrderAddressCardProps) {
    if (orderType !== OrderType.DELIVERY) {
        return null;
    }

    const hasAddress = !!address?.full;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{ORDER_TEXT.ADDRESS_HEADER_TITLE}</Text>
                {editable && onChangeAddress && (
                    <TouchableOpacity onPress={onChangeAddress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={styles.changeText}>{ORDER_TEXT.ADDRESS_CHANGE_BUTTON}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={styles.card}
                onPress={editable ? onChangeAddress : undefined}
                activeOpacity={editable ? 0.7 : 1}
                disabled={!editable}
            >
                <View style={[styles.iconContainer, hasAddress && styles.iconContainerActive]}>
                    <AppIcon
                        name="location"
                        size={20}
                        color={hasAddress ? BRAND_COLORS.bta.primaryBg : BRAND_COLORS.ui.placeholder}
                    />
                </View>

                <View style={styles.contentContainer}>
                    {hasAddress ? (
                        <>
                            <Text style={styles.addressName} numberOfLines={1}>
                                {address.name}
                            </Text>
                            <Text style={styles.addressFull} numberOfLines={1}>
                                {address.full}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.placeholder}>{ORDER_TEXT.ADDRESS_PLACEHOLDER}</Text>
                    )}
                </View>

                {editable && (
                    <View style={styles.arrowContainer}>
                        <AppIcon name="chevron-forward" size={20} color="#CCCCCC" />
                    </View>
                )}
            </TouchableOpacity>
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
    headerTitle: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.ui.heading,
    },
    changeText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.bta.primaryBg,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BRAND_COLORS.screenBg.fresh,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 3,
        borderColor: BRAND_COLORS.ui.placeholder,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 0.5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconContainerActive: {
        backgroundColor: '#E8F5E9',
    },
    contentContainer: {
        flex: 1,
        marginRight: 8,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        color: BRAND_COLORS.ui.heading,
        marginBottom: 2,
    },
    addressFull: {
        fontSize: 13,
        color: BRAND_COLORS.ui.subtitle,
        lineHeight: 18,
    },
    placeholder: {
        fontSize: 15,
        color: BRAND_COLORS.ui.placeholder,
        fontStyle: 'italic',
    },
    arrowContainer: {
        padding: 4,
    },
});
