import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, View } from 'react-native';
import {
  EntryCategoryScroll,
  EntryBrandSelector,
  EntryProductCard,
  EntryPromoBanner,
  EntryQuickActions,
  EntrySearchBar,
} from '../../components/entry';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { useBrandColors } from '../../theme/BrandColorContext';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { LocationBanner } from './components/LocationBanner';
import { HomeListEmpty, HomeListFooter } from './components/home-product-list-parts';
import { HomeScreenHeader } from './components/home-screen-header';
import { HOME_TEXT } from './HomeConstants';
import { HOME_LAYOUT } from './HomeLayout';
import { useHomeScreen } from './hooks/use-home-screen';

export default function HomeScreen() {
  const BRAND_COLORS = useBrandColors();
  const {
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
  } = useHomeScreen();

  const renderProduct: ListRenderItem<typeof products[0]> = useCallback(
    ({ item }) => <EntryProductCard product={item} onPress={handleProductPress} />,
    [handleProductPress]
  );

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
        {categories.length > 0 && <EntryCategoryScroll categories={categories} layout="grid" />}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>{HOME_TEXT.PRODUCT_SECTION_TITLE}</Text>
        </View>
      </>
    ),
    [categories, locationError, userAddress, handleLocationPress, BRAND_COLORS, handleQuickActionPress, handleBannerPress]
  );

  const ListFooter = useCallback(
    () => <HomeListFooter isLoadingMore={isLoadingMore} hasMore={hasMore} productCount={products.length} />,
    [isLoadingMore, hasMore, products.length]
  );

  const ListEmpty = useCallback(
    () => <HomeListEmpty error={error} onRetry={handleRetry} />,
    [error, handleRetry]
  );

  const renderHeader = useCallback(
    () => <HomeScreenHeader userName={userName} voucherCount={voucherCount} />,
    [userName, voucherCount]
  );

  return (
    <LinearGradient
      colors={[BRAND_COLORS.primary.p3, BRAND_COLORS.primary.p2, BRAND_COLORS.primary.p1, '#FFFFFF']}
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
            onEndReachedThreshold={0.5}
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
  listContent: { paddingHorizontal: 16 },
  productRow: { justifyContent: 'space-between' },
  section: { marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM },
  sectionTitle: {
    fontSize: HOME_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 16, fontFamily: 'SpaceGrotesk-Medium' },
});
