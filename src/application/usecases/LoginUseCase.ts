import { AuthRepository, LoginResult } from '../../domain/repositories/AuthRepository';
import { ValidationError } from '../../core/errors/AppErrors';
import { TokenStorageService } from '../../domain/services/TokenStorageService';
import { TokenStorage } from '../../infrastructure/storage/tokenStorage';

export class LoginUseCase {
  private readonly tokenStorage: TokenStorageService;

  constructor(
    private readonly authRepository: AuthRepository,
    tokenStorage?: TokenStorageService
  ) {
    this.tokenStorage = tokenStorage || TokenStorage;
  }

  async execute(phone: string, otp: string): Promise<LoginResult> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      throw new ValidationError('phone', 'Số điện thoại không hợp lệ');
    }

    if (otp.length !== 6) {
      throw new ValidationError('otp', 'Mã OTP phải có 6 chữ số');
    }

    const result = await this.authRepository.login(cleanPhone, otp);

    await this.tokenStorage.saveTokens(
      result.token,
      '',
      result.user.uuid
    );

    return result;
  }
}
