import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { DEALS_TEXT } from '../DealsConstants';
import { MembershipTierData, SelectedTier } from '../DealsInterfaces';
import { DEALS_LAYOUT } from '../DealsLayout';
import { MembershipCard } from './MembershipCard';

interface MembershipTierListProps { tiers: MembershipTierData[]; selectedTier: SelectedTier; onTierSelect: (tier: number) => void; }

export function MembershipTierList({ tiers, selectedTier, onTierSelect, }: MembershipTierListProps) {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={[styles.container, { backgroundColor: BRAND_COLORS.screenBg.fresh }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{DEALS_TEXT.TIER_SECTION_TITLE}</Text>
        <Text style={[styles.subtitle, { color: BRAND_COLORS.ui.subtitle }]}>{DEALS_TEXT.TIER_SECTION_SUBTITLE}</Text>
      </View>
      
      <View style={styles.tiersRow}>
        {tiers.map((tier) => (
          <View key={tier.id} style={styles.tierItem}>
            <MembershipCard
              tier={tier}
              isSelected={selectedTier === tier.id}
              onPress={() => onTierSelect(tier.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: DEALS_LAYOUT.TIER_SECTION_PADDING_TOP,
    paddingBottom: DEALS_LAYOUT.TIER_SECTION_PADDING_BOTTOM,
  },
  header: {
    paddingHorizontal: DEALS_LAYOUT.TIER_SECTION_PADDING_HORIZONTAL,
    marginBottom: DEALS_LAYOUT.TIER_SUBTITLE_MARGIN_BOTTOM,
  },
  title: {
    fontSize: DEALS_LAYOUT.TIER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: DEALS_LAYOUT.TIER_TITLE_MARGIN_BOTTOM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: DEALS_LAYOUT.TIER_SUBTITLE_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
  tiersRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: DEALS_LAYOUT.TIER_SECTION_PADDING_HORIZONTAL,
  },
  tierItem: {
    alignItems: 'center',
  },
  tierName: {
    fontSize: DEALS_LAYOUT.TIER_NAME_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginTop: DEALS_LAYOUT.TIER_NAME_MARGIN_TOP,
  },
});