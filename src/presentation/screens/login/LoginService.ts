import { LOGIN_PHONE_CONFIG } from './LoginConstants';
import { LoginProvider, LoginValidationState } from './LoginEnums';
import { LoginFormState } from './LoginInterfaces';

export class LoginUIService {
  static validatePhoneNumber(phone: string): boolean {
    return LOGIN_PHONE_CONFIG.PHONE_REGEX.test(phone);
  }

  static formatPhoneInput(input: string): string {
    return input.replace(/\D/g, '');
  }

  static getValidationState(phone: string): LoginValidationState {
    if (phone.length === 0) {
      return LoginValidationState.IDLE;
    }
    return this.validatePhoneNumber(phone) ? LoginValidationState.VALID : LoginValidationState.INVALID;
  }

  static formatPhoneDisplay(phone: string): string {
    return `${LOGIN_PHONE_CONFIG.COUNTRY_CODE}${phone}`;
  }

  static generateUserId(): string {
    return `user_${Date.now()}`;
  }

  static canSubmitForm(state: LoginFormState): boolean {
    return state.validationState === LoginValidationState.VALID;
  }

  static handleSocialLogin(provider: LoginProvider): void {
    console.log(`Social login initiated: ${provider}`);
  }
}