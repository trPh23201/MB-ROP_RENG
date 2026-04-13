import { AuthRepository, RegisterResult, LoginResult, AuthTokens } from '../../domain/repositories/AuthRepository';
import { httpClient } from '../http/HttpClient';
import { AUTH_ENDPOINTS } from '../api/auth/AuthApiConfig';
import { RegisterRequestDTO, RegisterResponseDTO, LoginRequestDTO, LoginResponseDTO } from '../../application/dto/AuthDTO';
import { AuthError, NetworkError, OtpInvalidError, PhoneExistedError, PhoneNotRegisteredError } from '../../core/errors/AppErrors';
import { AxiosError } from 'axios';
import { AuthMapper } from '../../application/mappers/AuthMapper';

const ERROR_CODES = {
  PHONE_EXISTED: 1101,
  REGISTER_SUCCESS: 1100,
  LOGIN_SUCCESS: 1000,
  OTP_INVALID: 1006,
  INVALID_CREDENTIAL: 1001,
  USER_NOT_FOUND: 2001,
};

interface ApiErrorResponse {
  code?: number;
  message?: string;
}

export class AuthRepositoryImpl implements AuthRepository {
  private static instance: AuthRepositoryImpl;

  private constructor() {}

  public static getInstance(): AuthRepositoryImpl {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl();
    }
    return AuthRepositoryImpl.instance;
  }

  async register(phone: string): Promise<RegisterResult> {
    try {
      const request: RegisterRequestDTO = { phone };
      const response = await httpClient.post<RegisterResponseDTO>(
        AUTH_ENDPOINTS.REGISTER,
        request
      );

      const user = AuthMapper.toUser(response.user);

      return {
        user,
        otpSent: true,
      };
    } catch (error) {
      throw this.handleError(error, 'register');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await httpClient.post<AuthTokens>(
        AUTH_ENDPOINTS.REFRESH,
        { refreshToken }
      );
      return response;
    } catch (error) {
      throw this.handleError(error, 'login');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await httpClient.post<void>(
        AUTH_ENDPOINTS.LOGOUT,
        { token }
      );
    } catch {
      // Best-effort: server-side logout failure should not block client cleanup
    }
  }

  async login(phone: string, otp: string): Promise<LoginResult> {
    try {
      const request: LoginRequestDTO = { phone, otp };
      const response = await httpClient.post<LoginResponseDTO>(
        AUTH_ENDPOINTS.LOGIN,
        request
      );

      const user = AuthMapper.toUser(response.data.user);

      return {
        user,
        token: response.data.token,
      };
    } catch (error) {
      throw this.handleError(error, 'login');
    }
  }

  private handleError(error: unknown, operation: 'register' | 'login'): Error {
    if (error instanceof AxiosError) {
      if (!error.response) {
        return new NetworkError();
      }

      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse | undefined;
      const errorCode = data?.code;
      const message = data?.message;

      if (errorCode) {
        switch (errorCode) {
          case ERROR_CODES.PHONE_EXISTED:
            return new PhoneExistedError();

          case ERROR_CODES.OTP_INVALID:
          case ERROR_CODES.INVALID_CREDENTIAL:
            return new OtpInvalidError();

          case ERROR_CODES.USER_NOT_FOUND:
            return new PhoneNotRegisteredError();
        }
      }

      // Fallback to HTTP status code handling
      switch (status) {
        case 400:
          if (operation === 'login' && message?.toLowerCase().includes('otp')) {
            return new OtpInvalidError();
          }
          if (message?.toLowerCase().includes('already registered')) {
            return new PhoneExistedError();
          }
          return new AuthError(message || 'Dữ liệu không hợp lệ');

        case 401:
          return new OtpInvalidError();

        case 404:
          if (operation === 'login') {
            return new PhoneNotRegisteredError();
          }
          return new AuthError('Không tìm thấy tài nguyên');

        case 409:
          return new PhoneExistedError();

        case 429:
          return new AuthError(
            'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau'
          );

        case 500:
        case 502:
        case 503:
          return new AuthError(
            'Máy chủ đang bảo trì. Vui lòng thử lại sau'
          );

        default:
          return new AuthError(message || 'Đã có lỗi xảy ra');
      }
    }

    return new AuthError('Đã có lỗi xảy ra');
  }
}

export const authRepository = AuthRepositoryImpl.getInstance();