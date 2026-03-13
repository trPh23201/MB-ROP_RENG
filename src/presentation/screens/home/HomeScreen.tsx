import { APP_DEFAULT_LOCATION } from '@/src/core/config/locationConstants';
import { selectAppLocation } from '@/src/state/slices/appSlice';
import { useAddToCart } from '@/src/utils/hooks/useAddToCart';
import { useHomeData } from '@/src/utils/hooks/useHomeData';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../../utils/hooks';
import {
  CategoryItem,
  EntryBrandSelector,
  EntryCategoryScroll,
  EntryProductCard,
  EntryPromoBanner,
  EntryQuickActions,
  EntrySearchBar,
  ProductCardData,
} from '../../components/entry';
import { AppIcon } from '../../components/shared/AppIcon';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { useBrandColors } from '../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../theme/iconConstants';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { LocationBanner } from './components/LocationBanner';
import { HOME_TEXT } from './HomeConstants';
import { HOME_LAYOUT } from './HomeLayout';

const PAGE_LIMIT = 10;
const LOAD_MORE_THRESHOLD = 0.5;

const CATEGORY_ICONS: Record<string, string> = {
  '1': 'cafe',
  '2': 'leaf-outline',
  '3': 'snow-outline',
};

export default function HomeScreen() {
  const BRAND_COLORS = useBrandColors();
  const handleAddToCart = useAddToCart();

  const cachedLocation = useAppSelector(selectAppLocation);
  const currentLocation = cachedLocation ?? {
    lat: APP_DEFAULT_LOCATION.latitude,
    lng: APP_DEFAULT_LOCATION.longitude,
  };

  const [locationError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
    console.log('[HomeScreen] Product pressed:', product.id);

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

  const handleQuickActionPress = useCallback((actionId: string, label: string) => {
    console.log(`[HomeQuickActions] Selected: ${label} (${actionId})`);
    // TODO: Navigate to store selection or order flow
  }, []);

  const handleBannerPress = useCallback((promoId: string) => {
    console.log(`[AuthenticatedPromoBanner] Clicked: Promo ${promoId}`);
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
    refresh();
  }, [clearError, refresh]);

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

  const voucherCount = vouchers.length;
  const showMiniCart = isAuthenticated && totalItems > 0;

  const renderProduct: ListRenderItem<typeof products[0]> = useCallback(
    ({ item }) => <EntryProductCard product={item} onPress={handleProductPress} />,
    [handleProductPress]
  );

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

  const handleLocationPress = useCallback(() => {
    console.log('[HomeScreen] Location banner pressed');
    // TODO: Navigate to address selection or show location modal
  }, []);

  const ListHeader = useCallback(
    () => (
      <>
        <LocationBanner
          userAddress={userAddress}
          locationError={locationError}
          onPress={handleLocationPress}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>Lựa chọn thương hiệu</Text>
          <EntryBrandSelector />
        </View>
        <View style={styles.section}>
          <EntryQuickActions onActionPress={handleQuickActionPress} />
        </View>
        <View style={styles.section}>
          <EntryPromoBanner onBannerPress={handleBannerPress} autoScroll />
        </View>
        <View style={styles.section}>
          <EntrySearchBar />
        </View>
        {categories.length > 0 && (
          <EntryCategoryScroll categories={categories} layout="grid" />
        )}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>{HOME_TEXT.PRODUCT_SECTION_TITLE}</Text>
        </View>
      </>
    ),
    [categories, locationError, userAddress, handleLocationPress, BRAND_COLORS]
  );

  const ListFooter = useCallback(
    () =>
      isLoadingMore ? (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={BRAND_COLORS.primary.p3} />
          <Text style={[styles.loadingMoreText, { color: BRAND_COLORS.text.secondary }]}>Đang tải thêm...</Text>
        </View>
      ) : !hasMore && products.length > 0 ? (
        <View style={styles.endList}>
          <Text style={[styles.endListText, { color: BRAND_COLORS.text.secondary }]}>Đã hiển thị tất cả sản phẩm</Text>
        </View>
      ) : (
        <View style={{ height: 100 }} />
      ),
    [isLoadingMore, hasMore, products.length, BRAND_COLORS]
  );

  const ListEmpty = useCallback(
    () =>
      error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error.includes('404') ? 'Không tìm thấy cửa hàng ở khu vực này' : error}
          </Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={handleRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: BRAND_COLORS.text.secondary }]}>Không có sản phẩm</Text>
        </View>
      ),
    [error, handleRetry, BRAND_COLORS]
  );

  const isInitialLoading = (isLoading && products.length === 0) || !cachedLocation;

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" style={[styles.greetingIcon, { color: BRAND_COLORS.primary.p1 }]} />
          <Text style={[styles.greetingText, { color: BRAND_COLORS.primary.p1 }]} numberOfLines={1}>
            {userName}
            {HOME_TEXT.HEADER.GREETING_SUFFIX}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.voucherBadge, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
            <AppIcon name={HEADER_ICONS.VOUCHER} size="sm" />
            <Text style={[styles.voucherCount, { color: BRAND_COLORS.primary.p3 }]}>{voucherCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
            <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [userName, voucherCount, BRAND_COLORS]
  );

  return (
    <LinearGradient
      colors={[
        BRAND_COLORS.primary.p3,
        BRAND_COLORS.primary.p2,
        BRAND_COLORS.primary.p1,
        '#FFFFFF',
      ]}
      style={styles.container}
    >
      <BaseFullScreenLayout
        backgroundColor="transparent"
        safeAreaEdges={['top', 'left', 'right']}
        renderHeader={renderHeader}
      >
        {isInitialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BRAND_COLORS.primary.p3} />
            <Text style={[styles.loadingText, { color: BRAND_COLORS.primary.p3 }]}>
              {!cachedLocation ? 'Đang xác định vị trí...' : 'Đang tải menu...'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={ListEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[BRAND_COLORS.primary.p3]}
                tintColor={BRAND_COLORS.primary.p3}
              />
            }
            onEndReached={(!error && products.length > 0) ? loadMore : null}
            onEndReachedThreshold={LOAD_MORE_THRESHOLD}
            showsVerticalScrollIndicator={false}
          />
        )}

        {showMiniCart && <MiniCartButton onPress={() => setShowPreOrder(true)} />}

        <PreOrderBottomSheet
          visible={showPreOrder}
          onClose={() => setShowPreOrder(false)}
          onOrderSuccess={() => router.replace('../(tabs)/')}
        />
      </BaseFullScreenLayout>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HEADER_PADDING_VERTICAL,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HOME_LAYOUT.GREETING_GAP,
    flex: 1,
  },
  greetingIcon: {  },
  greetingText: {
    fontSize: HOME_LAYOUT.GREETING_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.VOUCHER_BADGE_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.VOUCHER_BADGE_PADDING_VERTICAL,
    borderRadius: HOME_LAYOUT.VOUCHER_BADGE_BORDER_RADIUS,
    gap: HOME_LAYOUT.VOUCHER_BADGE_GAP,
  },
  voucherCount: {
    fontSize: HOME_LAYOUT.VOUCHER_BADGE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  iconButton: {
    width: HOME_LAYOUT.HEADER_ICON_SIZE,
    height: HOME_LAYOUT.HEADER_ICON_SIZE,
    borderRadius: HOME_LAYOUT.HEADER_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 16 },
  productRow: { justifyContent: 'space-between' },
  section: { marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM },
  sectionTitle: {
    fontSize: HOME_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  endList: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endListText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  errorContainer: { padding: 40, alignItems: 'center', gap: 12 },
  errorText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  userLocationInfo: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  storeName: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  userLocationText: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Regular',
    marginTop: 4,
  },
});