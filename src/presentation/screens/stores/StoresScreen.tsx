import { APP_DEFAULT_LOCATION } from '@/src/core/config/locationConstants';
import { selectAppLocation } from '@/src/state/slices/appSlice';
import { setSelectedStore } from '@/src/state/slices/orderCartSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Store } from '../../../data/mockStores';
import { fetchMenuByStore } from '../../../state/slices/homeSlice';
import { clearStoresError, fetchStores, fetchStoresByProduct } from '../../../state/slices/storesSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
import { StoreSection } from './components/StoreSection';
import { StoresHeader } from './components/StoresHeader';
import { StoresSearchBar } from './components/StoresSearchBar';
import { STORES_TEXT } from './StoresConstants';
import { StoresUIService } from './StoresService';

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const params = useLocalSearchParams<{ productId?: string; mode?: 'select' | 'browse' }>();
  const [searchQuery, setSearchQuery] = useState('');
  const cachedLocation = useAppSelector(selectAppLocation);
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const { stores: apiStores, loading, error } = useAppSelector((state) => state.stores);
  const userLocation = cachedLocation ?? { lat: APP_DEFAULT_LOCATION.latitude, lng: APP_DEFAULT_LOCATION.longitude };
  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    if (!cachedLocation) return;

    if (params.mode === 'select' && params.productId) {
      dispatch(
        fetchStoresByProduct({
          lat: userLocation.lat,
          lng: userLocation.lng,
          productId: Number(params.productId),
          page: 0,
          limit: 20,
          refresh: true,
        })
      );
    } else if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchStores({ page: 1, refresh: true }));
    }
  }, [dispatch, params.mode, params.productId, cachedLocation, userLocation.lat, userLocation.lng]);

  const uiStores = useMemo<Store[]>(() => {
    return apiStores.map(apiStore =>
      StoresUIService.mapApiStoreToUIStore(apiStore, userLocation)
    );
  }, [apiStores, userLocation]);

  const filteredStores = useMemo(
    () => StoresUIService.filterStores(uiStores, searchQuery),
    [uiStores, searchQuery]
  );

  const nearestStore = useMemo(
    () => StoresUIService.getNearestStore(filteredStores),
    [filteredStores]
  );

  const otherStores = useMemo(
    () => StoresUIService.getOtherStores(filteredStores),
    [filteredStores]
  );

  const handleStorePress = useCallback(async (store: Store) => {
    console.log(`[StoresScreen] Store pressed: ${store.name}`);

    if (selectedStore && selectedStore.id !== store.id && totalItems > 0) {
      const confirmed = await popupService.confirm(
        STORES_TEXT.ALERT_MESSAGE(totalItems),
        {
          title: STORES_TEXT.ALERT_TITLE,
          confirmText: STORES_TEXT.ALERT_CONFIRM,
          cancelText: STORES_TEXT.ALERT_CANCEL,
          confirmStyle: 'destructive',
        }
      );

      if (!confirmed) {
        console.log('[StoresScreen] User cancelled store switch');
        return;
      }

      console.log('[StoresScreen] User confirmed, clearing cart and switching store');
      dispatch(setSelectedStore(store));
      dispatch(fetchMenuByStore(Number(store.id)));

      if (params.mode === 'select') {
        router.replace('/(tabs)/order');
      }
      return;
    }

    if (params.mode === 'select') {
      console.log('[StoresScreen] Setting store and navigating to Order');
      dispatch(setSelectedStore(store));
      dispatch(fetchMenuByStore(Number(store.id)));
      router.replace('/(tabs)/order');
    }
  }, [selectedStore, totalItems, dispatch, router, params.mode]);

  const handleRetry = useCallback(() => {
    dispatch(clearStoresError());

    if (params.mode === 'select' && params.productId && cachedLocation) {
      dispatch(
        fetchStoresByProduct({
          lat: userLocation.lat,
          lng: userLocation.lng,
          productId: Number(params.productId),
          page: 0,
          limit: 20,
          refresh: true,
        })
      );
    } else {
      dispatch(fetchStores({ page: 1, refresh: true }));
    }
  }, [dispatch, params.mode, params.productId, cachedLocation, userLocation]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StoresHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingText}>{STORES_TEXT.LOADING_MESSAGE}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StoresHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryButton} onPress={handleRetry}>
            {STORES_TEXT.RETRY_BUTTON}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StoresHeader />

      <StoresSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredStores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {params.mode === 'select' ? STORES_TEXT.EMPTY_MESSAGE_SELECT : STORES_TEXT.EMPTY_MESSAGE_BROWSE}
            </Text>
          </View>
        ) : (
          <>
            {nearestStore && (
              <StoreSection
                title={STORES_TEXT.SECTION_NEARBY}
                stores={[nearestStore]}
                onStorePress={handleStorePress}
              />
            )}

            <StoreSection
              title={STORES_TEXT.SECTION_OTHERS}
              stores={otherStores}
              onStorePress={handleStorePress}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.fresh,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.reuDam,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.reuDam,
    textAlign: 'center',
  },
});