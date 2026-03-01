export interface PreOrder {
  readonly preorderId: number;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly deliveryFee: number;
  readonly finalAmount: number;
  readonly createdAt: Date;
  readonly availableVouchers?: AvailableVoucher[];
}

export interface AvailableVoucher {
  code: string;
  name: string;
  description: string | null;
  discountAmount: number;
  type: string;
}

export interface PreOrderItem {
  menuItemId: string;
  quantity: number;
  size: 'small' | 'medium' | 'large';
  ice: 'normal' | 'separate' | 'less';
  sweetness: 'normal' | 'less' | 'more';
  toppings: {
    id: string;
    name: string;
    price: number;
  }[];
}