import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { DEALS_TEXT } from '../DealsConstants';
import { DEALS_LAYOUT } from '../DealsLayout';

export function LoginPromptCard() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('../(auth)/login');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{DEALS_TEXT.LOGIN_PROMPT}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{DEALS_TEXT.LOGIN_BUTTON}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: DEALS_LAYOUT.LOGIN_CARD_MARGIN_HORIZONTAL,
    marginTop: DEALS_LAYOUT.LOGIN_CARD_MARGIN_TOP,
    marginBottom: DEALS_LAYOUT.LOGIN_CARD_MARGIN_BOTTOM,
    backgroundColor: BRAND_COLORS.bta.primaryBg,
    borderRadius: DEALS_LAYOUT.LOGIN_CARD_BORDER_RADIUS,
    padding: DEALS_LAYOUT.LOGIN_CARD_PADDING,
    minHeight: DEALS_LAYOUT.LOGIN_CARD_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    fontSize: DEALS_LAYOUT.LOGIN_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.bta.primaryText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: DEALS_LAYOUT.LOGIN_BUTTON_BORDER_RADIUS,
    paddingVertical: DEALS_LAYOUT.LOGIN_BUTTON_PADDING_VERTICAL,
    paddingHorizontal: 48,
  },
  buttonText: {
    fontSize: DEALS_LAYOUT.LOGIN_BUTTON_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.bta.primaryText,
  },
});