import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { TokenStorage } from '../../infrastructure/storage/tokenStorage';

/**
 * Performs a full logout:
 * 1. Notifies the server to invalidate the session (best-effort)
 * 2. Clears all tokens from secure storage
 *
 * Redux state reset is handled by the authSlice logoutUser thunk
 * that dispatches this use case.
 */
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    // Attempt server-side session invalidation with the current access token
    const { accessToken } = await TokenStorage.getTokens();
    if (accessToken) {
      // Best-effort: failure is swallowed inside AuthRepositoryImpl.logout()
      await this.authRepository.logout(accessToken);
    }

    // Always clear local tokens regardless of server response
    await TokenStorage.clearAll();
  }
}
