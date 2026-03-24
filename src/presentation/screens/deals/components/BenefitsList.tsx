import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { MembershipBenefit } from '../DealsInterfaces';
import { DEALS_LAYOUT } from '../DealsLayout';

interface BenefitsListProps {
  benefits: MembershipBenefit[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  const BRAND_COLORS = useBrandColors();
  if (benefits.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
      {benefits.map((benefit, index) => (
        <View key={benefit.id}>
          <View style={styles.benefitItem}>
            <View style={[styles.iconContainer, { backgroundColor: BRAND_COLORS.ui.iconFill }]}>
              <Text style={styles.icon}>{benefit.icon}</Text>
            </View>
            <Text style={[styles.description, { color: BRAND_COLORS.ui.subtitle }]}>{benefit.description}</Text>
          </View>
          {index < benefits.length - 1 && <View style={[styles.divider, { backgroundColor: BRAND_COLORS.ui.placeholder }]} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DEALS_LAYOUT.BENEFITS_PADDING_HORIZONTAL,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DEALS_LAYOUT.BENEFIT_ITEM_PADDING_VERTICAL,
    gap: DEALS_LAYOUT.BENEFIT_GAP,
  },
  iconContainer: {
    width: DEALS_LAYOUT.BENEFIT_ICON_SIZE,
    height: DEALS_LAYOUT.BENEFIT_ICON_SIZE,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  description: {
    flex: 1,
    fontSize: DEALS_LAYOUT.BENEFIT_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    lineHeight: 24,
  },
  divider: {
    height: DEALS_LAYOUT.BENEFIT_BORDER_WIDTH,
    marginHorizontal: DEALS_LAYOUT.BENEFIT_ICON_SIZE + DEALS_LAYOUT.BENEFIT_GAP,
  },
});