import { LoginUseCase } from '../../../src/application/usecases/LoginUseCase';
import { AuthRepository, LoginResult } from '../../../src/domain/repositories/AuthRepository';
import { TokenStorageService } from '../../../src/domain/services/TokenStorageService';
import { ValidationError } from '../../../src/core/errors/AppErrors';
import { User } from '../../../src/domain/entities/User';

function makeUser(): User {
  return {
    id: 1,
    uuid: 'uuid-001',
    phone: '0901234567',
    email: null,
    displayName: 'Test',
    avatarUrl: null,
    role: 'end_user',
    storeId: null,
    isActive: true,
    loyaltyPoint: 0,
    availablePoint: 0,
    currentLevelId: null,
    nextLevelId: null,
    createdAt: new Date(),
    updatedAt: null,
  };
}

function makeLoginResult(): LoginResult {
  return { user: makeUser(), token: 'access-token-xyz' };
}

function makeAuthRepository(overrides: Partial<AuthRepository> = {}): AuthRepository {
  return {
    register: jest.fn(),
    login: jest.fn().mockResolvedValue(makeLoginResult()),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    ...overrides,
  };
}

function makeTokenStorage(): TokenStorageService {
  return {
    saveTokens: jest.fn().mockResolvedValue(undefined),
    getTokens: jest.fn().mockResolvedValue({ accessToken: null, refreshToken: null, userId: null }),
    clearTokens: jest.fn().mockResolvedValue(undefined),
  };
}

describe('LoginUseCase', () => {
  it('calls repository.login with clean phone number', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    await useCase.execute('090 123 4567', '123456');

    expect(repo.login).toHaveBeenCalledWith('0901234567', '123456');
  });

  it('strips non-digit characters from phone', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    // 090.123.4567 strips to 0901234567 = 10 digits -> valid
    const result = await useCase.execute('090.123.4567', '123456');
    expect(result).toBeDefined();
    expect(repo.login).toHaveBeenCalledWith('0901234567', '123456');
  });

  it('throws ValidationError for phone with less than 10 digits', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    await expect(useCase.execute('090123', '123456')).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws ValidationError with field=phone for invalid phone', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    try {
      await useCase.execute('12345', '123456');
    } catch (e) {
      expect((e as ValidationError).field).toBe('phone');
    }
  });

  it('throws ValidationError for OTP shorter than 6 digits', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    await expect(useCase.execute('0901234567', '123')).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws ValidationError with field=otp for invalid OTP', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    try {
      await useCase.execute('0901234567', '12345');
    } catch (e) {
      expect((e as ValidationError).field).toBe('otp');
    }
  });

  it('saves tokens after successful login', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    await useCase.execute('0901234567', '123456');

    expect(storage.saveTokens).toHaveBeenCalledWith('access-token-xyz', '', 'uuid-001');
  });

  it('returns LoginResult on success', async () => {
    const repo = makeAuthRepository();
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    const result = await useCase.execute('0901234567', '123456');

    expect(result.token).toBe('access-token-xyz');
    expect(result.user.phone).toBe('0901234567');
  });

  it('propagates repository errors', async () => {
    const repo = makeAuthRepository({
      login: jest.fn().mockRejectedValue(new Error('Network error')),
    });
    const storage = makeTokenStorage();
    const useCase = new LoginUseCase(repo, storage);

    await expect(useCase.execute('0901234567', '123456')).rejects.toThrow('Network error');
  });
});
