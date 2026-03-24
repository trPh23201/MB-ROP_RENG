export interface CreatePreOrderRequestDTO {
  user_id: string;
  user_lat: number;
  user_lng: number;
  user_address: string;
  store_id: number;
  store_lat: number;
  store_lng: number;
  store_address: string;
  user_name: string;
  shipping_type: string;
  payment_method: string;
  items: {
    menuItemId: string;
    quantity: number;
    size: string;
    ice: string;
    sweetness: string;
    toppings: { toppingIds: number }[];
  }[];
  vouchers: { voucher_code: string }[];
  promotions: { promotionId: string }[];
  dateTimeCreated: string;
  dateTimeUpdated: string;
}

export interface CreatePreOrderResponseDTO {
  order: {
    summary: {
      subtotal: number;
      discount_amount: number;
      delivery_fee: number;
      total: number;
    };
    available_vouchers: {
      code: string;
      name: string;
      description: string | null;
      discount_amount: number;
      type: string;
    }[];
  };
}

export type ConfirmOrderRequestDTO = CreatePreOrderRequestDTO;

export interface ConfirmOrderResponseDTO {
  order: {
    order_id: number;
    summary: {
      subtotal: number;
      discount_amount: number;
      delivery_fee: number;
      total: number;
    };
  };
}