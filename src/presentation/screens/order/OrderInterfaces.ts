import { Product } from '../../../domain/entities/Product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customizations: CartItemCustomization;
  finalPrice: number;
}

export interface OrderHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
  address: string;
}

export interface CategorySidebarProps {
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
  onCategoryPress: (categoryId: string) => void;
}

export interface ProductListProps {
  sections: { categoryId: string; categoryName: string; data: Product[] }[];
  onScroll: (categoryId: string) => void;
  onAddToCart: (product: Product) => void;
  scrollRef: React.RefObject<any>;
}

export interface ProductItemProps {
  product: Product;
  onAdd: () => void;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItemCustomization {
  size: 'small' | 'medium' | 'large';
  ice: 'normal' | 'separate' | 'less';
  sweetness: 'normal' | 'less' | 'more';
  toppings: Topping[];
}

export const CART_DEFAULTS: CartItemCustomization = {
  size: 'medium',
  ice: 'separate',
  sweetness: 'normal',
  toppings: [],
};