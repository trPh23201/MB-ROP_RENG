import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_PRODUCTS, Product } from '../../../data/mockProducts';
import { useAddToCart } from '../../../utils/hooks/useAddToCart';
import { AppIcon } from '../../components/shared/AppIcon';
import { useBrandColors } from '../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { SEARCH_TEXT } from './SearchConstants';
import { SearchFilterMode } from './SearchEnums';
import { SEARCH_LAYOUT } from './SearchLayout';
import { SearchUIService } from './SearchService';

export default function SearchScreen() {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const handleAddToCart = useAddToCart();
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const filterMode: SearchFilterMode = params.categoryId ? SearchFilterMode.CATEGORY : SearchFilterMode.ALL;

  const debouncedSearch = useMemo(
    () => SearchUIService.createDebounce(
      (query: string) => {
        const filtered = SearchUIService.applyFilters(
          MOCK_PRODUCTS,
          filterMode,
          query,
          params.categoryId as string | undefined
        );
        setFilteredProducts(filtered);
      },
      SEARCH_LAYOUT.SEARCH_DEBOUNCE_MS
    ),
    [filterMode, params.categoryId]
  );

  useEffect(() => {
    if (!isFocused) {
      setSearchQuery('');
      setFilteredProducts(MOCK_PRODUCTS);
    }
  }, [isFocused]);

  const handleCancel = () => {
    router.back();
  };

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  useEffect(() => {
    if (filterMode === SearchFilterMode.CATEGORY && params.categoryId) {
      const filtered = SearchUIService.filterByCategory(
        MOCK_PRODUCTS,
        params.categoryId as string
      );
      setFilteredProducts(filtered);
    }
  }, [params.categoryId, filterMode]);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={[styles.productImage, { backgroundColor: BRAND_COLORS.primary.p1, borderColor: BRAND_COLORS.border.dark }]}>
        <Text style={[styles.imagePlaceholder, { color: BRAND_COLORS.primary.p3 }]}>{SEARCH_TEXT.IMAGE_PLACEHOLDER}</Text>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: BRAND_COLORS.secondary.s4 }]}>
            <Text style={[styles.badgeText, { color: BRAND_COLORS.primary.p1 }]}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: BRAND_COLORS.primary.p3 }]}>{item.name}</Text>
        <Text style={[styles.productPrice, { color: BRAND_COLORS.primary.p3 }]}>{item.price.toLocaleString('vi-VN')}đ</Text>
      </View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={() => handleAddToCart({
        id: item.id,
        menuItemId: item.menuItemId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        categoryId: item.categoryId,
        originalPrice: item.originalPrice,
        badge: item.badge,
        discount: item.discount,
        status: 'AVAILABLE'
      })}>
        <Text style={[styles.addIcon, { color: BRAND_COLORS.primary.p1 }]}>+</Text>
      </TouchableOpacity>
    </View>
  ), [handleAddToCart]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: BRAND_COLORS.screenBg.warm }]}>
      <View style={[styles.header, { borderBottomColor: BRAND_COLORS.secondary.s6 }]}>
        <View style={[styles.searchBar, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
          <AppIcon name={HEADER_ICONS.SEARCH} size="xs" />
          <TextInput
            style={[styles.searchInput, { color: BRAND_COLORS.primary.p3 }]}
            placeholder={SEARCH_TEXT.PLACEHOLDER}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>

        <TouchableOpacity onPress={handleCancel}>
          <Text style={[styles.cancelButton, { color: BRAND_COLORS.primary.p3 }]}>{SEARCH_TEXT.CANCEL_BUTTON}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SEARCH_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: SEARCH_LAYOUT.HEADER_PADDING_VERTICAL,
    gap: SEARCH_LAYOUT.HEADER_GAP,
    borderBottomWidth: SEARCH_LAYOUT.HEADER_BORDER_BOTTOM_WIDTH,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SEARCH_LAYOUT.SEARCH_BAR_BORDER_RADIUS,
    paddingHorizontal: SEARCH_LAYOUT.SEARCH_BAR_PADDING_HORIZONTAL,
    gap: SEARCH_LAYOUT.SEARCH_BAR_GAP,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: SEARCH_LAYOUT.SEARCH_INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Regular',
    paddingVertical: 8,
  },
  cancelButton: {
    fontSize: SEARCH_LAYOUT.CANCEL_BUTTON_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  list: {
    padding: SEARCH_LAYOUT.LIST_PADDING,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SEARCH_LAYOUT.ITEM_BORDER_RADIUS,
    padding: SEARCH_LAYOUT.ITEM_PADDING,
    marginBottom: SEARCH_LAYOUT.ITEM_MARGIN_BOTTOM,
    gap: SEARCH_LAYOUT.ITEM_GAP,
  },
  productImage: {
    width: SEARCH_LAYOUT.IMAGE_SIZE,
    height: SEARCH_LAYOUT.IMAGE_SIZE,
    borderRadius: SEARCH_LAYOUT.IMAGE_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  imagePlaceholder: {
    fontSize: SEARCH_LAYOUT.IMAGE_PLACEHOLDER_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  badge: {
    position: 'absolute',
    top: SEARCH_LAYOUT.BADGE_TOP,
    right: SEARCH_LAYOUT.BADGE_RIGHT,
    borderRadius: SEARCH_LAYOUT.BADGE_BORDER_RADIUS,
    paddingHorizontal: SEARCH_LAYOUT.BADGE_PADDING_HORIZONTAL,
    paddingVertical: SEARCH_LAYOUT.BADGE_PADDING_VERTICAL,
  },
  badgeText: {
    fontSize: SEARCH_LAYOUT.BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: SEARCH_LAYOUT.PRODUCT_NAME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SEARCH_LAYOUT.PRODUCT_PRICE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  addButton: {
    width: SEARCH_LAYOUT.ADD_BUTTON_SIZE,
    height: SEARCH_LAYOUT.ADD_BUTTON_SIZE,
    borderRadius: SEARCH_LAYOUT.ADD_BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: SEARCH_LAYOUT.ADD_ICON_FONT_SIZE,
    fontWeight: 'bold',
  },
});