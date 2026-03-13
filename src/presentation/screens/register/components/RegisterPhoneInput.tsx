import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { REGISTER_PHONE_CONFIG, REGISTER_TEXT } from '../RegisterConstants';
import { REGISTER_LAYOUT } from '../RegisterLayout';
import { RegisterUIService } from '../RegisterService';

interface RegisterPhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  autoFocusDelay?: number;
  isLoading?: boolean;
}

export function RegisterPhoneInput({value, onChangeText, onSubmit, isValid, autoFocusDelay = 0, isLoading = false}: RegisterPhoneInputProps) {
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

  const handleTextChange = (text: string) => {
    const formatted = RegisterUIService.formatPhoneInput(text);
    onChangeText(formatted);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor: BRAND_COLORS.ui.placeholder }]}>
        <View style={[styles.countryCode, { borderRightColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm }]}>
          <Text style={styles.flag}>{REGISTER_PHONE_CONFIG.FLAG_EMOJI}</Text>
          <Text style={[styles.code, { color: BRAND_COLORS.ui.heading }]}>{REGISTER_PHONE_CONFIG.COUNTRY_CODE}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: BRAND_COLORS.ui.heading }]}
          placeholder={REGISTER_TEXT.PHONE_PLACEHOLDER}
          placeholderTextColor="#CCCCCC"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          maxLength={REGISTER_PHONE_CONFIG.MAX_LENGTH}
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
          <ActivityIndicator color={BRAND_COLORS.bta.primaryText} />
        ) : (
          <Text style={[styles.buttonText, { color: BRAND_COLORS.ui.subtitle }, isValid && { color: BRAND_COLORS.bta.primaryText }]}>
            {REGISTER_TEXT.REGISTER_BUTTON}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: REGISTER_LAYOUT.INPUT_GAP,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: REGISTER_LAYOUT.INPUT_BORDER_RADIUS,
    borderWidth: REGISTER_LAYOUT.INPUT_BORDER_WIDTH,
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: REGISTER_LAYOUT.INPUT_PADDING_HORIZONTAL,
    paddingVertical: REGISTER_LAYOUT.INPUT_PADDING_VERTICAL,
    borderRightWidth: 1,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  code: {
    fontSize: REGISTER_LAYOUT.INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  input: {
    flex: 1,
    paddingHorizontal: REGISTER_LAYOUT.INPUT_PADDING_HORIZONTAL,
    paddingVertical: REGISTER_LAYOUT.INPUT_PADDING_VERTICAL,
    fontSize: REGISTER_LAYOUT.INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: REGISTER_LAYOUT.BUTTON_BORDER_RADIUS,
    paddingVertical: REGISTER_LAYOUT.BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: REGISTER_LAYOUT.BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
});