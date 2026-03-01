import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AvailableVoucher } from '../../../../domain/entities/PreOrder';
import { OrderService } from '../../../components/order/OrderService';
import { BaseBottomSheetLayout } from '../../../layouts/BaseBottomSheetLayout';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export interface VoucherSelectionModalProps {
    availableVouchers: AvailableVoucher[];
    initialSelectedVouchers: { code: string }[];
    onApply: (selectedVouchers: { code: string }[]) => void;
}

export const VoucherSelectionModal = forwardRef<BottomSheetModal, VoucherSelectionModalProps>(
    ({ availableVouchers, initialSelectedVouchers, onApply }, ref) => {
        const snapPoints = useMemo(() => ['70%'], []);
        const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

        useEffect(() => {
            setSelectedCodes(new Set(initialSelectedVouchers.map(v => v.code)));
        }, [initialSelectedVouchers, availableVouchers]);

        const handleApply = useCallback(() => {
            onApply(Array.from(selectedCodes).map(code => ({ code })));
        }, [selectedCodes, onApply]);

        const toggleVoucher = useCallback((code: string) => {
            setSelectedCodes(prev => {
                const newSet = new Set(prev);
                if (newSet.has(code)) {
                    newSet.delete(code);
                } else {
                    newSet.add(code);
                }
                return newSet;
            });
        }, []);

        const HeaderRight = useMemo(() => (
            <TouchableOpacity onPress={handleApply} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
        ), [handleApply]);

        return (
            <BaseBottomSheetLayout
                ref={ref}
                title="Chọn Khuyến Mãi"
                snapPoints={snapPoints}
                headerRightComponent={HeaderRight}
            >
                <BottomSheetScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {availableVouchers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="ticket-outline" size={48} color={BRAND_COLORS.text.tertiary} />
                            <Text style={styles.emptyText}>Không có mã khuyến mãi nào khả dụng cho đơn hàng này.</Text>
                        </View>
                    ) : (
                        availableVouchers.map((voucher) => {
                            const isSelected = selectedCodes.has(voucher.code);
                            return (
                                <TouchableOpacity
                                    key={voucher.code}
                                    style={[styles.voucherCard, isSelected && styles.voucherCardSelected]}
                                    onPress={() => toggleVoucher(voucher.code)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.voucherIconContainer}>
                                        <Ionicons name="ticket" size={24} color={isSelected ? BRAND_COLORS.primary.xanhReu : BRAND_COLORS.text.secondary} />
                                    </View>
                                    <View style={styles.voucherContent}>
                                        <Text style={styles.voucherName} numberOfLines={1}>{voucher.name || voucher.code}</Text>
                                        {voucher.description && (
                                            <Text style={styles.voucherDescription} numberOfLines={2}>{voucher.description}</Text>
                                        )}
                                        {voucher.discountAmount > 0 && (
                                            <Text style={styles.voucherDiscount}>Giảm đ{OrderService.formatPrice(voucher.discountAmount)}</Text>
                                        )}
                                    </View>
                                    <View style={styles.radioContainer}>
                                        <Ionicons
                                            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                            size={24}
                                            color={isSelected ? BRAND_COLORS.primary.xanhReu : BRAND_COLORS.border.light}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </BottomSheetScrollView>
            </BaseBottomSheetLayout>
        );
    }
);

const styles = StyleSheet.create({
    applyText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.primary.xanhReu,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 100,
        gap: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.secondary,
        textAlign: 'center',
    },
    voucherCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: BRAND_COLORS.background.paper,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BRAND_COLORS.border.light,
        alignItems: 'center',
    },
    voucherCardSelected: {
        borderColor: BRAND_COLORS.primary.xanhReu,
        backgroundColor: `${BRAND_COLORS.primary.xanhReu}0A`,
    },
    voucherIconContainer: {
        padding: 12,
        backgroundColor: BRAND_COLORS.background.default,
        borderRadius: 8,
        marginRight: 12,
    },
    voucherContent: {
        flex: 1,
        gap: 4,
    },
    voucherName: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
    },
    voucherDescription: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.secondary,
    },
    voucherDiscount: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.primary.xanhReu,
        marginTop: 2,
    },
    radioContainer: {
        marginLeft: 12,
    },
});