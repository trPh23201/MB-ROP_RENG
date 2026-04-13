// eslint-disable-next-line import/no-unresolved
import { MembershipTier } from './DealsEnums';

export class DealsUIService {
  static getTierColor(tier: MembershipTier): string {
    const colors = {
      [MembershipTier.NEW]: '#FF8C00',
      [MembershipTier.BRONZE]: '#8B4513',
      [MembershipTier.SILVER]: '#9CA3AF',
      [MembershipTier.GOLD]: '#D4AF37',
      [MembershipTier.DIAMOND]: '#1F2937',
    };
    return colors[tier];
  }

  static isTierUnlocked(currentTier: MembershipTier, targetTier: MembershipTier): boolean {
    const tierOrder = [
      MembershipTier.NEW,
      MembershipTier.BRONZE,
      MembershipTier.SILVER,
      MembershipTier.GOLD,
      MembershipTier.DIAMOND,
    ];
    return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(targetTier);
  }

  static formatBenefitIcon(icon: string): string {
    return icon;
  }
}