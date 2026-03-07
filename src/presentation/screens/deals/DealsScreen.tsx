import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_MEMBERSHIP_TIERS } from '../../../data/mockMemberships';
import { useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { BenefitsList } from './components/BenefitsList';
import { LoginPromptCard } from './components/LoginPromptCard';
import { MembershipTierList } from './components/MembershipTierList';
import { SelectedTier } from './DealsInterfaces';

export default function DealsScreen() {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [selectedTier, setSelectedTier] = useState<SelectedTier>(null);

  const selectedTierData = selectedTier ? MOCK_MEMBERSHIP_TIERS.find((t) => t.id === selectedTier) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isAuthenticated && <LoginPromptCard />}
        
        <MembershipTierList
          tiers={MOCK_MEMBERSHIP_TIERS}
          selectedTier={selectedTier}
          onTierSelect={setSelectedTier}
        />

        {selectedTierData && <BenefitsList benefits={selectedTierData.benefits} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.fresh,
  },
});