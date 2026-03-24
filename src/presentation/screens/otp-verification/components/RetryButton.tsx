import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { OTP_LAYOUT } from '../OtpVerificationLayout';

interface RetryButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function RetryButton({ onPress, disabled = false }: RetryButtonProps) {
  const BRAND_COLORS = useBrandColors();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: BRAND_COLORS.primary.p1 }, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>🔄</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: OTP_LAYOUT.RETRY_BUTTON_SIZE,
    height: OTP_LAYOUT.RETRY_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: OTP_LAYOUT.RETRY_BUTTON_SIZE / 2,
    marginLeft: OTP_LAYOUT.RETRY_BUTTON_MARGIN_LEFT,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  icon: {
    fontSize: 16,
  },
});