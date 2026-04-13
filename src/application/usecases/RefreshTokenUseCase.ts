import { AuthRepository, AuthTokens } from '../../domain/repositories/AuthRepository';
import { TokenStorage } from '../../infrastructure/storage/tokenStorage';

/**
 * Exchanges the stored refresh token for a new access+refresh token pair
 * and persists both to secure storage.
 *
 * Returns the new AuthTokens on success, null if no refresh token is stored.
 */
export class RefreshTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthTokens | null> {
    const refreshToken = await TokenStorage.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const tokens = await this.authRepository.refreshToken(refreshToken);

    // Preserve existing userId — only replace the tokens
    const { userId } = await TokenStorage.getTokens();
    await TokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken, userId ?? '');

    return tokens;
  }
}
