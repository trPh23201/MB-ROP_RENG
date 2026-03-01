import { selectSelectedAddress } from '@/src/state/slices/deliverySlice';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { OrderType, PaymentMethod } from '../../../domain/shared';
import { clearCart } from '../../../state/slices/orderCartSlice';
import { selectLastOrder, selectPreOrderType, selectSelectedVouchers, setOrderType, setSelectedVouchers } from '../../../state/slices/preOrderSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { OrderAddressCard } from '../../components/order/OrderAddressCard';
import { OrderFooter } from '../../components/order/OrderFooter';
import { OrderDisplayItem } from '../../components/order/OrderInterfaces';
import { OrderMapper } from '../../components/order/OrderMapper';
import { OrderPriceSection } from '../../components/order/OrderPriceSection';
import { OrderProductEditBottomSheet, OrderProductEditRef } from '../../components/order/OrderProductEditBottomSheet';
import { OrderProductList } from '../../components/order/OrderProductList';
import { OrderTypeSelector } from '../../components/order/OrderTypeSelector';
import { BaseBottomSheetLayout } from '../../layouts/BaseBottomSheetLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { CartItem } from '../order/OrderInterfaces';
import { PREORDER_TEXT } from './PreOrderConstants';
import { PreOrderBottomSheetProps, PreOrderState } from './PreOrderInterfaces';
import { PREORDER_LAYOUT } from './PreOrderLayout';
import { PreOrderService } from './PreOrderService';
import { OrderTypeModal } from './components/OrderTypeModal';
import { PaymentTypeModal } from './components/PaymentTypeModal';
import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { VoucherSelectionModal } from './components/VoucherSelectionModal';

export default function PreOrderBottomSheet({ visible, onClose, onOrderSuccess }: PreOrderBottomSheetProps) {
  const dispatch = useAppDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const orderTypeModalRef = useRef<BottomSheetModal>(null);
  const paymentModalRef = useRef<BottomSheetModal>(null);
  const editProductModalRef = useRef<OrderProductEditRef>(null);
  const voucherModalRef = useRef<BottomSheetModal>(null);
  const { totalItems, totalPrice, selectedStore } = useAppSelector((state) => state.orderCart);
  const deliveryAddress = useAppSelector(selectSelectedAddress);
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.orderCart.items);
  const lastOrder = useAppSelector(selectLastOrder);
  const globalOrderType = useAppSelector(selectPreOrderType);
  const selectedVouchers = useAppSelector(selectSelectedVouchers);

  const [preOrderState, setPreOrderState] = useState<PreOrderState>({
    orderType: globalOrderType,
    paymentMethod: PaymentMethod.CASH,
    shippingFee: 0,
  });

  useEffect(() => {
    if (lastOrder) {
      setPreOrderState(prev => ({
        ...prev,
        shippingFee: lastOrder.deliveryFee
      }));
    }
  }, [lastOrder]);

  useEffect(() => {
    setPreOrderState(prev => ({ ...prev, orderType: globalOrderType }));
  }, [globalOrderType]);

  const [isNavigatingToAddress, setIsNavigatingToAddress] = useState(false);
  const serverSubtotal = lastOrder?.subtotal ?? totalPrice;
  const serverShippingFee = lastOrder?.deliveryFee ?? 0;
  const serverDiscountAmount = lastOrder?.discountAmount ?? 0;
  const serverFinalTotal = lastOrder?.finalAmount ?? totalPrice;
  const displayItems = useMemo(() => OrderMapper.mapCartItemsToDisplayItems(cartItems), [cartItems]);

  const snapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    if (visible && !isNavigatingToAddress) {
      bottomSheetRef.current?.present();
    } else if (!visible) {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, isNavigatingToAddress]);

  useFocusEffect(
    useCallback(() => {
      if (isNavigatingToAddress && visible) {
        const timer = setTimeout(() => {
          bottomSheetRef.current?.present();
          setIsNavigatingToAddress(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isNavigatingToAddress, visible])
  );

  const handleNavigateToAddress = useCallback(() => {
    setIsNavigatingToAddress(true);
    bottomSheetRef.current?.dismiss();

    setTimeout(() => {
      router.push('/address-management');
    }, 200);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1 && !isNavigatingToAddress) {
        onClose();
      }
    },
    [onClose, isNavigatingToAddress]
  );

  const handleOrderTypeChange = useCallback(
    (type: OrderType) => {
      dispatch(setOrderType(type));
      orderTypeModalRef.current?.dismiss();
    },
    [dispatch]
  );

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPreOrderState((prev) => ({ ...prev, paymentMethod: method }));
    paymentModalRef.current?.dismiss();
  }, []);

  const handleClearCart = useCallback(async () => {
    const confirmed = await popupService.confirm(
      PREORDER_TEXT.CONFIRM_CLEAR_MESSAGE,
      {
        title: PREORDER_TEXT.CONFIRM_CLEAR_TITLE,
        confirmText: PREORDER_TEXT.CONFIRM_CLEAR_CONFIRM,
        cancelText: PREORDER_TEXT.CONFIRM_CLEAR_CANCEL,
        confirmStyle: 'destructive'
      }
    );

    if (confirmed) {
      dispatch(clearCart());
      bottomSheetRef.current?.dismiss();
    }
  }, [dispatch]);

  const handlePromotionPress = useCallback(() => {
    voucherModalRef.current?.present();
  }, []);

  const handleApplyVouchers = useCallback(async (newSelectedVouchers: { code: string }[]) => {
    voucherModalRef.current?.dismiss();
    dispatch(setSelectedVouchers(newSelectedVouchers));
  }, [dispatch]);

  const handlePlaceOrder = useCallback(async () => {
    if (preOrderState.orderType === OrderType.DELIVERY && !deliveryAddress) {
      popupService.alert('Vui lòng chọn địa chỉ giao hàng', { title: 'THÔNG BÁO', type: 'error' });
      return;
    }

    const validation = PreOrderService.validateOrder(
      totalItems,
      selectedStore?.id?.toString() || null,
      preOrderState.paymentMethod
    );

    if (!validation.valid) {
      popupService.alert(validation.error || 'Lỗi đặt hàng', { title: 'THÔNG BÁO', type: 'error' });
      return;
    }

    if (!user?.uuid) {
      popupService.alert('Vui lòng đăng nhập để tiếp tục', { title: 'Yêu cầu đăng nhập', type: 'error' });
      return;
    }

    if (!selectedStore) {
      popupService.alert('Không tìm thấy thông tin cửa hàng', { title: 'THÔNG BÁO', type: 'error' });
      return;
    }

    bottomSheetRef.current?.dismiss();
    router.push('../confirm-order');

    onOrderSuccess();
  }, [totalItems, selectedStore, preOrderState, onOrderSuccess, deliveryAddress, user]);

  const handleAddMore = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.push('/(tabs)/order');
  }, []);

  const handleEditProduct = useCallback((displayItem: OrderDisplayItem) => {
    const cartItem = displayItem.originalItem as CartItem;
    if (cartItem) {
      editProductModalRef.current?.present(cartItem);
    }
  }, []);

  const FooterComponent = useMemo(() => {
    return (props: any) => (
      <OrderFooter
        {...props}
        orderType={preOrderState.orderType}
        totalItems={totalItems}
        totalPrice={serverFinalTotal}
        buttonText={PREORDER_TEXT.PLACE_ORDER_BUTTON}
        onButtonPress={handlePlaceOrder}
      />
    );
  }, [preOrderState.orderType, totalItems, serverFinalTotal, handlePlaceOrder]);

  return (
    <>
      <BaseBottomSheetLayout
        ref={bottomSheetRef}
        title={PREORDER_TEXT.TITLE}
        showClearButton={true}
        clearButtonText={PREORDER_TEXT.CLEAR_BUTTON}
        onClear={handleClearCart}
        onClose={() => bottomSheetRef.current?.dismiss()}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        footerComponent={FooterComponent}
        stackBehavior="push"
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <OrderTypeSelector
            selectedType={preOrderState.orderType}
            store={selectedStore}
            onPress={() => orderTypeModalRef.current?.present()}
            editable={true}
          />

          <OrderAddressCard
            orderType={preOrderState.orderType}
            address={deliveryAddress ? {
              name: (deliveryAddress.addressString || '').split(',')[0]?.trim() || '',
              full: deliveryAddress.addressString || ''
            } : null}
            onChangeAddress={handleNavigateToAddress}
            editable={true}
          />

          <OrderProductList
            items={displayItems}
            onItemPress={handleEditProduct}
            onAddMore={handleAddMore}
            showAddButton={true}
            editable={true}
          />

          <OrderPriceSection
            subtotal={serverSubtotal}
            shippingFee={serverShippingFee}
            discountAmount={serverDiscountAmount}
            onPromotionPress={handlePromotionPress}
            showPromotionButton={true}
          />

          <PaymentTypeSelector selectedMethod={preOrderState.paymentMethod} onPress={() => paymentModalRef.current?.present()} />
        </BottomSheetScrollView>
      </BaseBottomSheetLayout>

      <OrderTypeModal ref={orderTypeModalRef} selectedType={preOrderState.orderType} onSelectType={handleOrderTypeChange} />

      <PaymentTypeModal ref={paymentModalRef} selectedMethod={preOrderState.paymentMethod} onSelectMethod={handlePaymentMethodChange} />

      <VoucherSelectionModal
        ref={voucherModalRef}
        availableVouchers={lastOrder?.availableVouchers || []}
        initialSelectedVouchers={selectedVouchers}
        onApply={handleApplyVouchers}
      />

      <OrderProductEditBottomSheet ref={editProductModalRef} />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    paddingBottom: 200,
    gap: PREORDER_LAYOUT.SECTION_MARGIN_TOP,
  },
});