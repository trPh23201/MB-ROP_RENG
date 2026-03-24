import { Product } from '../../../domain/entities/Product';
import { OrderType } from '../../../domain/shared';

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

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    customizations: CartItemCustomization;
    finalPrice: number;
}

export interface OrderDisplayItem {
    id: string | number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: OrderItemOptions;
    originalItem?: unknown;
}

export interface OrderItemOptions {
    size: string;
    ice: string;
    sweetness: string;
    toppings: OrderToppingOption[];
}

export interface OrderToppingOption {
    id: string;
    name: string;
    price?: number;
}

export interface OrderProductItemProps {
    item: OrderDisplayItem;
    onPress?: (item: OrderDisplayItem) => void;
    editable?: boolean;
}

export interface OrderProductListProps {
    items: OrderDisplayItem[];
    title?: string;
    onItemPress?: (item: OrderDisplayItem) => void;
    onAddMore?: () => void;
    showAddButton?: boolean;
    editable?: boolean;
    emptyText?: string;
}

export interface OrderPriceSectionProps {
    subtotal: number;
    shippingFee: number;
    discountAmount?: number;
    onPromotionPress?: () => void;
    showPromotionButton?: boolean;
}

export interface OrderAddressCardProps {
    orderType: OrderType;
    address?: {
        name: string;
        full: string;
    } | null;
    onChangeAddress?: () => void;
    editable?: boolean;
}

export interface OrderFooterProps {
    orderType: OrderType;
    totalItems: number;
    totalPrice: number;
    buttonText: string;
    onButtonPress: () => void;
    disabled?: boolean;
}

export interface OrderTypeSelectorProps {
    selectedType: OrderType;
    store?: {
        name: string;
        address?: string | null;
    } | null;
    onPress?: () => void;
    editable?: boolean;
}
