import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { HOME_TEXT } from '../HomeConstants';
import { Collection } from '../HomeInterfaces';
import { HOME_LAYOUT } from '../HomeLayout';
import { CollectionCard } from './CollectionCard';

interface CollectionSectionProps {
  collections: Collection[];
  onCollectionPress: (collection: Collection) => void;
}

export function CollectionSection({ collections, onCollectionPress }: CollectionSectionProps) {

  const BRAND_COLORS = useBrandColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>{HOME_TEXT.COLLECTION_SECTION.TITLE}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={HOME_LAYOUT.COLLECTION_CARD_WIDTH + HOME_LAYOUT.COLLECTION_SCROLL_GAP}
      >
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onPress={() => onCollectionPress(collection)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM,
  },
  sectionTitle: {
    fontSize: HOME_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
    paddingHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
  },
  scrollContent: {
    paddingHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.COLLECTION_SCROLL_GAP,
  },
});