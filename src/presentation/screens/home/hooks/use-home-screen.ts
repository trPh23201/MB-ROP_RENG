import { APP_DEFAULT_LOCATION } from '@/src/core/config/locationConstants';
import { selectAppLocation } from '@/src/state/slices/appSlice';
import { useAddToCart } from '@/src/utils/hooks/useAddToCart';
import { useHomeData } from '@/src/utils/hooks/useHomeData';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../utils/hooks';
import { CategoryItem, ProductCardData } from '../../../components/entry';

const PAGE_LIMIT = 10;
const CATEGORY_ICONS: Record<string, string> = {
  '1': 'cafe',
  '2': 'leaf-outline',
  '3': 'snow-outline',
};

export function useHomeScreen() {
  const handleAddToCart = useAddToCart();
  const cachedLocation = useAppSelector(selectAppLocation);
  const currentLocation = cachedLocation ?? {
    lat: APP_DEFAULT_LOCATION.latitude,
    lng: APP_DEFAULT_LOCATION.longitude,
  };

  const [locationError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const userName = phoneNumber?.replace('+84', '0') || 'User';

  const {
    products,
    vouchers,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    clearError,
  } = useHomeData({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
    limit: PAGE_LIMIT,
    enabled: !!cachedLocation,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleProductPress = useCallback((product: ProductCardData) => {
    const productForCart = {
      id: product.id,
      menuItemId: product.menuItemId,
      productId: product.productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      originalPrice: product.originalPrice,
      badge: product.badge,
      discount: product.discount,
      status: 'AVAILABLE' as const,
    };
    handleAddToCart(productForCart);
  }, [handleAddToCart]);

  const handleQuickActionPress = useCallback((_actionId: string, _label: string) => {}, []);
  const handleBannerPress = useCallback((_promoId: string) => {}, []);
  const handleRetry = useCallback(() => { clearError(); refresh(); }, [clearError, refresh]);
  const handleLocationPress = useCallback(() => {}, []);

  const categories: CategoryItem[] = React.useMemo(() => {
    const map = new Map<string, CategoryItem>();
    products.forEach((p) => {
      if (!map.has(p.categoryId)) {
        map.set(p.categoryId, {
          id: p.categoryId,
          name: `Danh mục ${p.categoryId}`,
          icon: CATEGORY_ICONS[p.categoryId] || 'cafe-outline',
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  useEffect(() => {
    const getAddress = async () => {
      if (currentLocation) {
        const address = await Location.reverseGeocodeAsync({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        });
        if (address[0]) {
          const parts = [
            address[0].street,
            address[0].district,
            address[0].subregion,
            address[0].city,
            address[0].region,
          ].filter(Boolean);
          setUserAddress(parts.join(', '));
        }
      }
    };
    getAddress();
  }, [currentLocation.lat, currentLocation.lng]);

  const voucherCount = vouchers.length;
  const showMiniCart = isAuthenticated && totalItems > 0;
  const isInitialLoading = (isLoading && products.length === 0) || !cachedLocation;

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    categories,
    locationError,
    userAddress,
    userName,
    voucherCount,
    showMiniCart,
    showPreOrder,
    refreshing,
    isInitialLoading,
    cachedLocation,
    handleRefresh,
    handleProductPress,
    handleQuickActionPress,
    handleBannerPress,
    handleRetry,
    handleLocationPress,
    setShowPreOrder,
    router,
  };
}
