import { CartItem } from '../../screens/order/OrderInterfaces';
import { OrderDisplayItem } from './OrderInterfaces';

export class OrderMapper {
    static mapCartItemToDisplayItem(item: CartItem): OrderDisplayItem {
        return {
            id: item.id,
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.finalPrice,
            options: {
                size: item.customizations.size,
                ice: item.customizations.ice,
                sweetness: item.customizations.sweetness,
                toppings: item.customizations.toppings.map(t => ({
                    id: t.id.toString(),
                    name: t.name,
                    price: t.price
                }))
            },
            originalItem: item
        };
    }

    static mapCartItemsToDisplayItems(items: CartItem[]): OrderDisplayItem[] {
        return items.map(this.mapCartItemToDisplayItem);
    }
}
