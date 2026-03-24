import { MembershipTier } from '../presentation/screens/deals/DealsEnums';
import { MembershipTierData, MockUser } from '../presentation/screens/deals/DealsInterfaces';

export const MOCK_MEMBERSHIP_TIERS: MembershipTierData[] = [
  {
    id: MembershipTier.NEW,
    name: 'Mới',
    color: '#FF8C00',
    benefits: [],
  },
  {
    id: MembershipTier.BRONZE,
    name: 'Đồng',
    color: '#8B4513',
    benefits: [
      {
        id: 'bronze-1',
        icon: '🎂',
        description: 'Tặng 01 phần bánh sinh nhật',
      },
      {
        id: 'bronze-2',
        icon: '🥤',
        description: 'Miễn phí 01 phần Snack cho đơn hàng trên 100,000đ',
      },
      {
        id: 'bronze-3',
        icon: '🛍️',
        description: 'Đặc quyền Đổi Ưu đãi bằng điểm Loyalty tích lũy',
      },
    ],
  },
  {
    id: MembershipTier.SILVER,
    name: 'Bạc',
    color: '#9CA3AF',
    benefits: [
      {
        id: 'silver-1',
        icon: '🎂',
        description: 'Tặng 01 phần bánh sinh nhật',
      },
      {
        id: 'silver-2',
        icon: '⭐',
        description: 'Ưu đãi Mua 2 tặng 1',
      },
      {
        id: 'silver-3',
        icon: '🛍️',
        description: 'Đặc quyền Đổi Ưu đãi bằng điểm Loyalty tích lũy',
      },
    ],
  },
  {
    id: MembershipTier.GOLD,
    name: 'Vàng',
    color: '#D4AF37',
    benefits: [
      {
        id: 'gold-1',
        icon: '🎂',
        description: 'Tặng 01 phần bánh sinh nhật',
      },
      {
        id: 'gold-2',
        icon: '☕',
        description: 'Miễn phí 1 phần nước Cà phê / Trà',
      },
      {
        id: 'gold-3',
        icon: '🛍️',
        description: 'Đặc quyền Đổi Ưu đãi bằng điểm Loyalty tích lũy',
      },
    ],
  },
  {
    id: MembershipTier.DIAMOND,
    name: 'Kim Cương',
    color: '#1F2937',
    benefits: [
      {
        id: 'diamond-1',
        icon: '☕',
        description: 'Được nhận 1.5 Loyalty tích lũy',
      },
      {
        id: 'diamond-2',
        icon: '🎂',
        description: 'Tặng 01 phần bánh sinh nhật',
      },
      {
        id: 'diamond-3',
        icon: '🥤',
        description: 'Miễn phí 01 phần nước bất kì',
      },
      {
        id: 'diamond-4',
        icon: '🎫',
        description: 'Nhận riêng Ưu đãi từ Rốp Rẻng và đối tác khác',
      },
    ],
  },
];

export const MOCK_USER: MockUser = {
  currentTier: MembershipTier.BRONZE,
};