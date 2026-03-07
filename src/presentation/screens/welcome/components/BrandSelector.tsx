import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthGuard } from '../../../../utils/hooks/useAuthGuard';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../WelcomeConstants';

export function BrandSelector() {
  const handleBrandPress = useAuthGuard(
    (brandId: string, brandName: string) => {
      console.log(`Clicked: ${brandName} (${brandId})`);
      // TODO: Switch brand context
    }
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {WELCOME_TEXT.BRAND_SECTION.BRANDS.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandCard}
            onPress={() => handleBrandPress(brand.id, brand.name)}
          >
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
    paddingRight: 16,
    gap: 12,
  },
  brandCard: {
    width: 80,
    height: 80,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  brandPlaceholder: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  brandPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.nauEspresso,
    textAlign: 'center',
  },
});