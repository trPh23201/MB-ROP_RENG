import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IS_IOS } from '../../../../utils/platform';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { CategoryItem } from '../../welcome/components/CategoryScroll';
import { HOME_LAYOUT } from '../HomeLayout';

interface HomeCategoryScrollProps {
  categories: CategoryItem[];
}

export function HomeCategoryScroll({ categories }: HomeCategoryScrollProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    console.log(`[HomeCategoryScroll] Selected category: ${categoryName} (${categoryId})`);
    router.push({
      pathname: '../(tabs)/search',
      params: { categoryId },
    });
  };

  const chunkedCategories = useMemo(() => {
    const chunkSize = 2;
    const chunks: CategoryItem[][] = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks;
  }, [categories]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.gridContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        decelerationRate={IS_IOS ? 'fast' : 0.9}
      >
        {chunkedCategories.map((chunk, chunkIndex) => (
          <View key={`chunk-${chunkIndex}`} style={styles.column}>
            {chunk.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.id, category.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <AppIcon name={category.icon as any} size="lg" />
                </View>
                <Text style={styles.label} numberOfLines={2}>
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

const styles = StyleSheet.create({
  gridContainer: {
    marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM,
  },
  scrollContent: {
    paddingHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.HOME_CATEGORY_SCROLL_GAP,
  },
  column: {
    gap: HOME_LAYOUT.HOME_CATEGORY_SCROLL_GAP,
  },
  categoryItem: {
    alignItems: 'center',
    width: HOME_LAYOUT.HOME_CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: HOME_LAYOUT.HOME_CATEGORY_ICON_SIZE,
    height: HOME_LAYOUT.HOME_CATEGORY_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_CATEGORY_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: HOME_LAYOUT.HOME_CATEGORY_ICON_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: HOME_LAYOUT.HOME_CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
  },
});