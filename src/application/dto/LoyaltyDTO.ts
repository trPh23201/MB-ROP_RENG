export interface LoyaltyBenefitDTO {
  id: number;
  loyalty_rule_id: number;
  icon: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTierDTO {
  id: number;
  parent_id: number;
  tier_name: string;
  color: string | null;
  min_points: number;
  multiplier: string;
  description: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  benefits: LoyaltyBenefitDTO[];
}

export interface LoyaltyResponseDTO {
  loyalties: LoyaltyTierDTO[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}