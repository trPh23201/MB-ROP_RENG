import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { Topping } from '../OrderInterfaces';
import { EDIT_PRODUCT_TEXT } from '../OrderConstants';

interface ToppingSelectorButtonProps {
  selectedToppings: Topping[];
  onPress: () => void;
}

export const ToppingSelectorButton = React.memo(function ToppingSelectorButton({
  selectedToppings,
  onPress,
}: ToppingSelectorButtonProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <TouchableOpacity
      style={[styles.toppingSection, { borderColor: BRAND_COLORS.secondary.s3 }]}
      onPress={onPress}
    >
      <View style={[styles.toppingIcon, { backgroundColor: `${BRAND_COLORS.secondary.s3}18` }]}>
        <Ionicons name="cafe" size={24} color={BRAND_COLORS.secondary.s3} />
      </View>
      <View style={styles.toppingContent}>
        <Text style={[styles.toppingTitle, { color: BRAND_COLORS.ui.heading }]}>{EDIT_PRODUCT_TEXT.TOPPING_LABEL}</Text>
        <Text style={[styles.toppingHint, { color: BRAND_COLORS.ui.subtitle }]}>
          {selectedToppings.length > 0 ? selectedToppings.map(t => t.name).join(', ') : EDIT_PRODUCT_TEXT.TOPPING_HINT}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.secondary.s3} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  toppingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  toppingIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  toppingContent: { flex: 1 },
  toppingTitle: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.bodyBold, marginBottom: 4 },
  toppingHint: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: TYPOGRAPHY.fontFamily.bodyRegular },
});
