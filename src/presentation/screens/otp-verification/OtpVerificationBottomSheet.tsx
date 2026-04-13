import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrandColors } from '../../theme/BrandColorContext';
import { OtpInput } from './components/OtpInput';
import { OtpTimer } from './components/OtpTimer';
import { RetryButton } from './components/RetryButton';
import { useOtpVerification } from './hooks/use-otp-verification';
import { OTP_CONFIG, OTP_TEXT } from './OtpVerificationConstants';
import { OtpVerificationStateEnum } from './OtpVerificationEnums';
import { OTP_LAYOUT } from './OtpVerificationLayout';
import { OtpVerificationService } from './OtpVerificationService';

export interface OtpVerificationRef {
  present: () => void;
  dismiss: () => void;
}

interface OtpVerificationScreenProps {
  phoneNumber: string;
  onVerifyOtp?: (phone: string, otp: string) => Promise<boolean>;
  onSuccess?: () => void;
  onResendOtp?: (phone: string) => Promise<boolean>;
}

export const OtpVerificationBottomSheet = forwardRef<OtpVerificationRef, OtpVerificationScreenProps>(
  ({ phoneNumber, onVerifyOtp, onSuccess, onResendOtp }, ref) => {
    const BRAND_COLORS = useBrandColors();
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);

    const {
      digits,
      setDigits,
      state,
      timeRemaining,
      setTimeRemaining,
      totalRetryCount,
      setTotalRetryCount,
      errorMessage,
      setErrorMessage,
      isLoading,
      shakeX,
      canClickResend,
      showMaxRetriesError,
      reset,
      handleDismiss,
      handleClose,
      handleResendClick,
      handleOtpComplete,
      setState,
    } = useOtpVerification({ phoneNumber, onVerifyOtp, onSuccess, onResendOtp, sheetRef });

    const snapPoints = useMemo(() => ['80%'], []);

    const shakeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeX.value }],
    }));

    useImperativeHandle(ref, () => ({
      present: () => {
        reset();
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: BRAND_COLORS.screenBg.warm }]}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentWrapper}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={[styles.closeButtonText, { color: BRAND_COLORS.primary.p3 }]}>{OTP_TEXT.CLOSE_BUTTON}</Text>
          </TouchableOpacity>

          <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
            <Text style={[styles.title, { color: BRAND_COLORS.primary.p3 }]}>{OTP_TEXT.TITLE}</Text>
            <Text style={[styles.subtitle, { color: BRAND_COLORS.primary.p3 }]}>
              {OTP_TEXT.SUBTITLE_PREFIX} {OtpVerificationService.formatPhoneForDisplay(phoneNumber)}
            </Text>
            <Text style={[styles.inputLabel, { color: BRAND_COLORS.primary.p3 }]}>{OTP_TEXT.INPUT_LABEL}</Text>

            <OtpInput
              digits={digits}
              onDigitsChange={setDigits}
              onComplete={handleOtpComplete}
              shakeAnimatedStyle={shakeAnimatedStyle}
              disabled={isLoading || state === OtpVerificationStateEnum.VERIFYING}
            />

            {!showMaxRetriesError && (
              <OtpTimer timeRemaining={timeRemaining} onResend={handleResendClick} canClickResend={canClickResend} />
            )}

            {errorMessage && !showMaxRetriesError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                {timeRemaining <= 0 && (
                  <RetryButton
                    onPress={() => {
                      setTotalRetryCount((c) => c + 1);
                      setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
                      setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
                      setState(OtpVerificationStateEnum.IDLE);
                      setErrorMessage(null);
                    }}
                  />
                )}
              </View>
            )}

            {showMaxRetriesError && (
              <TouchableOpacity style={[styles.okButton, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={handleClose}>
                <Text style={[styles.okButtonText, { color: BRAND_COLORS.primary.p1 }]}>{OTP_TEXT.BUTTON_OK}</Text>
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

OtpVerificationBottomSheet.displayName = 'OtpVerificationBottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: { backgroundColor: '#DDDDDD', width: 40 },
  contentWrapper: { flex: 1 },
  closeButton: {
    position: 'absolute',
    top: OTP_LAYOUT.CLOSE_BUTTON_TOP,
    right: OTP_LAYOUT.CLOSE_BUTTON_RIGHT,
    width: OTP_LAYOUT.CLOSE_BUTTON_SIZE,
    height: OTP_LAYOUT.CLOSE_BUTTON_SIZE,
    borderRadius: OTP_LAYOUT.CLOSE_BUTTON_BORDER_RADIUS,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: { fontSize: OTP_LAYOUT.CLOSE_BUTTON_FONT_SIZE, fontFamily: 'SpaceGrotesk-Bold' },
  content: {
    flex: 1,
    paddingHorizontal: OTP_LAYOUT.CONTENT_PADDING_HORIZONTAL,
    paddingTop: OTP_LAYOUT.CONTENT_PADDING_TOP,
  },
  title: {
    fontSize: OTP_LAYOUT.TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: OTP_LAYOUT.SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
    lineHeight: OTP_LAYOUT.SUBTITLE_LINE_HEIGHT,
    marginBottom: OTP_LAYOUT.SUBTITLE_MARGIN_BOTTOM,
  },
  inputLabel: {
    fontSize: OTP_LAYOUT.INPUT_LABEL_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.INPUT_LABEL_MARGIN_BOTTOM,
  },
  errorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: OTP_LAYOUT.ERROR_MARGIN_TOP },
  errorText: { fontSize: OTP_LAYOUT.ERROR_FONT_SIZE, fontFamily: 'SpaceGrotesk-Medium', color: '#FF0000', lineHeight: OTP_LAYOUT.ERROR_LINE_HEIGHT, textAlign: 'center' },
  okButton: { marginTop: OTP_LAYOUT.OK_BUTTON_MARGIN_TOP, borderRadius: OTP_LAYOUT.OK_BUTTON_BORDER_RADIUS, paddingVertical: OTP_LAYOUT.OK_BUTTON_PADDING_VERTICAL, alignItems: 'center' },
  okButtonText: { fontSize: OTP_LAYOUT.OK_BUTTON_FONT_SIZE, fontFamily: 'Phudu-Bold' },
});
