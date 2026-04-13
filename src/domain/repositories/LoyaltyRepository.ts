import { LoyaltyResponseDTO } from '../../application/dto/LoyaltyDTO';

export interface LoyaltyRepository {
	getLoyaltyTiers(): Promise<LoyaltyResponseDTO>;
}
