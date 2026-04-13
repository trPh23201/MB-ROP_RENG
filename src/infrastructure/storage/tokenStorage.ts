import { SecureStorage } from './secureStorage';

export class TokenStorage {
  static async saveTokens(accessToken: string, refreshToken: string, userId: string): Promise<void> {
    await Promise.all([
      SecureStorage.saveAuthToken(accessToken),
      SecureStorage.saveRefreshToken(refreshToken),
      SecureStorage.saveUserId(userId),
    ]);
  }

  static async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null; userId: string | null; }> {
    const [accessToken, refreshToken, userId] = await Promise.all([
      SecureStorage.getAuthToken(),
      SecureStorage.getRefreshToken(),
      SecureStorage.getUserId(),
    ]);

    return { accessToken, refreshToken, userId };
  }

  static async getRefreshToken(): Promise<string | null> {
    return SecureStorage.getRefreshToken();
  }

  static async setRefreshToken(token: string): Promise<void> {
    await SecureStorage.saveRefreshToken(token);
  }

  /** Clears both access token and refresh token from storage */
  static async clearAll(): Promise<void> {
    await SecureStorage.clearAll();
  }

  /** @deprecated Use clearAll() for full token cleanup */
  static async clearTokens(): Promise<void> {
    await SecureStorage.clearAll();
  }
}