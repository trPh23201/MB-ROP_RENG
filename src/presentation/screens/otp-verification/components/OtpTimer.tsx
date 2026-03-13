import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { OTP_TEXT } from '../OtpVerificationConstants';
import { OTP_LAYOUT } from '../OtpVerificationLayout';
import { OtpVerificationService } from '../OtpVerificationService';

interface OtpTimerProps {
  timeRemaining: number;
  onResend: () => void;
  canClickResend: boolean;
}

export function OtpTimer({ timeRemaining, onResend, canClickResend }: OtpTimerProps) {
  const BRAND_COLORS = useBrandColors();
  const formattedTime = OtpVerificationService.formatTimeRemaining(timeRemaining);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: BRAND_COLORS.primary.p3 }]}>
        {OTP_TEXT.RESEND_PROMPT}{' '}
        <Text
          style={[styles.link, { color: BRAND_COLORS.secondary.s3 }, !canClickResend && styles.linkDisabled]}
          onPress={canClickResend ? onResend : undefined}
        >
          {OTP_TEXT.RESEND_BUTTON}
        </Text>
        {' '}
        <Text style={[styles.timer, { color: BRAND_COLORS.secondary.s3 }]}>({formattedTime})</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: OTP_LAYOUT.TIMER_MARGIN_TOP,
    alignItems: 'center',
  },
  text: {
    fontSize: OTP_LAYOUT.TIMER_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    lineHeight: OTP_LAYOUT.TIMER_LINE_HEIGHT,
  },
  link: {
    fontFamily: 'SpaceGrotesk-Bold',
  },
  linkDisabled: {
    color: '#CCCCCC',
  },
  timer: {
  },
});