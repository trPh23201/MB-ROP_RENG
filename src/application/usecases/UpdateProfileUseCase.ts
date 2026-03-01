import { User } from '../../domain/entities/User';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileRepository } from '../../infrastructure/repositories/ProfileRepository';

export class UpdateProfileUseCase {
    constructor(private readonly profileRepository: IProfileRepository = new ProfileRepository()) { }

    async execute(userId: string, data: any): Promise<User> {
        // TODO: implement when API is ready
        // return await this.profileRepository.updateProfile(userId, data);
        throw new Error("API chưa được hỗ trợ");
    }
}