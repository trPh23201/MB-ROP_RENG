import { TYPOGRAPHY } from '@/src/presentation/theme/typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../WelcomeConstants';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

export function LoginCard() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('../(auth)/login');
  };

  const handleLoyaltyPress = () => {
    console.log('Clicked: Rốp Rẻng Loyalty');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{WELCOME_TEXT.LOGIN_CARD.TITLE}</Text>
      <Text style={styles.subtitle}>{WELCOME_TEXT.LOGIN_CARD.SUBTITLE}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>{WELCOME_TEXT.LOGIN_CARD.TITLE}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loyaltyRow} onPress={handleLoyaltyPress}>
        <Text style={styles.loyaltyText}>{WELCOME_TEXT.LOGIN_CARD.LOYALTY_TITLE}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND_COLORS.primary.beSua,
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
    color: BRAND_COLORS.secondary.reuDam,
    marginBottom: WELCOME_LAYOUT.LOGIN_TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: WELCOME_LAYOUT.LOGIN_SUBTITLE_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.secondary.nauEspresso,
    lineHeight: WELCOME_LAYOUT.LOGIN_SUBTITLE_LINE_HEIGHT,
    marginBottom: WELCOME_LAYOUT.LOGIN_SUBTITLE_MARGIN_BOTTOM,
  },
  button: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: WELCOME_LAYOUT.LOGIN_BUTTON_BORDER_RADIUS,
    paddingVertical: WELCOME_LAYOUT.LOGIN_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
    marginBottom: WELCOME_LAYOUT.LOGIN_BUTTON_MARGIN_BOTTOM,
  },
  buttonText: {
    fontSize: WELCOME_LAYOUT.LOGIN_BUTTON_TEXT_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    color: BRAND_COLORS.primary.beSua,
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
    color: BRAND_COLORS.primary.xanhReu,
  },
  arrow: {
    fontSize: WELCOME_LAYOUT.LOGIN_BUTTON_ARROW_SIZE,
    color: BRAND_COLORS.primary.xanhReu,
  },
});