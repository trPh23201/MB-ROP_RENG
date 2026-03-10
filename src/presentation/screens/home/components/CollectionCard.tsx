import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { Collection } from '../HomeInterfaces';
import { HOME_LAYOUT } from '../HomeLayout';

interface CollectionCardProps {
  collection: Collection;
  onPress: () => void;
}

export function CollectionCard({ collection, onPress }: CollectionCardProps) {
  const guardedPress = useAuthGuard(
    onPress,
    'VIEW_COLLECTION',
    () => ({
      collectionId: collection.id,
      returnTo: '/(tabs)',
    })
  );

  return (
    <TouchableOpacity style={styles.card} onPress={guardedPress} activeOpacity={0.8}>
      <Image source={collection.bannerImage} style={styles.image} contentFit="cover" cachePolicy="disk" />
      <View style={styles.overlay}>
        <Text style={styles.title}>{collection.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {collection.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: HOME_LAYOUT.COLLECTION_CARD_WIDTH,
    height: HOME_LAYOUT.COLLECTION_CARD_HEIGHT,
    borderRadius: HOME_LAYOUT.COLLECTION_CARD_BORDER_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
  },
  title: {
    fontSize: HOME_LAYOUT.COLLECTION_TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
    marginBottom: 4,
  },
  description: {
    fontSize: HOME_LAYOUT.COLLECTION_DESC_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.background.default,
  },
});