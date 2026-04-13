import { AuthRepository, RegisterResult } from '../../domain/repositories/AuthRepository';
import { ValidationError } from '../../core/errors/AppErrors';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(phone: string): Promise<RegisterResult> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      throw new ValidationError('phone', 'Số điện thoại phải có 10 chữ số');
    }

    return this.authRepository.register(cleanPhone);
  }
}