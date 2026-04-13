import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderType, PaymentMethod, PreOrderState } from '../../../domain/shared';
import { clearConfirmedOrder, SerializableConfirmOrderItem, submitOrder } from '../../../state/slices/confirmOrderSlice';
import { selectSelectedAddress } from '../../../state/slices/deliverySlice';
import { clearCart } from '../../../state/slices/orderCartSlice';
import { resetPreOrder, selectSelectedVouchers } from '../../../state/slices/preOrderSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { OrderAddressCard, OrderDisplayItem, OrderFooter, OrderPriceSection, OrderProductEditBottomSheet, OrderProductEditRef, OrderProductList, OrderTypeSelector } from '../../components/order';
import { BaseAuthenticatedLayout } from '../../layouts/BaseAuthenticatedLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { PreOrderService } from '../preorder/PreOrderService';
import { CONFIRM_ORDER_TEXT } from './ConfirmOrderConstants';
import { ConfirmOrderPaymentCard } from './components/confirm-order-payment-card';
import { ConfirmOrderSubmittingOverlay } from './components/confirm-order-submitting-overlay';

export default function ConfirmOrderScreen() {
    const BRAND_COLORS = useBrandColors();
    const dispatch = useAppDispatch();
    const editProductModalRef = useRef<OrderProductEditRef>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { confirmedOrder, error } = useAppSelector((state) => state.confirmOrder);
    const deliveryAddress = useAppSelector(selectSelectedAddress);
    const cartItems = useAppSelector((state) => state.orderCart.items);
    const selectedVouchers = useAppSelector(selectSelectedVouchers);
    const user = useAppSelector(state => state.auth.user);
    const selectedStore = useAppSelector(state => state.home.store);

    const orderType = useMemo(() => {
        if (confirmedOrder?.address) return OrderType.DELIVERY;
        return OrderType.TAKEAWAY;
    }, [confirmedOrder]);

    const displayItems: OrderDisplayItem[] = useMemo(() => {
        if (!confirmedOrder?.items) return [];
        return confirmedOrder.items.map((item: SerializableConfirmOrderItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            options: {
                size: item.options.size,
                ice: item.options.ice,
                sweetness: item.options.sweetness,
                toppings: item.options.toppings.map(t => ({ id: t.id, name: t.name || '', price: t.price })),
            },
            originalItem: item,
        }));
    }, [confirmedOrder]);

    const formattedAddress = useMemo(() => {
        if (deliveryAddress?.addressString) {
            const parts = deliveryAddress.addressString.split(',');
            return { name: parts[0]?.trim() || deliveryAddress.addressString, full: deliveryAddress.addressString };
        }
        if (confirmedOrder?.address?.detail) {
            const parts = confirmedOrder.address.detail.split(',');
            return { name: parts[0]?.trim() || confirmedOrder.address.detail, full: confirmedOrder.address.detail };
        }
        return null;
    }, [deliveryAddress, confirmedOrder]);

    const totals = useMemo(() => {
        if (!confirmedOrder) return { subtotal: 0, shippingFee: 0, discountAmount: 0, finalAmount: 0, totalItems: 0 };
        return {
            subtotal: confirmedOrder.subtotal,
            shippingFee: confirmedOrder.deliveryFee,
            discountAmount: confirmedOrder.discountAmount,
            finalAmount: confirmedOrder.finalAmount,
            totalItems: displayItems.reduce((sum, item) => sum + item.quantity, 0),
        };
    }, [confirmedOrder, displayItems]);

    const handleConfirmOrder = useCallback(async () => {
        if (!confirmedOrder || !user || !selectedStore) {
            popupService.alert('Thiếu thông tin đơn hàng', { type: 'error' });
            return;
        }
        try {
            const currentPreOrderState: PreOrderState = {
                orderType,
                paymentMethod: (confirmedOrder.paymentMethod as PaymentMethod) || PaymentMethod.CASH,
                shippingFee: confirmedOrder.deliveryFee,
            };
            const payload = PreOrderService.createPreOrderPayload(
                { uuid: user.uuid, displayName: user.displayName },
                selectedStore,
                deliveryAddress,
                cartItems,
                currentPreOrderState,
                selectedVouchers
            );
            await dispatch(submitOrder(payload)).unwrap();
            await popupService.alert(CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_MESSAGE, { title: CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_TITLE, buttonText: 'OK' });
            dispatch(clearCart());
            dispatch(clearConfirmedOrder());
            dispatch(resetPreOrder());
            router.replace('/order-history');
        } catch (err) {
            popupService.alert((err as string) || 'Không thể xác nhận đơn hàng', { title: CONFIRM_ORDER_TEXT.CONFIRM_ERROR_TITLE, type: 'error' });
        }
    }, [confirmedOrder, dispatch, user, selectedStore, deliveryAddress, cartItems, orderType, selectedVouchers]);

    if (!confirmedOrder || error) {
        return (
            <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorTitle, { color: BRAND_COLORS.ui.heading }]}>{CONFIRM_ORDER_TEXT.NO_ORDER_TITLE}</Text>
                    <Text style={[styles.errorMessage, { color: BRAND_COLORS.ui.subtitle }]}>{error || CONFIRM_ORDER_TEXT.NO_ORDER_MESSAGE}</Text>
                    <TouchableOpacity style={[styles.retryButton, { backgroundColor: BRAND_COLORS.bta.primaryBg }]} onPress={() => router.back()}>
                        <Text style={[styles.retryButtonText, { color: BRAND_COLORS.bta.primaryText }]}>{CONFIRM_ORDER_TEXT.BACK_BUTTON}</Text>
                    </TouchableOpacity>
                </View>
            </BaseAuthenticatedLayout>
        );
    }

    return (
        <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={[styles.scrollView, { backgroundColor: BRAND_COLORS.primary.p1 }]}
                    contentContainerStyle={[styles.contentContainer, { paddingBottom: 200 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <OrderTypeSelector selectedType={orderType} store={selectedStore} editable={false} />
                    <OrderAddressCard orderType={orderType} address={formattedAddress} editable={false} />
                    <OrderProductList items={displayItems} showAddButton={false} editable={false} />
                    <OrderPriceSection
                        subtotal={totals.subtotal}
                        shippingFee={totals.shippingFee}
                        discountAmount={totals.discountAmount}
                        onPromotionPress={() => popupService.alert(CONFIRM_ORDER_TEXT.VOUCHER_NOTICE, { title: 'Thông báo' })}
                        showPromotionButton={true}
                    />
                    <ConfirmOrderPaymentCard paymentMethod={confirmedOrder.paymentMethod} />
                </ScrollView>

                <View style={styles.footerContainer}>
                    <OrderFooter
                        orderType={orderType}
                        totalItems={totals.totalItems}
                        totalPrice={totals.finalAmount}
                        buttonText={CONFIRM_ORDER_TEXT.CONFIRM_BUTTON}
                        onButtonPress={handleConfirmOrder}
                        disabled={isSubmitting}
                    />
                </View>

                <ConfirmOrderSubmittingOverlay visible={isSubmitting} />
            </View>

            <OrderProductEditBottomSheet ref={editProductModalRef} />
        </BaseAuthenticatedLayout>
    );
}

const styles = StyleSheet.create({
    scrollView: { flex: 1 },
    contentContainer: { padding: 16, gap: 20 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    errorTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.bodyBold, marginBottom: 8 },
    errorMessage: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.bodyRegular, textAlign: 'center', marginBottom: 24 },
    retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    retryButtonText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.bodyMedium },
    footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
