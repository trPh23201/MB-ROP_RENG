import { createListenerMiddleware, isAnyOf, TypedStartListening } from "@reduxjs/toolkit";
import { PaymentMethod, PreOrderState } from "../../domain/shared";
import { PreOrderService } from "../../presentation/screens/preorder/PreOrderService";
import { setConfirmedOrder } from "../../state/slices/confirmOrderSlice";
import { setDeliveryAddress } from "../../state/slices/deliverySlice";
import { addToCart, clearCart, removeCartItem, removeItem, updateCartItem } from "../../state/slices/orderCartSlice";
import { createPreOrder, setOrderType, setSelectedVouchers } from "../../state/slices/preOrderSlice";
import { AppDispatch, RootState } from "../../state/store";

export class StateTrackingService {
    static middleware = createListenerMiddleware();

    static initialize() {
        const startAppListening = this.middleware.startListening as TypedStartListening<RootState, AppDispatch>;

        startAppListening({
            predicate: (action, currentState, originalState) => {
                const isTargetAction = isAnyOf(
                    addToCart,
                    updateCartItem,
                    removeCartItem,
                    removeItem,
                    clearCart,
                    setDeliveryAddress,
                    setOrderType,
                    setSelectedVouchers
                )(action);

                if (!isTargetAction) return false;

                const current = currentState as RootState;
                const original = originalState as RootState;

                const isCartChanged = current.orderCart.totalItems !== original.orderCart.totalItems ||
                    current.orderCart.totalPrice !== original.orderCart.totalPrice ||
                    current.orderCart.items !== original.orderCart.items;

                const isAddressChanged = JSON.stringify(current.delivery.selectedAddress) !== JSON.stringify(original.delivery.selectedAddress);
                const isOrderTypeChanged = current.preOrder.orderType !== original.preOrder.orderType;
                const isVoucherChanged = current.preOrder.selectedVouchers !== original.preOrder.selectedVouchers;

                return isCartChanged || isAddressChanged || isOrderTypeChanged || isVoucherChanged;
            },
            effect: async (action, listenerApi) => {
                listenerApi.cancelActiveListeners();

                await listenerApi.delay(500);

                const state = listenerApi.getState();
                const { user } = state.auth;
                const { store } = state.home;
                const { items } = state.orderCart;
                const { selectedAddress } = state.delivery;
                const { orderType, selectedVouchers } = state.preOrder;

                if (!user?.uuid || !store || items.length === 0) {
                    console.log("[StateTracking] Checks failed, skipping API call.");
                    return;
                }

                console.log("\n[StateTrackingService] Triggering Reactive Pre-Order Update...");

                const currentPreOrderState: PreOrderState = {
                    orderType: orderType,
                    paymentMethod: PaymentMethod.CASH,
                    shippingFee: 0
                };

                try {
                    const payload = PreOrderService.createPreOrderPayload(
                        { uuid: user.uuid, displayName: user.displayName },
                        store,
                        selectedAddress,
                        items,
                        currentPreOrderState,
                        selectedVouchers
                    );

                    const resultAction = await listenerApi.dispatch(createPreOrder(payload));

                    if (createPreOrder.fulfilled.match(resultAction)) {
                        const pricingResult = resultAction.payload;

                        const confirmedOrder = PreOrderService.synthesizeConfirmedOrder(
                            {
                                subtotal: pricingResult.subtotal,
                                finalAmount: pricingResult.finalAmount,
                                deliveryFee: pricingResult.deliveryFee,
                                discountAmount: pricingResult.discountAmount
                            },
                            { id: user.id || 0, displayName: user.displayName, phone: user.phone || '' },
                            store,
                            selectedAddress,
                            items,
                            currentPreOrderState
                        );

                        listenerApi.dispatch(setConfirmedOrder(confirmedOrder));
                        console.log("[StateTrackingService] Updated ConfirmedOrder State.");
                    }
                } catch (error) {
                    console.error("[StateTrackingService] API Call Failed:", error);
                }
            },
        });
    }
}

StateTrackingService.initialize();
