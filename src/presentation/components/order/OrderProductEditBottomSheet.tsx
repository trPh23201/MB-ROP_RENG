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
import { OptionSelectorRow } from './components/option-selector-row';
import { QuantityControlRow } from './components/quantity-control-row';
import { ToppingSelectorButton } from './components/topping-selector-button';

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
        dismiss: () => sheetRef.current?.dismiss(),
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
                { title: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_TITLE, confirmText: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_OK, cancelText: EDIT_PRODUCT_TEXT.DELETE_CONFIRM_CANCEL, confirmStyle: 'destructive' }
            );
            if (confirmed && editingItem) {
                const isLastItem = cartItems.length === 1;
                dispatch(removeCartItem(editingItem.id));
                sheetRef.current?.dismiss();
                if (isLastItem && onCartEmpty) onCartEmpty();
            }
        } else if (newQty > 0) {
            setQuantity(newQty);
        }
    };

    const handleApplyChanges = () => {
        if (!editingItem) return;
        dispatch(updateCartItem({
            ...editingItem,
            quantity,
            customizations: { size: selectedSize, ice: selectedIce, sweetness: selectedSweetness, toppings: selectedToppings },
            finalPrice: calculatePrice(),
        }));
        sheetRef.current?.dismiss();
    };

    const renderBackdrop = useCallback(
        (props: React.ComponentProps<typeof BottomSheetBackdrop>) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />,
        []
    );

    const sizeOptionsWithLabel = useMemo(() =>
        editingItem
            ? SIZE_OPTIONS.map(o => ({ id: o.id, label: `${o.label}: ${OrderService.formatPrice(editingItem.product.price + o.priceAdjust)}` }))
            : [],
        [editingItem]
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
                backgroundStyle={[styles.bottomSheetBg, { backgroundColor: BRAND_COLORS.primary.p1 }]}
                handleIndicatorStyle={[styles.indicator, { backgroundColor: BRAND_COLORS.secondary.s3 }]}
                index={0}
                stackBehavior="push"
                onDismiss={() => setEditingItem(null)}
            >
                {editingItem ? (
                    <>
                        <BottomSheetScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{editingItem.product.name}</Text>
                                <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} style={styles.closeBtn}>
                                    <Ionicons name="close" size={24} color={BRAND_COLORS.ui.subtitle} />
                                </TouchableOpacity>
                            </View>

                            <OptionSelectorRow title={EDIT_PRODUCT_TEXT.SIZE_LABEL} hint={EDIT_PRODUCT_TEXT.SIZE_HINT} options={sizeOptionsWithLabel} selectedId={selectedSize} onSelect={(id) => setSelectedSize(id as any)} required />
                            <OptionSelectorRow title={EDIT_PRODUCT_TEXT.ICE_LABEL} options={ICE_OPTIONS} selectedId={selectedIce} onSelect={(id) => setSelectedIce(id as any)} />
                            <OptionSelectorRow title={EDIT_PRODUCT_TEXT.SWEETNESS_LABEL} options={SWEETNESS_OPTIONS} selectedId={selectedSweetness} onSelect={(id) => setSelectedSweetness(id as any)} />

                            <ToppingSelectorButton selectedToppings={selectedToppings} onPress={() => toppingModalRef.current?.present(selectedToppings)} />

                            <TouchableOpacity style={styles.noteRow}>
                                <Ionicons name="document-text-outline" size={20} color={BRAND_COLORS.ui.subtitle} />
                                <Text style={[styles.noteText, { color: BRAND_COLORS.ui.subtitle }]}>{EDIT_PRODUCT_TEXT.NOTE_LABEL}</Text>
                            </TouchableOpacity>
                        </BottomSheetScrollView>

                        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: BRAND_COLORS.screenBg.warm, borderTopColor: BRAND_COLORS.ui.placeholder }]}>
                            <QuantityControlRow quantity={quantity} onDecrease={() => handleQuantityChange(-1)} onIncrease={() => handleQuantityChange(1)} />
                            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: BRAND_COLORS.secondary.s3 }]} onPress={handleApplyChanges}>
                                <Text style={[styles.applyBtnText, { color: BRAND_COLORS.bta.primaryText }]}>
                                    {EDIT_PRODUCT_TEXT.CHANGE_BUTTON} · {OrderService.formatPrice(calculatePrice())}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : null}
            </BottomSheetModal>

            <AddToppingBottomSheet ref={toppingModalRef} onApply={setSelectedToppings} availableToppings={availableToppings} />
        </>
    );
});

OrderProductEditBottomSheet.displayName = 'OrderProductEditBottomSheet';

const styles = StyleSheet.create({
    bottomSheetBg: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    indicator: { width: 40 },
    content: { paddingHorizontal: 16, paddingTop: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: TYPOGRAPHY.fontFamily.heading },
    closeBtn: { padding: 4 },
    noteRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
    noteText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.bodyRegular },
    footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, borderTopWidth: 1, gap: 12 },
    applyBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    applyBtnText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.heading },
});
