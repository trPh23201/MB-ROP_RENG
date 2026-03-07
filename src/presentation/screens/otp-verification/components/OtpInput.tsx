import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TextInputKeyPressEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { BRAND_COLORS } from '../../../theme/colors';
import { OTP_CONFIG } from '../OtpVerificationConstants';
import { OTP_LAYOUT } from '../OtpVerificationLayout';
import { OtpVerificationService } from '../OtpVerificationService';

interface OtpInputProps {
  digits: string[];
  onDigitsChange: (digits: string[]) => void;
  onComplete: (code: string) => void;
  shakeAnimatedStyle: any;
  disabled?: boolean;
}

export function OtpInput({ digits, onDigitsChange, onComplete, shakeAnimatedStyle, disabled = false }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, OTP_LAYOUT.CONTENT_PADDING_TOP);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return;

    const digit = text.slice(-1);
    
    if (digit && !OtpVerificationService.isValidDigit(digit)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = digit;
    onDigitsChange(newDigits);

    if (digit && index < OTP_CONFIG.CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (OtpVerificationService.isOtpComplete(newDigits)) {
      onComplete(newDigits.join(''));
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (disabled) return;

    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Animated.View style={[styles.container, shakeAnimatedStyle]}>
      {Array.from({ length: OTP_CONFIG.CODE_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            digits[index] && styles.inputFilled,
            disabled && styles.inputDisabled,
          ]}
          value={digits[index] || ''}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          editable={!disabled}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: OTP_LAYOUT.OTP_BOX_GAP,
  },
  input: {
    width: OTP_LAYOUT.OTP_BOX_SIZE,
    height: OTP_LAYOUT.OTP_BOX_SIZE,
    borderWidth: OTP_LAYOUT.OTP_BOX_BORDER_WIDTH,
    borderColor: BRAND_COLORS.secondary.nauCaramel,
    borderRadius: OTP_LAYOUT.OTP_BOX_BORDER_RADIUS,
    backgroundColor: BRAND_COLORS.primary.beSua,
    fontSize: OTP_LAYOUT.OTP_BOX_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
  inputFilled: {
    borderColor: BRAND_COLORS.secondary.nauEspresso,
    backgroundColor: BRAND_COLORS.primary.beSua,
  },
  inputDisabled: {
    opacity: 0.5,
  },
});