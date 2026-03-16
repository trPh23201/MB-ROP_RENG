import { IS_IOS } from '@/src/utils/platform';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { AppIcon } from '../shared/AppIcon';
import { ENTRY_LAYOUT } from './EntryLayout';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface EntryCategoryScrollProps {
  categories: CategoryItem[];
  selectedId?: string | null;
  onCategoryPress?: (categoryId: string) => void;
  layout?: 'single-row' | 'grid';
}

export function EntryCategoryScroll({categories, selectedId, onCategoryPress, layout = 'single-row'}: EntryCategoryScrollProps) {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();

  const handlePress = (categoryId: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryId);
    } else {
      router.push({
        pathname: '../(tabs)/search',
        params: { categoryId },
      });
    }
  };

  const chunkedCategories = useMemo(() => {
    if (layout !== 'grid') return null;
    const chunkSize = 2;
    const chunks: CategoryItem[][] = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks;
  }, [categories, layout]);

  if (categories.length === 0) {
    return null;
  }

  if (layout === 'grid' && chunkedCategories) {
    return (
      <View style={styles.gridContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.gridScrollContent}
          overScrollMode="never"
          decelerationRate={IS_IOS ? 'fast' : 0.9}
        >
          {chunkedCategories.map((chunk, chunkIndex) => (
            <View key={`chunk-${chunkIndex}`} style={styles.column}>
              {chunk.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handlePress(category.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
                    <AppIcon name={category.icon as any} size="lg" color={BRAND_COLORS.primary.p3} />
                  </View>
                  <Text style={[styles.label, { color: BRAND_COLORS.secondary.s3 }]} numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category) => {
        const isSelected = selectedId === category.id;

        return (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handlePress(category.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: BRAND_COLORS.primary.p2 },
                isSelected && [styles.iconContainerSelected, { backgroundColor: BRAND_COLORS.primary.p3 }],
              ]}
            >
              <AppIcon
                name={category.icon as any}
                size="lg"
                style={isSelected ? [styles.iconSelected, { color: BRAND_COLORS.primary.p1 }] : undefined}
              />
            </View>
            <Text
              style={[styles.label, { color: BRAND_COLORS.secondary.s3 }, isSelected && styles.labelSelected]}
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 16,
    gap: ENTRY_LAYOUT.CATEGORY_SCROLL_GAP,
  },
  gridContainer: {
    marginBottom: ENTRY_LAYOUT.CATEGORY_SECTION_MARGIN_BOTTOM,
  },
  gridScrollContent: {
    paddingHorizontal: ENTRY_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: ENTRY_LAYOUT.CATEGORY_SCROLL_GAP,
  },
  column: {
    gap: ENTRY_LAYOUT.CATEGORY_SCROLL_GAP,
  },
  categoryItem: {
    alignItems: 'center',
    width: ENTRY_LAYOUT.CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: ENTRY_LAYOUT.CATEGORY_ICON_SIZE,
    height: ENTRY_LAYOUT.CATEGORY_ICON_SIZE,
    borderRadius: ENTRY_LAYOUT.CATEGORY_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ENTRY_LAYOUT.CATEGORY_ICON_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainerSelected: {
  },
  iconSelected: {
  },
  label: {
    fontSize: ENTRY_LAYOUT.CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
  labelSelected: {
    fontFamily: 'SpaceGrotesk-Bold',
  },
});
