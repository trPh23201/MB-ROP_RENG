import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { AuthActionNavigator } from '../../../../application/services/AuthActionNavigator';
import { AuthActionService } from '../../../../domain/services/AuthActionService';
import { clearPendingAction } from '../../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../../utils/hooks';
import { useAuth } from '../../../../utils/hooks/useAuth';
import { OTP_CONFIG, OTP_TEXT } from '../OtpVerificationConstants';
import { OtpVerificationStateEnum } from '../OtpVerificationEnums';
import { OTP_LAYOUT } from '../OtpVerificationLayout';
import { OtpVerificationService } from '../OtpVerificationService';

interface UseOtpVerificationProps {
  phoneNumber: string;
  onVerifyOtp?: (phone: string, otp: string) => Promise<boolean>;
  onSuccess?: () => void;
  onResendOtp?: (phone: string) => Promise<boolean>;
  sheetRef: React.RefObject<any>;
}

export function useOtpVerification({
  phoneNumber,
  onVerifyOtp,
  onSuccess,
  onResendOtp,
  sheetRef,
}: UseOtpVerificationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pendingAction = useAppSelector((state) => state.auth.pendingAction);
  const { verifyOtp: defaultVerifyOtp, sendOtp: defaultSendOtp, isLoading, error } = useAuth();

  const verifyOtp = onVerifyOtp || defaultVerifyOtp;
  const resendOtp = onResendOtp || defaultSendOtp;

  const [digits, setDigits] = useState<string[]>(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
  const [state, setState] = useState<OtpVerificationStateEnum>(OtpVerificationStateEnum.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(OTP_CONFIG.TIMER_DURATION_SECONDS);
  const [hasClickedResendThisCycle, setHasClickedResendThisCycle] = useState(false);
  const [totalRetryCount, setTotalRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoginSuccessRef = useRef(false);
  const shakeX = useSharedValue(0);

  const reset = () => {
    isLoginSuccessRef.current = false;
    setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    setState(OtpVerificationStateEnum.IDLE);
    setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
    setHasClickedResendThisCycle(false);
    setTotalRetryCount(0);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

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
      } else if (pendingAction) {
        const validation = AuthActionService.validate(pendingAction);
        if (!validation.isValid) {
          dispatch(clearPendingAction());
          router.dismissAll();
          router.replace('/(tabs)');
          return;
        }
        const navigator = new AuthActionNavigator(router);
        navigator.execute(pendingAction);
      } else {
        router.dismissAll();
        router.replace('/(tabs)');
      }
    }
  }, [pendingAction, dispatch, router, onSuccess]);

  const handleClose = () => sheetRef.current?.dismiss();

  const handleResendClick = async () => {
    if (!OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle)) return;
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

  const canClickResend = OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle);
  const showMaxRetriesError = totalRetryCount >= OTP_CONFIG.MAX_RETRY_COUNT && timeRemaining <= 0;

  return {
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
  };
}
