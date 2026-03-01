import { PreOrder, PreOrderItem } from '../entities/PreOrder';

export interface CreatePreOrderParams {
  user: { uuid: string; displayName: string | null };
  store: { id: number; name: string; address: string | null; location: { coordinates: [number, number] } };
  deliveryAddress: { lat: number; lng: number; detail: string } | null;
  orderType: 'DELIVERY' | 'TAKEAWAY';
  paymentMethod: string;
  items: PreOrderItem[];
  promotions: { promotionId: string }[];
  vouchers: { voucher_code: string }[];
}

export interface PreOrderRepository {
  create(params: CreatePreOrderParams): Promise<PreOrder>;
  confirm(params: CreatePreOrderParams): Promise<PreOrder>;
}