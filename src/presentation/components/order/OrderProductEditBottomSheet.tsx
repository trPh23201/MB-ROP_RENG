import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectToppings } from '../../../state/slices/homeSlice';
import { removeCartItem, updateCartItem } from '../../../state/slices/orderCartSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
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
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.indicator}
                index={0}
                stackBehavior="push"
                onDismiss={() => setEditingItem(null)}
            >
                {editingItem ? (
                    <>
                        <BottomSheetScrollView contentContainerStyle={[styles.contentWrapper, { paddingBottom: insets.bottom }]}>
                            <View style={styles.header}>
                                <Text style={styles.title}>{editingItem.product.name}</Text>
                                <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color={BRAND_COLORS.text.primary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    {EDIT_PRODUCT_TEXT.SIZE_LABEL} <Text style={styles.required}>*</Text>
                                </Text>
                                <Text style={styles.sectionHint}>{EDIT_PRODUCT_TEXT.SIZE_HINT}</Text>
                                <View style={styles.optionRow}>
                                    {SIZE_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, selectedSize === option.id && styles.optionButtonSelected]}
                                            onPress={() => setSelectedSize(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, selectedSize === option.id && styles.optionTextSelected]}>
                                                {option.label}: {OrderService.formatPrice(editingItem.product.price + option.priceAdjust)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{EDIT_PRODUCT_TEXT.ICE_LABEL}</Text>
                                <View style={styles.optionRow}>
                                    {ICE_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, selectedIce === option.id && styles.optionButtonSelected]}
                                            onPress={() => setSelectedIce(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, selectedIce === option.id && styles.optionTextSelected]}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{EDIT_PRODUCT_TEXT.SWEETNESS_LABEL}</Text>
                                <View style={styles.optionRow}>
                                    {SWEETNESS_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionButton, selectedSweetness === option.id && styles.optionButtonSelected]}
                                            onPress={() => setSelectedSweetness(option.id as any)}
                                        >
                                            <Text style={[styles.optionText, selectedSweetness === option.id && styles.optionTextSelected]}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity style={styles.toppingSection} onPress={handleOpenToppingModal}>
                                <View style={styles.toppingIcon}>
                                    <Ionicons name="cafe" size={24} color={BRAND_COLORS.secondary.nauEspresso} />
                                </View>
                                <View style={styles.toppingContent}>
                                    <Text style={styles.toppingTitle}>{EDIT_PRODUCT_TEXT.TOPPING_LABEL}</Text>
                                    <Text style={styles.toppingHint}>
                                        {selectedToppings.length > 0 ? selectedToppings.map(t => t.name).join(', ') : EDIT_PRODUCT_TEXT.TOPPING_HINT}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary.nauEspresso} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.noteSection}>
                                <Ionicons name="document-text-outline" size={20} color={BRAND_COLORS.text.secondary} />
                                <Text style={styles.noteText}>{EDIT_PRODUCT_TEXT.NOTE_LABEL}</Text>
                            </TouchableOpacity>
                        </BottomSheetScrollView>

                        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(-1)}>
                                    <Ionicons name="remove" size={20} color={BRAND_COLORS.secondary.nauEspresso} />
                                </TouchableOpacity>
                                <Text style={styles.quantityValue}>{quantity}</Text>
                                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(1)}>
                                    <Ionicons name="add" size={20} color={BRAND_COLORS.secondary.nauEspresso} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.applyButton} onPress={handleApplyChanges}>
                                <Text style={styles.applyButtonText}>
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
        backgroundColor: BRAND_COLORS.background.default,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        backgroundColor: '#DDDDDD',
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
        color: BRAND_COLORS.text.primary,
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
        color: BRAND_COLORS.text.primary,
        marginBottom: 4,
    },
    required: {
        color: BRAND_COLORS.semantic.error,
    },
    sectionHint: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.tertiary,
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
        borderColor: BRAND_COLORS.text.tertiary,
        backgroundColor: BRAND_COLORS.background.default,
    },
    optionButtonSelected: {
        borderColor: BRAND_COLORS.secondary.nauEspresso,
        backgroundColor: 'rgba(188, 108, 37, 0.1)',
    },
    optionText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.text.primary,
    },
    optionTextSelected: {
        color: BRAND_COLORS.secondary.nauEspresso,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    },
    toppingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1.5,
        borderColor: BRAND_COLORS.secondary.nauEspresso,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    toppingIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(188, 108, 37, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toppingContent: {
        flex: 1,
    },
    toppingTitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
        marginBottom: 4,
    },
    toppingHint: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.tertiary,
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
        color: BRAND_COLORS.text.secondary,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: BRAND_COLORS.background.default,
        borderTopWidth: 1,
        borderTopColor: BRAND_COLORS.border.light,
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
        backgroundColor: BRAND_COLORS.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityValue: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
        minWidth: 24,
        textAlign: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: BRAND_COLORS.secondary.nauEspresso,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.heading,
        color: BRAND_COLORS.text.inverse,
    },
});
