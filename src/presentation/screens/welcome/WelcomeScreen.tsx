import { APP_DEFAULT_LOCATION } from '@/src/core/config/locationConstants';
import { selectAppLocation } from '@/src/state/slices/appSlice';
import { useAppSelector } from '@/src/utils/hooks';
import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import { useHomeData } from '@/src/utils/hooks/useHomeData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryItem, EntryProductCard, ProductCardData } from '../../components/entry';
import { AppIcon } from '../../components/shared/AppIcon';
import { useBrandColors } from '../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { WelcomeListHeader } from './components/WelcomeListHeader';
import { WELCOME_TEXT } from './WelcomeConstants';
import { WelcomeUIService } from './WelcomeService';

const PAGE_LIMIT = 10;
const LOAD_MORE_THRESHOLD = 0.5;

export default function WelcomeScreen() {
  const BRAND_COLORS = useBrandColors();
  const insets = useSafeAreaInsets();

  const cachedLocation = useAppSelector(selectAppLocation);
  const currentLocation = cachedLocation ?? {
    lat: APP_DEFAULT_LOCATION.latitude,
    lng: APP_DEFAULT_LOCATION.longitude,
  };

  const {products, isLoading, isLoadingMore, hasMore, error, refresh, loadMore, clearError} = useHomeData({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
    limit: PAGE_LIMIT,
    enabled: !!cachedLocation,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleRetry = useCallback(() => {
    clearError();
    refresh();
  }, [clearError, refresh]);

  const handleProductPress = useAuthGuard(
    (_product: ProductCardData) => {
      // Product detail navigation: not yet implemented
    },
    'PURCHASE',
    (product: ProductCardData) => ({ productId: product.id })
  );

  const handleQuickActionPress = useAuthGuard(
    (_actionId: string, _label: string) => {
      router.push('/(tabs)/order');
    },
    'PURCHASE',
    (actionId: string) => ({ actionId, returnTo: '/welcome' })
  );

  const handleBannerPress = useAuthGuard(
    (_promoId: string) => {
      // Promo detail navigation: not yet implemented
    },
    'CLAIM_PROMO',
    (promoId: string) => ({ promoCode: promoId })
  );

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  const categories: CategoryItem[] = useMemo(() => WelcomeUIService.extractCategories(products), [products]);

  const filteredProducts = useMemo(() => WelcomeUIService.filterProducts(products, selectedCategoryId), [products, selectedCategoryId]);

  const renderProduct: ListRenderItem<typeof products[0]> = useCallback(
    ({ item }) => <EntryProductCard product={item} onPress={handleProductPress} />,
    [handleProductPress]
  );

  const ListHeader = useCallback(
    () => (
      <WelcomeListHeader
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        handleCategoryPress={handleCategoryPress}
        handleQuickActionPress={handleQuickActionPress}
        handleBannerPress={handleBannerPress}
      />
    ),
    [categories, selectedCategoryId, handleCategoryPress, handleQuickActionPress, handleBannerPress]
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
          <Text style={[styles.endListText, { color: BRAND_COLORS.text.secondary }]}>Đã hiển thị tất cả</Text>
        </View>
      ) : (
        <View style={{ height: 32 }} />
      ),
    [isLoadingMore, hasMore, products.length]
  );

  const ListEmpty = useCallback(
    () =>
      error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={handleRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: BRAND_COLORS.text.secondary }]}>Không có sản phẩm</Text>
        </View>
      ),
    [error, handleRetry]
  );

  const isInitialLoading = !cachedLocation || (isLoading && products.length === 0);

  return (
    <LinearGradient
      colors={[
        BRAND_COLORS.primary.p3,
        BRAND_COLORS.primary.p2,
        BRAND_COLORS.primary.p1,
        '#FFFFFF',
      ]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" style={[styles.greetingIcon, { color: BRAND_COLORS.primary.p1 }]} />
          <Text style={[styles.greetingText, { color: BRAND_COLORS.primary.p1 }]}>{WELCOME_TEXT.HEADER.GREETING}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
            <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          </TouchableOpacity>
        </View>
      </View>

      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.p3} />
          <Text style={[styles.loadingText, { color: BRAND_COLORS.primary.p3 }]}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
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
          onEndReached={selectedCategoryId ? undefined : loadMore}
          onEndReachedThreshold={LOAD_MORE_THRESHOLD}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greetingIcon: { },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
  },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 16 },
  productRow: { justifyContent: 'space-between' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    marginBottom: 16,
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
  endList: { paddingVertical: 20, alignItems: 'center' },
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
});