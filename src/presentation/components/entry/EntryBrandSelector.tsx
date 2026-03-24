import { Brand } from '@/src/domain/entities/Brand';
import { fetchBrands, selectBrand, selectBrands, selectSelectedBrandId } from '@/src/state/slices/brandSlice';
import { useAppSelector } from '@/src/utils/hooks';
import { useBrandColor } from '@/src/utils/hooks/useBrandColor';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BrandDetailBottomSheet } from '../brand/BrandDetailBottomSheet';
import { useBrandColors } from '../../theme/BrandColorContext';
import { ENTRY_LAYOUT } from './EntryLayout';

export function EntryBrandSelector() {
  const BRAND_COLORS = useBrandColors();
  const dispatch = useDispatch<any>();
  const brands = useAppSelector(selectBrands);
  const selectedBrandId = useAppSelector(selectSelectedBrandId);
  const { fetchAndCacheBrand, applyBrandColors } = useBrandColor();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (brands.length === 0) {
      dispatch(fetchBrands());
    }
  }, [dispatch, brands.length]);

  useEffect(() => {
    if (selectedBrand) {
      bottomSheetRef.current?.present();
    }
  }, [selectedBrand]);

  const handleBrandPress = useCallback(async (brandId: number) => {
    const brand = await fetchAndCacheBrand(brandId);
    if (brand) setSelectedBrand(brand);
  }, [fetchAndCacheBrand]);

  const handleVisit = useCallback(async () => {
    if (!selectedBrand) return;
    await applyBrandColors(selectedBrand.id);
    dispatch(selectBrand(selectedBrand.id));
    bottomSheetRef.current?.dismiss();
    setSelectedBrand(null);
  }, [selectedBrand, applyBrandColors, dispatch]);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={[styles.brandCard, selectedBrandId === brand.id && styles.brandCardActive]}
            onPress={() => handleBrandPress(brand.id)}
          >
            <View style={[styles.brandPlaceholder, { borderColor: BRAND_COLORS.bta.primaryBg, backgroundColor: BRAND_COLORS.screenBg.warm }]}>
              {brand.logoUrl ? (
                <Image
                  source={{ uri: brand.logoUrl }}
                  style={styles.brandLogoImage}
                  contentFit="cover"
                  cachePolicy="disk"
                />
              ) : (
                <Text style={styles.brandPlaceholderText}>
                  {brand.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.brandNameText} numberOfLines={1}>{brand.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BrandDetailBottomSheet
        ref={bottomSheetRef}
        brand={selectedBrand}
        onVisit={handleVisit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: ENTRY_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: ENTRY_LAYOUT.BRAND_SCROLL_GAP,
  },
  brandCard: {
    width: ENTRY_LAYOUT.BRAND_CARD_SIZE,
    marginBottom: ENTRY_LAYOUT.BRAND_CARD_MARGIN_BOTTOM,
    marginLeft: ENTRY_LAYOUT.BRAND_CARD_MARGIN_LEFT,
    alignItems: 'center',
  },
  brandCardActive: {
    transform: [{ scale: 1.05 }],
  },
  brandPlaceholder: {
    width: ENTRY_LAYOUT.BRAND_CARD_SIZE,
    height: ENTRY_LAYOUT.BRAND_CARD_SIZE,
    borderRadius: ENTRY_LAYOUT.BRAND_CARD_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  brandLogoImage: {
    width: '100%',
    height: '100%',
  },
  brandPlaceholderText: {
    fontSize: ENTRY_LAYOUT.BRAND_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
    textAlign: 'center',
    padding: ENTRY_LAYOUT.BRAND_CARD_PADDING,
  },
  brandNameText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
});
