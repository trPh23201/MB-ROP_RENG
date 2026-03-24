import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { LOGIN_PHONE_CONFIG, LOGIN_TEXT } from '../LoginConstants';
import { LOGIN_LAYOUT } from '../LoginLayout';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  autoFocusDelay?: number;
  isLoading?: boolean;
}

export function PhoneInput({ value, onChangeText, onSubmit, isValid, autoFocusDelay = 0, isLoading = false }: PhoneInputProps) {
  const BRAND_COLORS = useBrandColors();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocusDelay > 0) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, autoFocusDelay);
      return () => clearTimeout(timer);
    }
  }, [autoFocusDelay]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>{LOGIN_PHONE_CONFIG.FLAG_EMOJI}</Text>
          <Text style={[styles.code, { color: BRAND_COLORS.ui.heading }]}>{LOGIN_PHONE_CONFIG.COUNTRY_CODE}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: BRAND_COLORS.ui.heading }]}
          placeholder={LOGIN_TEXT.PHONE_PLACEHOLDER}
          placeholderTextColor="#CCCCCC"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          maxLength={LOGIN_PHONE_CONFIG.MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isValid && !isLoading && { backgroundColor: BRAND_COLORS.bta.primaryBg }]}
        onPress={onSubmit}
        disabled={!isValid || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={BRAND_COLORS.background.default} />
        ) : (
          <Text style={[styles.buttonText, { color: BRAND_COLORS.ui.subtitle }, isValid && { color: BRAND_COLORS.bta.primaryText }]}>
            {LOGIN_TEXT.LOGIN_BUTTON}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: LOGIN_LAYOUT.INPUT_BUTTON_GAP,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: LOGIN_LAYOUT.INPUT_BORDER_WIDTH,
    borderColor: '#807878ff',
    borderRadius: LOGIN_LAYOUT.INPUT_BORDER_RADIUS,
    paddingHorizontal: LOGIN_LAYOUT.INPUT_PADDING_HORIZONTAL,
    paddingVertical: LOGIN_LAYOUT.INPUT_PADDING_VERTICAL,
    gap: LOGIN_LAYOUT.INPUT_GAP,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 14,
  },
  code: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: LOGIN_LAYOUT.BUTTON_BORDER_RADIUS,
    paddingVertical: LOGIN_LAYOUT.BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Phudu-Bold',
  },
});