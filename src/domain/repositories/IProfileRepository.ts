import { User } from '../entities/User';

export interface UpdateProfileData {
    displayName?: string;
    email?: string;
    avatarUrl?: string;
    // Other fields as needed
}

export interface IProfileRepository {
    getProfile(userId: string): Promise<User>;
    // updateProfile(userId: string, data: UpdateProfileData): Promise<User>;
}