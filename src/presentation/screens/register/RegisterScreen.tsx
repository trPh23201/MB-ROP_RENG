import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearError, loginWithOtp, registerUser } from '../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { IS_IOS } from '../../../utils/platform';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpVerificationBottomSheet, OtpVerificationRef } from '../otp-verification/OtpVerificationBottomSheet';
import { RegisterPhoneInput } from './components/RegisterPhoneInput';
import { REGISTER_TEXT } from './RegisterConstants';
import { REGISTER_LAYOUT } from './RegisterLayout';
import { RegisterUIService } from './RegisterService';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, otpSent, otpPhone } = useAppSelector(
    (state) => state.auth
  );

  const [phoneNumber, setPhoneNumber] = useState('');
  const otpModalRef = useRef<OtpVerificationRef>(null);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    if (error) {
      if (RegisterUIService.isPhoneExistedError(error)) {
        Alert.alert(
          REGISTER_TEXT.PHONE_EXISTED_TITLE,
          REGISTER_TEXT.PHONE_EXISTED_MESSAGE,
          [
            {
              text: REGISTER_TEXT.PHONE_EXISTED_OK,
              onPress: () => {
                dispatch(clearError());
              },
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', error, [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearError());
            },
          },
        ]);
      }
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (otpSent && otpPhone === phoneNumber) {
      otpModalRef.current?.present();
    }
  }, [otpSent, otpPhone, phoneNumber]);

  const isValidPhone = RegisterUIService.validatePhoneNumber(phoneNumber);

  const handleRegister = async () => {
    if (isValidPhone && !isLoading) {
      await dispatch(registerUser({ phone: phoneNumber }));
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('/(auth)/login');
  };

  const handleVerifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    const result = await dispatch(loginWithOtp({ phone, otp }));
    return !loginWithOtp.rejected.match(result);
  };

  const handleOtpSuccess = () => {
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={BRAND_COLORS.bta.primaryText}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{REGISTER_TEXT.HEADER_TITLE}</Text>
          <View style={styles.headerRight} />
        </View>


        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={IS_IOS ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.welcomeText}>
                {REGISTER_TEXT.WELCOME_TEXT}
              </Text>
              <Text style={styles.brandName}>{REGISTER_TEXT.BRAND_NAME}</Text>
              <Text style={styles.subtitle}>{REGISTER_TEXT.SUBTITLE}</Text>
            </View>

            <View style={styles.formContainer}>
              <RegisterPhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onSubmit={handleRegister}
                isValid={isValidPhone}
                isLoading={isLoading}
                autoFocusDelay={REGISTER_LAYOUT.KEYBOARD_FOCUS_DELAY}
              />

              <View style={styles.loginLinkContainer}>
                <Text style={styles.hasAccountText}>
                  {REGISTER_TEXT.HAS_ACCOUNT}
                </Text>
                <TouchableOpacity
                  onPress={handleNavigateToLogin}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLinkText}>
                    {REGISTER_TEXT.LOGIN_LINK}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <OtpVerificationBottomSheet
          ref={otpModalRef}
          phoneNumber={phoneNumber}
          onVerifyOtp={handleVerifyOtp}
          onSuccess={handleOtpSuccess}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.bold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: REGISTER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: REGISTER_LAYOUT.HEADER_PADDING_VERTICAL,
    backgroundColor: BRAND_COLORS.screenBg.bold,
    borderBottomColor: BRAND_COLORS.screenBg.fresh,
  },
  backButton: {
    width: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
    height: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: REGISTER_LAYOUT.HEADER_TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.bta.primaryText,
  },
  headerRight: {
    width: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
  },
  keyboardAvoid: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.fresh,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: REGISTER_LAYOUT.FORM_PADDING_HORIZONTAL,
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: REGISTER_LAYOUT.TITLE_SECTION_PADDING_TOP,
    paddingBottom: REGISTER_LAYOUT.TITLE_SECTION_PADDING_BOTTOM,
  },
  welcomeText: {
    fontSize: REGISTER_LAYOUT.WELCOME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
    marginBottom: REGISTER_LAYOUT.WELCOME_MARGIN_BOTTOM,
  },
  brandName: {
    fontSize: REGISTER_LAYOUT.BRAND_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
    marginBottom: REGISTER_LAYOUT.BRAND_NAME_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: REGISTER_LAYOUT.SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.subtitle,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: REGISTER_LAYOUT.LINK_MARGIN_TOP,
    gap: 4,
  },
  hasAccountText: {
    fontSize: REGISTER_LAYOUT.LINK_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.subtitle,
  },
  loginLinkText: {
    fontSize: REGISTER_LAYOUT.LINK_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.bta.primaryBg,
    textDecorationLine: 'underline',
  },
});