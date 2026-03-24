import { OrderType } from '../../../domain/shared';
import { ICE_LABELS, SIZE_LABELS, SWEETNESS_LABELS } from './OrderConstants';
import { OrderDisplayItem, OrderItemOptions } from './OrderInterfaces';

export class OrderService {
    static formatPrice(price: number): string {
        return `${price.toLocaleString('vi-VN')}đ`;
    }

    static calculateTotalPrice(subtotal: number, shippingFee: number, discountAmount: number = 0): number {
        return Math.max(0, subtotal + shippingFee - discountAmount);
    }
    static getSizeLabel(size: string): string {
        return SIZE_LABELS[size] || size;
    }

    static getIceLabel(ice: string): string {
        return ICE_LABELS[ice] || ice;
    }

    static getSweetnessLabel(sweetness: string): string {
        return SWEETNESS_LABELS[sweetness] || sweetness;
    }

    static formatOptionsText(options: OrderItemOptions): string {
        const parts: string[] = [];

        if (options.size) {
            parts.push(this.getSizeLabel(options.size));
        }
        if (options.ice) {
            parts.push(this.getIceLabel(options.ice));
        }
        if (options.sweetness) {
            parts.push(this.getSweetnessLabel(options.sweetness));
        }

        return parts.join(' · ');
    }

    static getOrderTypeIcon(orderType: OrderType): string {
        switch (orderType) {
            case OrderType.DELIVERY:
                return 'bicycle-outline';
            case OrderType.TAKEAWAY:
                return 'bag-handle-outline';
            case OrderType.DINE_IN:
                return 'restaurant-outline';
            default:
                return 'help-circle-outline';
        }
    }

    static getTotalItemsCount(items: OrderDisplayItem[]): number {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }
}
