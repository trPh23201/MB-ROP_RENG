import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { STORES_TEXT } from '../StoresConstants';
import { StoreCardProps } from '../StoresInterfaces';
import { STORES_LAYOUT } from '../StoresLayout';
import { StoresUIService } from '../StoresService';

export function StoreCard({ store, onPress }: StoreCardProps) {
  const BRAND_COLORS = useBrandColors();
  const handlePress = useAuthGuard(
    () => {
      onPress();
      console.log(`[StoreCard] Viewing: ${store.name}`);
      // TODO: Navigate to store detail
    },
    'VIEW_STORE',
    () => ({
      storeId: store.id,
      returnTo: '/(tabs)/stores',
    })
  );
  
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: BRAND_COLORS.primary.p1, borderLeftColor: BRAND_COLORS.secondary.s3 }]} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: store.imageUrl }} style={[styles.image, { backgroundColor: BRAND_COLORS.primary.p2 }]} contentFit="cover" cachePolicy="disk" />
      <View style={styles.info}>
        <Text style={[styles.brandName, { color: BRAND_COLORS.secondary.s4 }]}>{store.brandName}</Text>
        <Text style={[styles.name, { color: BRAND_COLORS.secondary.s5 }]}>{store.name}</Text>
        <Text style={[styles.distance, { color: BRAND_COLORS.secondary.s3 }]}>
          {STORES_TEXT.DISTANCE_PREFIX} {StoresUIService.formatDistance(store.distanceKm)} {STORES_TEXT.DISTANCE_SUFFIX}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: STORES_LAYOUT.STORE_CARD_BORDER_RADIUS,
    padding: STORES_LAYOUT.STORE_CARD_PADDING,
    marginBottom: STORES_LAYOUT.STORE_CARD_MARGIN_BOTTOM,
    gap: STORES_LAYOUT.STORE_CARD_GAP,
    borderWidth: 0,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: STORES_LAYOUT.STORE_IMAGE_SIZE,
    height: STORES_LAYOUT.STORE_IMAGE_SIZE,
    borderRadius: STORES_LAYOUT.STORE_IMAGE_BORDER_RADIUS,
    borderWidth: 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  brandName: {
    fontSize: STORES_LAYOUT.STORE_BRAND_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 4,
  },
  name: {
    fontSize: STORES_LAYOUT.STORE_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: STORES_LAYOUT.STORE_NAME_MARGIN_BOTTOM,
  },
  distance: {
    fontSize: STORES_LAYOUT.STORE_DISTANCE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});