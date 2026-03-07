import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthActionNavigator } from '../../../application/services/AuthActionNavigator';
import { AuthActionService } from '../../../domain/services/AuthActionService';
import { clearPendingAction } from '../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { useAuth } from '../../../utils/hooks/useAuth';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpInput } from './components/OtpInput';
import { OtpTimer } from './components/OtpTimer';
import { RetryButton } from './components/RetryButton';
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
    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const pendingAction = useAppSelector((state) => state.auth.pendingAction);

    const [digits, setDigits] = useState<string[]>(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    const [state, setState] = useState<OtpVerificationStateEnum>(OtpVerificationStateEnum.IDLE);
    const [timeRemaining, setTimeRemaining] = useState(OTP_CONFIG.TIMER_DURATION_SECONDS);
    const [hasClickedResendThisCycle, setHasClickedResendThisCycle] = useState(false);
    const [totalRetryCount, setTotalRetryCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const sheetRef = useRef<BottomSheetModal>(null);
    const isLoginSuccessRef = useRef(false);
    const shakeX = useSharedValue(0);

    const { verifyOtp: defaultVerifyOtp, sendOtp: defaultSendOtp, isLoading, error } = useAuth();

    const verifyOtp = onVerifyOtp || defaultVerifyOtp;
    const resendOtp = onResendOtp || defaultSendOtp;

    const snapPoints = useMemo(() => ['80%'], []);

    useImperativeHandle(ref, () => ({
      present: () => {
        isLoginSuccessRef.current = false;
        setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
        setState(OtpVerificationStateEnum.IDLE);
        setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
        setHasClickedResendThisCycle(false);
        setTotalRetryCount(0);
        setErrorMessage(null);
        sheetRef.current?.present();
      },
      dismiss: () => {
        sheetRef.current?.dismiss();
      },
    }));

    useEffect(() => {
      if (timeRemaining <= 0) return;

      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }, [timeRemaining]);

    const shakeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeX.value }],
    }));

    const triggerShake = () => {
      shakeX.value = withSequence(
        withTiming(-OTP_LAYOUT.SHAKE_AMPLITUDE, { duration: 50 }),
        withTiming(OTP_LAYOUT.SHAKE_AMPLITUDE, { duration: 50 }),
        withTiming(-OTP_LAYOUT.SHAKE_AMPLITUDE, { duration: 50 }),
        withTiming(OTP_LAYOUT.SHAKE_AMPLITUDE, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    };

    const handleDismiss = useCallback(() => {
      if (isLoginSuccessRef.current) {
        if (onSuccess) {
          onSuccess();
        } else {
          // Handle pending action with centralized navigator
          if (pendingAction) {
            const validation = AuthActionService.validate(pendingAction);

            if (!validation.isValid) {
              console.warn(`[OtpVerification] Invalid action: ${validation.reason}`);
              dispatch(clearPendingAction());
              router.dismissAll();
              router.replace('/(tabs)');
              return;
            }

            const navigator = new AuthActionNavigator(router);
            navigator.execute(pendingAction);
            //dispatch(clearPendingAction());
          } else {
            router.dismissAll();
            router.replace('/(tabs)');
          }
        }
      }
    }, [pendingAction, dispatch, router, onSuccess]);

    const handleClose = () => {
      sheetRef.current?.dismiss();
    };

    const handleResendClick = async () => {
      if (!OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle)) {
        return;
      }

      setHasClickedResendThisCycle(true);
      setTotalRetryCount((prev) => prev + 1);

      try {
        await resendOtp(phoneNumber);
        setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
        setState(OtpVerificationStateEnum.IDLE);
        setErrorMessage(null);
      } catch {
        setErrorMessage('Không thể gửi lại mã OTP');
      }
    };

    const handleOtpComplete = async (code: string) => {
      if (state === OtpVerificationStateEnum.VERIFYING) return;

      setState(OtpVerificationStateEnum.VERIFYING);

      try {
        const success = await verifyOtp(phoneNumber, code);

        if (success) {
          isLoginSuccessRef.current = true;
          setState(OtpVerificationStateEnum.SUCCESS);
          sheetRef.current?.dismiss();
        } else {
          setState(OtpVerificationStateEnum.ERROR);
          setErrorMessage(error || OTP_TEXT.ERROR_INVALID);
          triggerShake();

          setTimeout(() => {
            setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
            setState(OtpVerificationStateEnum.IDLE);
          }, OTP_LAYOUT.SHAKE_DURATION);
        }
      } catch {
        setState(OtpVerificationStateEnum.ERROR);
        setErrorMessage(OTP_TEXT.ERROR_INVALID);
        triggerShake();

        setTimeout(() => {
          setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
          setState(OtpVerificationStateEnum.IDLE);
        }, OTP_LAYOUT.SHAKE_DURATION);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    const canClickResend = OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle);
    const showMaxRetriesError = totalRetryCount >= OTP_CONFIG.MAX_RETRY_COUNT && timeRemaining <= 0;

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentWrapper}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>{OTP_TEXT.CLOSE_BUTTON}</Text>
          </TouchableOpacity>

          <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
            <Text style={styles.title}>{OTP_TEXT.TITLE}</Text>

            <Text style={styles.subtitle}>
              {OTP_TEXT.SUBTITLE_PREFIX} {OtpVerificationService.formatPhoneForDisplay(phoneNumber)}
            </Text>

            <Text style={styles.inputLabel}>{OTP_TEXT.INPUT_LABEL}</Text>

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
              <TouchableOpacity style={styles.okButton} onPress={handleClose}>
                <Text style={styles.okButtonText}>{OTP_TEXT.BUTTON_OK}</Text>
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
    backgroundColor: BRAND_COLORS.screenBg.warm,
    borderTopLeftRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
  },
  contentWrapper: {
    flex: 1,
  },
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
  closeButtonText: {
    fontSize: OTP_LAYOUT.CLOSE_BUTTON_FONT_SIZE,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: OTP_LAYOUT.CONTENT_PADDING_HORIZONTAL,
    paddingTop: OTP_LAYOUT.CONTENT_PADDING_TOP,
  },
  title: {
    fontSize: OTP_LAYOUT.TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: OTP_LAYOUT.SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    lineHeight: OTP_LAYOUT.SUBTITLE_LINE_HEIGHT,
    marginBottom: OTP_LAYOUT.SUBTITLE_MARGIN_BOTTOM,
  },
  inputLabel: {
    fontSize: OTP_LAYOUT.INPUT_LABEL_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.INPUT_LABEL_MARGIN_BOTTOM,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: OTP_LAYOUT.ERROR_MARGIN_TOP,
  },
  errorText: {
    fontSize: OTP_LAYOUT.ERROR_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#FF0000',
    lineHeight: OTP_LAYOUT.ERROR_LINE_HEIGHT,
    textAlign: 'center',
  },
  okButton: {
    marginTop: OTP_LAYOUT.OK_BUTTON_MARGIN_TOP,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: OTP_LAYOUT.OK_BUTTON_BORDER_RADIUS,
    paddingVertical: OTP_LAYOUT.OK_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: OTP_LAYOUT.OK_BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.beSua,
  },
});