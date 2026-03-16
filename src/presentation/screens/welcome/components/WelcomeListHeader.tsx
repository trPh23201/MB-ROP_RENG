import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryItem, EntryBrandSelector, EntryCategoryScroll, EntryPromoBanner, EntryQuickActions, EntrySearchBar } from '../../../components/entry';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { LoginCard } from './LoginCard';
import { WELCOME_TEXT } from '../WelcomeConstants';

export interface WelcomeListHeaderProps {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  handleCategoryPress: (categoryId: string) => void;
  handleQuickActionPress: (actionId: string, label: string) => void;
  handleBannerPress: (promoId: string) => void;
}

export function WelcomeListHeader({categories, selectedCategoryId, handleCategoryPress, handleQuickActionPress, handleBannerPress}: WelcomeListHeaderProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>{WELCOME_TEXT.BRAND_SECTION.TITLE}</Text>
        <EntryBrandSelector />
      </View>
      <View style={styles.section}>
        <LoginCard />
      </View>
      <View style={styles.section}>
        <EntryQuickActions onActionPress={handleQuickActionPress} />
      </View>
      <View style={styles.section}>
        <EntryPromoBanner onBannerPress={handleBannerPress} autoScroll />
      </View>
      <View style={styles.section}>
        <EntrySearchBar />
      </View>
      {categories.length > 0 && (
        <View style={styles.section}>
          <EntryCategoryScroll
            categories={categories}
            selectedId={selectedCategoryId}
            onCategoryPress={handleCategoryPress}
          />
        </View>
      )}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: BRAND_COLORS.primary.p3 }]}>
          {selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId)?.name || 'Sản phẩm' : 'Tất cả sản phẩm'}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    marginBottom: 16,
  },
});
