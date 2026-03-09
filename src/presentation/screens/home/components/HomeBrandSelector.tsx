import { Brand } from '@/src/domain/entities/Brand';
import { fetchBrands, selectBrands, selectSelectedBrandId } from '@/src/state/slices/brandSlice';
import { useAppSelector } from '@/src/utils/hooks';
import { useBrandColor } from '@/src/utils/hooks/useBrandColor';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BrandDetailBottomSheet } from '../../../components/brand/BrandDetailBottomSheet';
import { BRAND_COLORS, DYNAMIC_COLORS } from '../../../theme/colors';
import { HOME_LAYOUT } from '../HomeLayout';

export function HomeBrandSelector() {
  const dispatch = useDispatch<any>();
  const brands = useAppSelector(selectBrands);
  const selectedBrandId = useAppSelector(selectSelectedBrandId);
  const { fetchAndCacheBrand, applyBrandColors } = useBrandColor();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

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
    bottomSheetRef.current?.dismiss();
    setSelectedBrand(null);
  }, [selectedBrand, applyBrandColors]);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={[
              styles.brandCard,
              selectedBrandId === brand.id && styles.brandCardActive,
            ]}
            onPress={() => handleBrandPress(brand.id)}
          >
            <View style={[styles.brandPlaceholder, { borderColor: DYNAMIC_COLORS.colorTest.red, backgroundColor: DYNAMIC_COLORS.colorTest.blue }]}>
              {brand.logoUrl ? (
                <Image
                  source={{ uri: brand.logoUrl }}
                  style={styles.brandLogoImage}
                  resizeMode="cover"
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
    paddingRight: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.HOME_BRAND_SCROLL_GAP,
  },
  brandCard: {
    width: HOME_LAYOUT.HOME_BRAND_CARD_SIZE,
    marginBottom: HOME_LAYOUT.HOME_BRAND_CARD_MARGIN_BOTTOM,
    marginLeft: HOME_LAYOUT.HOME_BRAND_CARD_MARGIN_LEFT,
    alignItems: 'center',
  },
  brandCardActive: {
    transform: [{ scale: 1.05 }],
  },
  brandPlaceholder: {
    width: HOME_LAYOUT.HOME_BRAND_CARD_SIZE,
    height: HOME_LAYOUT.HOME_BRAND_CARD_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_BRAND_CARD_BORDER_RADIUS,
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
    fontSize: HOME_LAYOUT.HOME_BRAND_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
    padding: HOME_LAYOUT.HOME_BRAND_CARD_PADDING,
  },
  brandNameText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
  },
});