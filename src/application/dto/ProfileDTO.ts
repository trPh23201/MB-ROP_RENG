import { UserResponseDTO } from './AuthDTO';

export interface UpdateProfileRequestDTO {
    display_name?: string;
    email?: string;
    avatar_url?: string;
}

export interface ProfileResponseDTO {
    user: UserResponseDTO;
}
