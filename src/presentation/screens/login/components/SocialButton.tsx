import { SOCIAL_ICONS } from '@/src/presentation/theme/iconConstants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { LoginProvider } from '../LoginEnums';
import { LOGIN_LAYOUT } from '../LoginLayout';

interface SocialButtonProps {
  provider: LoginProvider;
  label: string;
  onPress: () => void;
}

export function SocialButton({ provider, label, onPress }: SocialButtonProps) {
  const BRAND_COLORS = useBrandColors();
  const isFacebook = provider === LoginProvider.FACEBOOK;

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: BRAND_COLORS.ui.placeholder }, isFacebook && { backgroundColor: BRAND_COLORS.bta.primaryBg, borderColor: BRAND_COLORS.bta.primaryBg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isFacebook ? (
        <AppIcon name={SOCIAL_ICONS.FACEBOOK} size="lg" style={[styles.facebookIcon, { color: BRAND_COLORS.bta.primaryText }]} />
      ) : (
        <AppIcon name={SOCIAL_ICONS.GOOGLE} size="lg" style={styles.googleIcon} />
      )}
      <Text style={[styles.label, { color: BRAND_COLORS.ui.heading }, isFacebook && { color: BRAND_COLORS.bta.primaryText }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: LOGIN_LAYOUT.INPUT_BORDER_WIDTH,
    borderRadius: LOGIN_LAYOUT.BUTTON_BORDER_RADIUS,
    paddingVertical: LOGIN_LAYOUT.INPUT_PADDING_VERTICAL,
    marginBottom: LOGIN_LAYOUT.SOCIAL_BUTTON_MARGIN_BOTTOM,
    gap: LOGIN_LAYOUT.SOCIAL_BUTTON_GAP,
  },
  facebookIcon: {
    fontSize: LOGIN_LAYOUT.SOCIAL_ICON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  googleIcon: {
    fontSize: LOGIN_LAYOUT.SOCIAL_ICON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    // color: '#f44242ff',
  },
  label: {
    fontSize: LOGIN_LAYOUT.BUTTON_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});