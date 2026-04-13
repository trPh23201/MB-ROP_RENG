import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { CartFlyAnimation } from '../../components/shared/cart-fly-animation';
import { useCartFlyAnimation } from '../../hooks/use-cart-fly-animation';
import {
  EntryCategoryScroll,
  EntryBrandSelector,
  EntryProductCard,
  EntryPromoBanner,
  EntryQuickActions,
  EntrySearchBar,
} from '../../components/entry';
import { AnimatedProductCard } from '../../components/entry/animated-product-card';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { SkeletonShimmerList } from '../../components/shared/skeleton-shimmer-list';
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
  const { flyState, cartPosition, progress, onCartLayout, triggerFly } = useCartFlyAnimation();
  const miniCartRef = useRef<View>(null);
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
    ({ item }) => <AnimatedProductCard product={item} onPress={handleProductPress} />,
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
          <SkeletonShimmerList />
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

        {showMiniCart && (
          <View
            ref={miniCartRef}
            onLayout={() => {
              miniCartRef.current?.measure((_fx, _fy, w, h, px, py) => {
                onCartLayout(px, py, w, h);
              });
            }}
          >
            <MiniCartButton onPress={() => setShowPreOrder(true)} />
          </View>
        )}

        <PreOrderBottomSheet
          visible={showPreOrder}
          onClose={() => setShowPreOrder(false)}
          onOrderSuccess={() => router.replace('../(tabs)/')}
        />

        {/* Cart fly overlay — triggers via triggerFly(startPos, imageUrl) from product cards */}
        <CartFlyAnimation flyState={flyState} cartPosition={cartPosition} progress={progress} />
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
});
