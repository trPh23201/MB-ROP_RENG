import { User } from '../../domain/entities/User';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileRepository } from '../../infrastructure/repositories/ProfileRepository';
import { ApiError } from '../../core/errors/AppErrors';

export class UpdateProfileUseCase {
    constructor(private readonly profileRepository: IProfileRepository = new ProfileRepository()) { }

    async execute(userId: string, data: Record<string, unknown>): Promise<User> {
        // return await this.profileRepository.updateProfile(userId, data);
        throw new ApiError("API chưa được hỗ trợ");
    }
}