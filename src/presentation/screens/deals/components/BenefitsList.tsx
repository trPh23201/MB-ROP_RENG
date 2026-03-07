import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { MembershipBenefit } from '../DealsInterfaces';
import { DEALS_LAYOUT } from '../DealsLayout';

interface BenefitsListProps {
  benefits: MembershipBenefit[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  if (benefits.length === 0) return null;

  return (
    <View style={styles.container}>
      {benefits.map((benefit, index) => (
        <View key={benefit.id}>
          <View style={styles.benefitItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{benefit.icon}</Text>
            </View>
            <Text style={styles.description}>{benefit.description}</Text>
          </View>
          {index < benefits.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DEALS_LAYOUT.BENEFITS_PADDING_HORIZONTAL,
    marginHorizontal: 16,
    backgroundColor: BRAND_COLORS.screenBg.warm,
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
    backgroundColor: BRAND_COLORS.ui.iconFill,
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
    color: BRAND_COLORS.ui.subtitle,
    lineHeight: 24,
  },
  divider: {
    height: DEALS_LAYOUT.BENEFIT_BORDER_WIDTH,
    backgroundColor: BRAND_COLORS.ui.placeholder,
    marginHorizontal: DEALS_LAYOUT.BENEFIT_ICON_SIZE + DEALS_LAYOUT.BENEFIT_GAP,
  },
});