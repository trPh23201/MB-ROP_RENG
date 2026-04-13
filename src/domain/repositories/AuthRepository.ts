import { User } from '../entities/User';

export interface RegisterResult {
  user: User;
  otpSent: boolean;
}

export interface LoginResult {
  user: User;
  token: string;
}

/** Both tokens returned on a successful refresh */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRepository {
  register(phone: string): Promise<RegisterResult>;
  login(phone: string, otp: string): Promise<LoginResult>;
  /**
   * Exchange an existing refresh token for a new token pair.
   * Endpoint: POST /auth/refresh-token
   */
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  /**
   * Invalidate the session server-side.
   * Endpoint: POST /auth/logout
   */
  logout(token: string): Promise<void>;
}