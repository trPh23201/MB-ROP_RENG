import { LoyaltyRepository } from '../../domain/repositories/LoyaltyRepository';
import { LoyaltyResponseDTO } from '../dto/LoyaltyDTO';

export class GetLoyaltyTiersUseCase {
  constructor(private loyaltyRepository: LoyaltyRepository) {}

  async execute(): Promise<LoyaltyResponseDTO> {
    return this.loyaltyRepository.getLoyaltyTiers();
  }
}
