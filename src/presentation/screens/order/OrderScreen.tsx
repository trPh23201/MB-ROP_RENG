import { useAddToCart } from '@/src/utils/hooks/useAddToCart';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { clearPendingAction } from '../../../state/slices/authSlice';
import { selectProducts } from '../../../state/slices/homeSlice';
import { addToCart } from '../../../state/slices/orderCartSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { OrderCategoryScroll } from './components/OrderCategoryScroll';
import { OrderHeader } from './components/OrderHeader';
import { OrderProductSection } from './components/OrderProductSection';
import { OrderPromoSection } from './components/OrderPromoSection';

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const handleAddToCart = useAddToCart();
  const [showPreOrder, setShowPreOrder] = useState(false);

  const pendingAction = useAppSelector((state) => state.auth.pendingAction);
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const products = useAppSelector(selectProducts);
  const processedActionRef = useRef<string | null>(null);
  const showMiniCart = isAuthenticated && totalItems > 0;

  useEffect(() => {
    console.log('[OrderScreen] Store or Action changed, checking conditions...');
    console.log(`[OrderScreen] selectedStore: ${selectedStore?.name || 'null'}`);
    console.log(`[OrderScreen] pendingAction: ${pendingAction ? JSON.stringify(pendingAction) : 'null'}`);

    if (!pendingAction) {
      console.log('[OrderScreen] No pending action');
      return;
    }

    if (pendingAction.type !== 'PURCHASE') {
      console.log('[OrderScreen] Action is not PURCHASE');
      return;
    }

    if (!pendingAction.context.productId) {
      console.log('[OrderScreen] No productId in action');
      return;
    }

    if (!selectedStore) {
      console.log('[OrderScreen] No store selected, waiting...');
      return;
    }

    const actionKey = `${pendingAction.context.productId}-${pendingAction.timestamp}`;
    if (processedActionRef.current === actionKey) {
      console.log('[OrderScreen] Action already processed, skipping');
      return;
    }

    console.log(`[OrderScreen] All conditions met! Auto-adding product: ${pendingAction.context.productId}`);

    const product = products.find((p) => p.id === pendingAction.context.productId);

    if (!product) {
      console.error(`[OrderScreen] Product not found: ${pendingAction.context.productId}`);
      popupService.alert('Sản phẩm trong yêu cầu không tồn tại', { title: 'Lỗi', type: 'error' });
      dispatch(clearPendingAction());
      processedActionRef.current = actionKey;
      return;
    }

    console.log(`[OrderScreen] Found product: ${product.name}, adding to cart...`);
    dispatch(addToCart(product));

    console.log('[OrderScreen] Product added, clearing pending action');
    dispatch(clearPendingAction());

    processedActionRef.current = actionKey;

    popupService.alert(`Đã thêm ${product.name} vào giỏ hàng`, { title: 'Thành công', type: 'success' });
  }, [selectedStore, pendingAction, dispatch, products]);

  const handleMiniCartPress = () => {
    console.log('[OrderScreen] Opening PreOrder sheet');
    setShowPreOrder(true);
  };

  const handlePreOrderClose = () => {
    setShowPreOrder(false);
  };

  const handleOrderSuccess = () => {
    console.log('[OrderScreen] Order placed successfully, redirecting to Home');
    router.replace('../(tabs)/');
  };

  const productsByCategory = useMemo(() => {
    const categoryMap = new Map<string, { categoryName: string; products: typeof products }>();

    products.forEach(product => {
      const categoryId = product.categoryId;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { categoryName: `Danh mục ${categoryId}`, products: [] });
      }
      categoryMap.get(categoryId)!.products.push(product);
    });

    return Array.from(categoryMap.values());
  }, [products]);



  const renderHeader = useCallback(() => (
    <View style={{ paddingTop: insets.top, backgroundColor: BRAND_COLORS.screenBg.fresh }}>
      <OrderHeader />
    </View>
  ), [insets.top]);

  return (
    <BaseFullScreenLayout
      renderHeader={renderHeader}
      testID="order-screen"
      backgroundColor={BRAND_COLORS.screenBg.fresh}
      safeAreaEdges={['left', 'right']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <OrderCategoryScroll />

        {MOCK_COMBOS.map((combo) => (
          <OrderPromoSection
            key={combo.id}
            title={combo.title}
            expiresAt={combo.expiresAt}
            products={combo.products}
            onProductPress={(product) => handleAddToCart({
              id: product.id,
              menuItemId: product.menuItemId,
              productId: product.productId,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              categoryId: product.categoryId,
              originalPrice: product.originalPrice,
              badge: product.badge,
              discount: undefined,
              status: 'AVAILABLE'
            })}
          />
        ))}

        {productsByCategory.map((section, index) => (
          <OrderProductSection
            key={index}
            title={section.categoryName}
            products={section.products}
            onAddPress={handleAddToCart}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {showMiniCart && <MiniCartButton onPress={handleMiniCartPress} />}

      <PreOrderBottomSheet visible={showPreOrder} onClose={handlePreOrderClose} onOrderSuccess={handleOrderSuccess} />
    </BaseFullScreenLayout>
  );
}