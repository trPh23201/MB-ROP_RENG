import { Product } from '../entities/Product';
import { Store } from '../entities/Store';
import { Voucher } from '../entities/Voucher';

export interface HomeMenuParams {
  lat: number;
  lng: number;
  limit?: number;
  page?: number;
}

export interface HomeMenuResult {
  storeId: number;
  store: Store;
  menuId: number;
  products: Product[];
  toppings: Product[];
}

export interface MenuByStoreResult {
  menuId: number;
  storeId: number;
  products: Product[];
  toppings: Product[];
}

export interface VouchersParams {
  lat: number;
  lng: number;
  limit?: number;
  page?: number;
}

export interface VouchersResult {
  storeId: number;
  vouchers: Voucher[];
}

export interface HomeRepository {
  getHomeMenu(params: HomeMenuParams): Promise<HomeMenuResult>;
  getMenuByStore(storeId: number): Promise<MenuByStoreResult>;
  getVouchers(params: VouchersParams): Promise<VouchersResult>;
}