import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectToppings } from '../../../state/slices/homeSlice';
import { removeCartItem, updateCartItem } from '../../../state/slices/orderCartSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { popupService } from '../../layouts/popup/PopupService';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { AddToppingBottomSheet, AddToppingRef } from './AddToppingBottomSheet';
import { EDIT_PRODUCT_TEXT, ICE_OPTIONS, SIZE_OPTIONS, SWEETNESS_OPTIONS } from './OrderConstants';
import { CartItem, Topping } from './OrderInterfaces';
import { OrderService } from './OrderService';

export interface OrderProductEditRef {
    present: (item: CartItem) => void;
    dismiss: () => void;
}

export const OrderProductEditBottomSheet = forwardRef<OrderProductEditRef, { onCartEmpty?: () => void }>((props, ref) => {
    const BRAND_COLORS = useBrandColors();
    const { onCartEmpty } = props;
    const dispatch = useAppDispatch();
    const availableToppings = useAppSelector(selectToppings);
    const cartItems = useAppSelector((state) => state.orderCart.items);
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);
    const toppingModalRef = useRef<AddToppingRef>(null);

    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [selectedIce, setSelectedIce] = useState<'normal' | 'separate' | 'less'>('separate');
    const [selectedSweetness, setSelectedSweetness] = useState<'normal' | 'less' | 'more'>('normal');
    const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

    const snapPoints = useMemo(() => ['90%'], []);

    useImperativeHandle(ref, () => ({
        present: (item: CartItem) => {
            setEditingItem(item);
            setQuantity(item.quantity);
            setSelectedSize(item.customizations.size);
            setSelectedIce(item.customizations.ice);
            setSelectedSweetness(item.customizations.sweetness);
            setSelectedToppings([...item.customizations.toppings]);
            sheetRef.current?.present();
        },
        dismiss: () => {
            sheetRef.current?.dismiss();
        },
    }));

    const calculatePrice = useCallback(() => {
        if (!editingItem) return 0;
        const sizeAdjust = SIZE_OPTIONS.find((s) => s.id === selectedSize)?.priceAdjust || 0;
        const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
        return (editingItem.product.price + sizeAdjust + toppingTotal) * quantity;
    }, [editingItem, selectedSize, selectedToppings, quantity]);

    const handleQuantityChange = async (delta: number) => {
        const newQty = quantity + delta;
        if (newQty === 0) {
            const confirmed = await popupService.confirm(
                EDIT_PRODUCT_TEXT.DELETE_CONFIRM_MESSAGE,
                {
                    title: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_TITLE,
                    confirmText: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_OK,
                    cancelText: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_CANCEL,
                    confirmStyle: 'destructive',
                }
            );
            if (confirmed && editingItem) {
                const isLastItem = cartItems.length === 1;
                dispatch(removeCartItem(editingItem.id));
                sheetRef.current?.dismiss();
                if (isLastItem && onCartEmpty) {
                    onCartEmpty();
                }
            }
        } else if (newQty > 0) {
            setQuantity(newQty);
        }
    };

    const handleApplyChanges = () => {
        if (!editingItem) return;

        const updated: CartItem = {
            ...editingItem,
            quantity,
            customizations: {
                size: selectedSize,
                ice: selectedIce,
                sweetness: selectedSweetness,
                toppings: selectedToppings,
            },
            finalPrice: calculatePrice(),
        };

        dispatch(updateCartItem(updated));
        sheetRef.current?.dismiss();
    };

    const handleOpenToppingModal = () => {
        toppingModalRef.current?.present(selectedToppings);
    };

    const handleToppingsSelected = (toppings: Topping[]) => {
        setSelectedToppings(toppings);
    };

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />,
        []
    );

    return (
        <>
            <BottomSheetModal
                ref={sheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                enableDynamicSizing={false}
                enableDismissOnClose={true}
                backdropComponent={renderBackdrop}
                backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: BRAND_COLORS.primary.p1 }]}
                handleIndicatorStyle={[styles.indicator, { backgroundColor: BRAND_COLORS.secondary.s3 }]}
                index={0}
                stackBehavior="push"
                onDismiss={() => setEditingItem(null)}
            >
                {editingItem ? (
                    <>
                        <BottomSheetScrollView contentContainerStyle={[styles.contentWrapper, { paddingBottom: insets.bottom }]}>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{editingItem.product.name}</Text>
                                <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color={BRAND_COLORS.ui.subtitle} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>
                                    {EDIT_PRODUCT_TEXT.SIZE_LABEL} <Text style={[styles.required, { color: BRAND_COLORS.semantic.error }]}>*</Text>
                                </Text>
                                <Text style={[styles.sectionHint, { color: BRAND_COLORS.ui.subtitle }]}>{EDIT_PRODUCT_TEXT.SIZE_HINT}</Text>
                                <View style={styles.optionRow}>
                                    {SIZE_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, { borderColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm }, selectedSize === option.id && styles.optionButtonSelected, selectedSize === option.id && { borderColor: BRAND_COLORS.secondary.s3, backgroundColor: `${BRAND_COLORS.secondary.s3}18` }]}
                                            onPress={() => setSelectedSize(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, { color: BRAND_COLORS.ui.heading }, selectedSize === option.id && styles.optionTextSelected, selectedSize === option.id && { color: BRAND_COLORS.secondary.s3 }]}>
                                                {option.label}: {OrderService.formatPrice(editingItem.product.price + option.priceAdjust)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{EDIT_PRODUCT_TEXT.ICE_LABEL}</Text>
                                <View style={styles.optionRow}>
                                    {ICE_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, { borderColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm }, selectedIce === option.id && styles.optionButtonSelected, selectedIce === option.id && { borderColor: BRAND_COLORS.secondary.s3, backgroundColor: `${BRAND_COLORS.secondary.s3}18` }]}
                                            onPress={() => setSelectedIce(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, { color: BRAND_COLORS.ui.heading }, selectedIce === option.id && styles.optionTextSelected, selectedIce === option.id && { color: BRAND_COLORS.secondary.s3 }]}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{EDIT_PRODUCT_TEXT.SWEETNESS_LABEL}</Text>
                                <View style={styles.optionRow}>
                                    {SWEETNESS_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, { borderColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm }, selectedSweetness === option.id && styles.optionButtonSelected, selectedSweetness === option.id && { borderColor: BRAND_COLORS.secondary.s3, backgroundColor: `${BRAND_COLORS.secondary.s3}18` }]}
                                            onPress={() => setSelectedSweetness(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, { color: BRAND_COLORS.ui.heading }, selectedSweetness === option.id && styles.optionTextSelected, selectedSweetness === option.id && { color: BRAND_COLORS.secondary.s3 }]}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.toppingSection, { borderColor: BRAND_COLORS.secondary.s3 }]} onPress={handleOpenToppingModal}>
                                <View style={[styles.toppingIcon, { backgroundColor: `${BRAND_COLORS.secondary.s3}18` }]}>
                                    <Ionicons name="cafe" size={24} color={BRAND_COLORS.secondary.s3} />
                                </View>
                                <View style={styles.toppingContent}>
                                    <Text style={[styles.toppingTitle, { color: BRAND_COLORS.ui.heading }]}>{EDIT_PRODUCT_TEXT.TOPPING_LABEL}</Text>
                                    <Text style={[styles.toppingHint, { color: BRAND_COLORS.ui.subtitle }]}>
                                        {selectedToppings.length > 0 ? selectedToppings.map(t => t.name).join(', ') : EDIT_PRODUCT_TEXT.TOPPING_HINT}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary.s3} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.noteSection}>
                                <Ionicons name="document-text-outline" size={20} color={BRAND_COLORS.ui.subtitle} />
                                <Text style={[styles.noteText, { color: BRAND_COLORS.ui.subtitle }]}>{EDIT_PRODUCT_TEXT.NOTE_LABEL}</Text>
                            </TouchableOpacity>
                        </BottomSheetScrollView>

                        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: BRAND_COLORS.screenBg.warm, borderTopColor: BRAND_COLORS.ui.placeholder }]}>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity style={[styles.quantityButton, { backgroundColor: `${BRAND_COLORS.secondary.s3}20` }]} onPress={() => handleQuantityChange(-1)}>
                                    <Ionicons name="remove" size={20} color={BRAND_COLORS.secondary.s3} />
                                </TouchableOpacity>
                                <Text style={[styles.quantityValue, { color: BRAND_COLORS.ui.heading }]}>{quantity}</Text>
                                <TouchableOpacity style={[styles.quantityButton, { backgroundColor: `${BRAND_COLORS.secondary.s3}20` }]} onPress={() => handleQuantityChange(1)}>
                                    <Ionicons name="add" size={20} color={BRAND_COLORS.secondary.s3} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={[styles.applyButton, { backgroundColor: BRAND_COLORS.secondary.s3 }]} onPress={handleApplyChanges}>
                                <Text style={[styles.applyButtonText, { color: BRAND_COLORS.bta.primaryText }]}>
                                    {EDIT_PRODUCT_TEXT.CHANGE_BUTTON} · {OrderService.formatPrice(calculatePrice())}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : null}
            </BottomSheetModal>

            <AddToppingBottomSheet ref={toppingModalRef} onApply={handleToppingsSelected} availableToppings={availableToppings} />
        </>
    );
});

OrderProductEditBottomSheet.displayName = 'OrderProductEditBottomSheet';

const styles = StyleSheet.create({
    bottomSheetBackground: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 40,
    },
    contentWrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontFamily: TYPOGRAPHY.fontFamily.heading,
    },
    closeButton: {
        padding: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        marginBottom: 4,
    },
    required: {
    },
    sectionHint: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    optionButtonSelected: {
    },
    optionText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    optionTextSelected: {
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    toppingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1.5,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    toppingIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toppingContent: {
        flex: 1,
    },
    toppingTitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        marginBottom: 4,
    },
    toppingHint: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    noteSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    noteText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        gap: 12,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityValue: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        minWidth: 24,
        textAlign: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.heading,
    },
});
