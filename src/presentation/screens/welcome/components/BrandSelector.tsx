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

export function BrandSelector() {
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
            style={[styles.brandCard, selectedBrandId === brand.id && styles.brandCardActive]}
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
    paddingRight: 16,
    gap: 12,
  },
  brandCard: {
    width: 80,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  brandCardActive: {
    transform: [{ scale: 1.05 }],
  },
  brandPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
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
    fontSize: 14,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
    padding: 8,
  },
  brandNameText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
  },
});