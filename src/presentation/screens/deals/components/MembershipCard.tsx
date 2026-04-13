// src/presentation/screens/deals/components/MembershipCard.tsx
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { MembershipTierData } from '../DealsInterfaces';
import { DEALS_LAYOUT } from '../DealsLayout';

interface MembershipCardProps {
  tier: MembershipTierData;
  isSelected: boolean;
  onPress: () => void;
}

export function MembershipCard({ tier, isSelected, onPress }: MembershipCardProps) {
  const BRAND_COLORS = useBrandColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          isSelected && [styles.containerSelected, { backgroundColor: BRAND_COLORS.screenBg.warm }],
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: tier.color },
          ]}
        >
          {/* <View style={styles.logoContainer}>
            <Text style={styles.logoText}>{DEALS_TEXT.TIER_LOGO}</Text>
          </View> */}
        </View>
        
        <Text style={[styles.tierName, { color: BRAND_COLORS.ui.heading }]}>{tier.tier_name}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    borderRadius: DEALS_LAYOUT.TIER_CARD_BORDER_RADIUS,
    paddingVertical: DEALS_LAYOUT.TIER_CONTAINER_PADDING_VERTICAL,
    paddingHorizontal: DEALS_LAYOUT.TIER_CONTAINER_PADDING_HORIZONTAL,
  },
  containerSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    width: DEALS_LAYOUT.TIER_CARD_WIDTH,
    height: DEALS_LAYOUT.TIER_CARD_HEIGHT,
    borderRadius: DEALS_LAYOUT.TIER_CARD_BORDER_RADIUS,
    padding: 8,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logoText: {
    fontSize: DEALS_LAYOUT.TIER_LOGO_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  tierName: {
    fontSize: DEALS_LAYOUT.TIER_NAME_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginTop: DEALS_LAYOUT.TIER_NAME_MARGIN_TOP,
    paddingBottom: DEALS_LAYOUT.TIER_NAME_MARGIN_BOTTOM,
    textAlign: 'center',
  },
});