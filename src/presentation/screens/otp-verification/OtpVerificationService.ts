import { OTP_CONFIG } from './OtpVerificationConstants';
import { OtpErrorType, OtpUserType } from './OtpVerificationEnums';
import { OtpTimerState, OtpVerificationResult } from './OtpVerificationInterfaces';

export class OtpVerificationService {
  
  static verifyOtpCode(code: string): OtpVerificationResult {
    if (code === OTP_CONFIG.VALID_CODE_EXISTING_USER) {
      return { isValid: true, userType: OtpUserType.EXISTING };
    }
    if (code === OTP_CONFIG.VALID_CODE_NEW_USER) {
      return { isValid: true, userType: OtpUserType.NEW };
    }
    return { isValid: false, errorType: OtpErrorType.INVALID_CODE };
  }

  static formatTimeRemaining(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  static getTimerState(seconds: number): OtpTimerState {
    return {
      minutes: Math.floor(seconds / 60),
      seconds: seconds % 60,
      isExpired: seconds <= 0,
    };
  }

  static canClickResend(timeRemaining: number, hasClickedResendThisCycle: boolean): boolean {
    return timeRemaining > 0 && !hasClickedResendThisCycle;
  }

  static canShowRetryIcon(timeRemaining: number, totalRetryCount: number): boolean {
    return timeRemaining <= 0 && totalRetryCount < OTP_CONFIG.MAX_RETRY_COUNT;
  }

  static isValidDigit(char: string): boolean {
    return /^\d$/.test(char);
  }

  static formatPhoneForDisplay(phone: string): string {
    const cleaned = phone.replace(/^\+84/, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)}***${cleaned.slice(-3)}`;
    }
    return cleaned;
  }

  static isOtpComplete(digits: string[]): boolean {
    return digits.length === OTP_CONFIG.CODE_LENGTH && digits.every(d => this.isValidDigit(d));
  }

  // --- NEW METHODS ADDED FOR BOTTOM SHEET LOGIC ---

  /**
   * Giả lập gọi API verify OTP
   */
  static async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.verifyOtpCode(code);
        if (result.isValid) {
          resolve(true);
        } else {
          // Trong thực tế, reject với message từ server
          reject(new Error('Mã OTP không chính xác'));
        }
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Giả lập gọi API resend OTP
   */
  static async resendOtp(phoneNumber: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
}