import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../../welcome/WelcomeConstants';
import { HOME_LAYOUT } from '../HomeLayout';

export function HomeBrandSelector() {
  const handleBrandPress = useAuthGuard(
    (brandId: string, brandName: string) => {
      console.log(`Clicked: ${brandName} (${brandId})`);
      // TODO: Switch brand context
    },
    'BROWSE_CATEGORY',
    (brandId: string) => ({ categoryId: brandId, returnTo: '/welcome' })
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {WELCOME_TEXT.BRAND_SECTION.BRANDS.map((brand) => (
          <TouchableOpacity key={brand.id} style={styles.brandCard} onPress={() => handleBrandPress(brand.id, brand.name)}>
            <View style={styles.brandPlaceholder}>
              <Text style={styles.brandPlaceholderText}>{brand.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    height: HOME_LAYOUT.HOME_BRAND_CARD_SIZE,
    marginBottom: HOME_LAYOUT.HOME_BRAND_CARD_MARGIN_BOTTOM,
    marginLeft: HOME_LAYOUT.HOME_BRAND_CARD_MARGIN_LEFT,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: HOME_LAYOUT.HOME_BRAND_CARD_BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  brandPlaceholder: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_BRAND_CARD_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    padding: HOME_LAYOUT.HOME_BRAND_CARD_PADDING,
  },
  brandPlaceholderText: {
    fontSize: HOME_LAYOUT.HOME_BRAND_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
  },
});