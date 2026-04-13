import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchLoyaltyTiers } from '../../../state/slices/loyaltySlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { useBrandColors } from '../../theme/BrandColorContext';
import { BenefitsList } from './components/BenefitsList';
import { LoginPromptCard } from './components/LoginPromptCard';
import { MembershipTierList } from './components/MembershipTierList';
import { SelectedTier } from './DealsInterfaces';

export default function DealsScreen() {
  const BRAND_COLORS = useBrandColors();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(fetchLoyaltyTiers());
    }, [dispatch]);
  
  const [selectedTier, setSelectedTier] = useState<SelectedTier>(null);
  const tiers = useAppSelector((state) => state.loyalty.tiers);
  console.log("tiers: ", tiers);

  const selectedTierData = selectedTier ? tiers.find((t: any) => t.id === selectedTier) : null;

  return (
    <View style={[styles.container, { backgroundColor: BRAND_COLORS.screenBg.fresh }, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isAuthenticated && <LoginPromptCard />}
        
        <MembershipTierList
          tiers={tiers}
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
  },
});