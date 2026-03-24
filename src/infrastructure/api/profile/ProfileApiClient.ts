import { ProfileResponseDTO } from '../../../application/dto/ProfileDTO';
import { httpClient } from '../../http/HttpClient';

export class ProfileApiClient {
    async getProfile(userId: string): Promise<ProfileResponseDTO> {
        const response = await httpClient.get<ProfileResponseDTO>(`/user/${userId}`);
        return response;
    }
}