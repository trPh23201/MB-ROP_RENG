import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpVerificationBottomSheet, OtpVerificationRef } from '../otp-verification/OtpVerificationBottomSheet';
import { PhoneInput } from './components/PhoneInput';
import { SocialButton } from './components/SocialButton';
import { LOGIN_TEXT } from './LoginConstants';
import { LoginProvider } from './LoginEnums';
import { LOGIN_LAYOUT } from './LoginLayout';
import { LoginUIService } from './LoginService';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const otpModalRef = useRef<OtpVerificationRef>(null);

  const opacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);

  const startEntranceAnimation = useCallback(() => {
    opacity.value = withTiming(1, { duration: 300 });
    contentScale.value = withTiming(1, { duration: 300 });
  }, [contentScale, opacity]);

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        scheduleOnRN(router.back);
      }
    });
    contentScale.value = withTiming(0.95, { duration: 200 });
  }, [router, contentScale, opacity]);

  useEffect(() => {
    startEntranceAnimation();
  }, [startEntranceAnimation]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const isValidPhone = LoginUIService.validatePhoneNumber(phoneNumber);

  const handleLogin = () => {
    if (isValidPhone && !isSendingOtp) {
      setIsSendingOtp(true);
      setTimeout(() => {
        setIsSendingOtp(false);
        otpModalRef.current?.present();
      }, LOGIN_LAYOUT.OTP_SENDING_DURATION);
    }
  };

  const handleSocialLogin = (provider: LoginProvider) => {
    LoginUIService.handleSocialLogin(provider);
  };

  const handleNavigateToRegister = () => {
    router.replace('../(auth)/register');
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <TouchableWithoutFeedback onPress={handleDismiss}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Content */}
        <Animated.View style={[styles.modalWrapper, animatedModalStyle]}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.closeContainer}>
                <TouchableOpacity
                  style={styles.closeButtonWrapper}
                  onPress={handleDismiss}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButton}>
                    {LOGIN_TEXT.CLOSE_BUTTON}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.heroContainer}>
                <Text style={styles.heroPlaceholder}>
                  {LOGIN_TEXT.IMAGE_PLACEHOLDER}
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>
                  {LOGIN_TEXT.WELCOME_TEXT}
                </Text>
                <Text style={styles.brandName}>{LOGIN_TEXT.BRAND_NAME}</Text>

                <PhoneInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onSubmit={handleLogin}
                  isValid={isValidPhone}
                  isLoading={isSendingOtp}
                  autoFocusDelay={LOGIN_LAYOUT.KEYBOARD_FOCUS_DELAY}
                />

                {/* Register Link */}
                <View style={styles.registerLinkContainer}>
                  <Text style={styles.noAccountText}>
                    {LOGIN_TEXT.NO_ACCOUNT}
                  </Text>
                  <TouchableOpacity
                    onPress={handleNavigateToRegister}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.registerLinkText}>
                      {LOGIN_TEXT.REGISTER_LINK}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.divider}>{LOGIN_TEXT.DIVIDER_TEXT}</Text>

                <SocialButton
                  provider={LoginProvider.FACEBOOK}
                  label={LOGIN_TEXT.FACEBOOK_LOGIN}
                  onPress={() => handleSocialLogin(LoginProvider.FACEBOOK)}
                />
                <SocialButton
                  provider={LoginProvider.GOOGLE}
                  label={LOGIN_TEXT.GOOGLE_LOGIN}
                  onPress={() => handleSocialLogin(LoginProvider.GOOGLE)}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>

        <OtpVerificationBottomSheet
          ref={otpModalRef}
          phoneNumber={phoneNumber}
        />
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_COLORS.screenBg.fresh,
  },
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.fresh,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeContainer: {
    position: 'absolute',
    top: LOGIN_LAYOUT.CLOSE_BUTTON_TOP,
    right: LOGIN_LAYOUT.CLOSE_BUTTON_RIGHT,
    zIndex: 10,
  },
  closeButtonWrapper: {
    width: LOGIN_LAYOUT.CLOSE_BUTTON_SIZE,
    height: LOGIN_LAYOUT.CLOSE_BUTTON_SIZE,
    borderRadius: LOGIN_LAYOUT.CLOSE_BUTTON_BORDER_RADIUS,
    marginTop: 12,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: LOGIN_LAYOUT.CLOSE_BUTTON_FONT_SIZE,
    marginBottom: 2,
    color: BRAND_COLORS.bta.primaryBg,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  heroContainer: {
    height: LOGIN_LAYOUT.HERO_HEIGHT,
    backgroundColor: BRAND_COLORS.screenBg.warm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    fontSize: LOGIN_LAYOUT.HERO_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: LOGIN_LAYOUT.FORM_PADDING_HORIZONTAL,
    paddingTop: LOGIN_LAYOUT.FORM_PADDING_TOP,
  },
  welcomeText: {
    fontSize: LOGIN_LAYOUT.WELCOME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
    marginBottom: LOGIN_LAYOUT.WELCOME_TEXT_MARGIN_BOTTOM,
  },
  brandName: {
    fontSize: LOGIN_LAYOUT.BRAND_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.ui.heading,
    textAlign: 'center',
    marginBottom: LOGIN_LAYOUT.BRAND_NAME_MARGIN_BOTTOM,
    letterSpacing: LOGIN_LAYOUT.BRAND_NAME_LETTER_SPACING,
  },
  divider: {
    fontSize: LOGIN_LAYOUT.DIVIDER_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.placeholder,
    textAlign: 'center',
    marginVertical: LOGIN_LAYOUT.DIVIDER_MARGIN_VERTICAL,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  noAccountText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.ui.subtitle,
  },
  registerLinkText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.bta.primaryBg,
    textDecorationLine: 'underline',
  },
});