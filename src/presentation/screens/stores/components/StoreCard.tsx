import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { STORES_TEXT } from '../StoresConstants';
import { StoreCardProps } from '../StoresInterfaces';
import { STORES_LAYOUT } from '../StoresLayout';
import { StoresUIService } from '../StoresService';

export function StoreCard({ store, onPress }: StoreCardProps) {
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
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <Image source={store.imageUrl} style={styles.image} contentFit="cover" cachePolicy="disk" />
      <View style={styles.info}>
        <Text style={styles.brandName}>{store.brandName}</Text>
        <Text style={styles.name}>{store.name}</Text>
        <Text style={styles.distance}>
          {STORES_TEXT.DISTANCE_PREFIX} {StoresUIService.formatDistance(store.distanceKm)} {STORES_TEXT.DISTANCE_SUFFIX}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: STORES_LAYOUT.STORE_CARD_BORDER_RADIUS,
    padding: STORES_LAYOUT.STORE_CARD_PADDING,
    marginBottom: STORES_LAYOUT.STORE_CARD_MARGIN_BOTTOM,
    gap: STORES_LAYOUT.STORE_CARD_GAP,
    borderWidth: 0,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.secondary.nauEspresso,
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
    backgroundColor: BRAND_COLORS.primary.xanhBo,
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
    color: BRAND_COLORS.secondary.hongSua,
    marginBottom: 4,
  },
  name: {
    fontSize: STORES_LAYOUT.STORE_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.reuDam,
    marginBottom: STORES_LAYOUT.STORE_NAME_MARGIN_BOTTOM,
  },
  distance: {
    fontSize: STORES_LAYOUT.STORE_DISTANCE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
  },
});