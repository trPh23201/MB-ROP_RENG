import { User } from '../../domain/entities/User';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileRepository } from '../../infrastructure/repositories/ProfileRepository';

export class GetProfileUseCase {
    constructor(private readonly profileRepository: IProfileRepository = new ProfileRepository()) { }

    async execute(userId: string): Promise<User> {
        return await this.profileRepository.getProfile(userId);
    }
}