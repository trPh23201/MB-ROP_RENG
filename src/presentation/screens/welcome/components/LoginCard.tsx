import { TYPOGRAPHY } from '@/src/presentation/theme/typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { WELCOME_TEXT } from '../WelcomeConstants';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

export function LoginCard() {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('../(auth)/login');
  };

  const handleLoyaltyPress = () => {
    console.log('Clicked: Rốp Rẻng Loyalty');
  };

  return (
    <View style={[styles.card, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
      <Text style={[styles.title, { color: BRAND_COLORS.secondary.s5 }]}>{WELCOME_TEXT.LOGIN_CARD.TITLE}</Text>
      <Text style={[styles.subtitle, { color: BRAND_COLORS.secondary.s3 }]}>{WELCOME_TEXT.LOGIN_CARD.SUBTITLE}</Text>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={handleLoginPress}>
        <Text style={[styles.buttonText, { color: BRAND_COLORS.primary.p1 }]}>{WELCOME_TEXT.LOGIN_CARD.TITLE}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loyaltyRow} onPress={handleLoyaltyPress}>
        <Text style={[styles.loyaltyText, { color: BRAND_COLORS.primary.p3 }]}>{WELCOME_TEXT.LOGIN_CARD.LOYALTY_TITLE}</Text>
        <Text style={[styles.arrow, { color: BRAND_COLORS.primary.p3 }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: WELCOME_LAYOUT.CARD_BORDER_RADIUS,
    marginTop: WELCOME_LAYOUT.CARD_MARGIN_TOP,
    padding: WELCOME_LAYOUT.CARD_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: WELCOME_LAYOUT.CARD_SHADOW_OFFSET_WIDTH, height: WELCOME_LAYOUT.CARD_SHADOW_OFFSET_HEIGHT },
    shadowOpacity: WELCOME_LAYOUT.CARD_SHADOW_OPACITY,
    shadowRadius: WELCOME_LAYOUT.CARD_SHADOW_RADIUS,
    elevation: WELCOME_LAYOUT.CARD_ELEVATION,
  },
  title: {
    fontSize: WELCOME_LAYOUT.LOGIN_TITLE_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    marginBottom: WELCOME_LAYOUT.LOGIN_TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: WELCOME_LAYOUT.LOGIN_SUBTITLE_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    lineHeight: WELCOME_LAYOUT.LOGIN_SUBTITLE_LINE_HEIGHT,
    marginBottom: WELCOME_LAYOUT.LOGIN_SUBTITLE_MARGIN_BOTTOM,
  },
  button: {
    borderRadius: WELCOME_LAYOUT.LOGIN_BUTTON_BORDER_RADIUS,
    paddingVertical: WELCOME_LAYOUT.LOGIN_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
    marginBottom: WELCOME_LAYOUT.LOGIN_BUTTON_MARGIN_BOTTOM,
  },
  buttonText: {
    fontSize: WELCOME_LAYOUT.LOGIN_BUTTON_TEXT_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
  },
  loyaltyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: WELCOME_LAYOUT.LOYALTY_TEXT_PADDING_VERTICAL,
  },
  loyaltyText: {
    fontSize: WELCOME_LAYOUT.LOYALTY_TEXT_FONT_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
  arrow: {
    fontSize: WELCOME_LAYOUT.LOGIN_BUTTON_ARROW_SIZE,
  },
});