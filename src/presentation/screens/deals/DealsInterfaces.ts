export interface MembershipBenefit {
  id: number;
  icon: string;
  description: string;
}

export interface MembershipTierData {
  id: number;
  tier_name: string;
  color: string;
  benefits: MembershipBenefit[];
}

export type SelectedTier = number | null;