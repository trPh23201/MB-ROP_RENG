import { UserMapper } from '../../application/mappers/UserMapper';
import { User } from '../../domain/entities/User';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileApiClient } from '../api/profile/ProfileApiClient';

export class ProfileRepository implements IProfileRepository {
    constructor(private readonly apiClient: ProfileApiClient = new ProfileApiClient()) { }

    async getProfile(userId: string): Promise<User> {
        const response = await this.apiClient.getProfile(userId);
        return UserMapper.toUser(response.user);
    }
}