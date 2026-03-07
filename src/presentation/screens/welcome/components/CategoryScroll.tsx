import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface CategoryScrollProps {
  categories: CategoryItem[];
  selectedId?: string | null;
  onCategoryPress?: (categoryId: string) => void;
}

export function CategoryScroll({
  categories,
  selectedId,
  onCategoryPress,
}: CategoryScrollProps) {
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

  if (categories.length === 0) {
    return null;
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
                isSelected && styles.iconContainerSelected,
              ]}
            >
              <AppIcon
                name={category.icon as any}
                size="lg"
                style={isSelected ? styles.iconSelected : undefined}
              />
            </View>
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
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
    gap: WELCOME_LAYOUT.CATEGORY_SCROLL_GAP,
  },
  categoryItem: {
    alignItems: 'center',
    width: WELCOME_LAYOUT.CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: WELCOME_LAYOUT.CATEGORY_ICON_SIZE,
    height: WELCOME_LAYOUT.CATEGORY_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.xanhBo,
    borderRadius: WELCOME_LAYOUT.CATEGORY_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: WELCOME_LAYOUT.CATEGORY_ICON_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainerSelected: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
  },
  iconSelected: {
    color: BRAND_COLORS.primary.beSua,
  },
  label: {
    fontSize: WELCOME_LAYOUT.CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
  },
  labelSelected: {
    fontFamily: 'SpaceGrotesk-Bold',
  },
});