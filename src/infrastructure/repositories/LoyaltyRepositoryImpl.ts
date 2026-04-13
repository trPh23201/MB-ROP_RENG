import { LoyaltyResponseDTO } from '../../application/dto/LoyaltyDTO';
import { LoyaltyRepository } from '../../domain/repositories/LoyaltyRepository';

import { LOYALTY_API } from '../api/loyalty/LoyaltyApiConfig';
import { httpClient } from '../http/HttpClient';

export class LoyaltyRepositoryImpl implements LoyaltyRepository {
 private static instance: LoyaltyRepositoryImpl;

    private constructor() { }

    public static getInstance(): LoyaltyRepositoryImpl {
        if (!LoyaltyRepositoryImpl.instance) {
            LoyaltyRepositoryImpl.instance = new LoyaltyRepositoryImpl();
        }
        return LoyaltyRepositoryImpl.instance;
    }

  async getLoyaltyTiers(): Promise<LoyaltyResponseDTO> {
    try {
      return await httpClient.get<LoyaltyResponseDTO>(LOYALTY_API.GET_LOYALTY_TIERS.URL);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch loyalty tiers';
      throw new Error(message);
    }
  }
}

export const loyaltyRepository = LoyaltyRepositoryImpl.getInstance();