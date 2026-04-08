export interface MenuAPIProductOptionGroupDTO {
  id: number;
  name: string;
  is_multi_select: boolean;
  is_required: boolean;
  is_topping: boolean;
  items: MenuAPIProductOptionDTO[];
}

export interface MenuAPIProductOptionDTO {
  id: number;
  option_group_id: number;
  name: string;
  additional_price: number;
  linked_product_id: number;
  is_active: boolean;
}
export interface MenuAPIProductDTO {
  id: number;
  sku: string;
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  base_price: string;
  is_active: number;
  product_type: string;
  points_required: number;
  created_at: string;
  option_groups: MenuAPIProductOptionGroupDTO[];
}

export interface MenuAPIItemDTO {
  id: number;
  menu_id: number;
  product_id: number;
  display_name: string;
  price: string;
  available: number;
  sort_order: number;
  meta: Record<string, unknown> | null;
  product: MenuAPIProductDTO;
}

export interface ProductDTO {
  menu_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  category_id: number;
  meta: Record<string, unknown> | null;
}

export interface StoreDTO {
  id: number;
  region_id: number;
  name: string;
  slug: string | null;
  address: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
  phone: string | null;
  email: string | null;
  timezone: string;
  is_active: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  current_loyalty_point: number;
}

export interface HomeMenuResponseDTO {
  code: number;
  message: string;
  data: {
    store_id?: number;
    store?: StoreDTO;
    menu_id?: number;
    products?: ProductDTO[];
    menu?: {
      id: number;
      store_id: number;
      items: MenuAPIItemDTO[];
      toppings: MenuAPIItemDTO[];
    };
  };
}

export const HOME_API_CODES = {
  SUCCESS: 1001,
} as const;