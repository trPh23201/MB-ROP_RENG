import { PreOrderItem } from '../../../domain/entities/PreOrder';
import { CreatePreOrderParams } from '../../../domain/repositories/PreOrderRepository';
import { DeliveryAddress, OrderType, PaymentMethod, PreOrderState } from '../../../domain/shared';
import { SerializableConfirmOrder } from '../../../state/slices/confirmOrderSlice';
import { CartItem } from '../order/OrderInterfaces';

export class PreOrderService {
  static calculateTotalPrice(subtotal: number, shippingFee: number): number {
    return subtotal + shippingFee;
  }

  static formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')}đ`;
  }

  static isPaymentMethodAvailable(method: PaymentMethod): boolean {
    return method === PaymentMethod.CASH;
  }

  static validateOrder(itemsCount: number, storeId: string | null, paymentMethod: PaymentMethod): { valid: boolean; error?: string } {
    if (itemsCount === 0) {
      return { valid: false, error: 'Giỏ hàng trống' };
    }

    if (!storeId) {
      return { valid: false, error: 'Chưa chọn cửa hàng' };
    }

    if (!this.isPaymentMethodAvailable(paymentMethod)) {
      return { valid: false, error: 'Phương thức thanh toán không khả dụng' };
    }

    return { valid: true };
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

  static getPaymentMethodIcon(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CASH:
        return 'cash-outline';
      case PaymentMethod.VNPAY:
        return 'card-outline';
      case PaymentMethod.MOMO:
        return 'wallet-outline';
      default:
        return 'help-circle-outline';
    }
  }

  static createPreOrderPayload(
    user: { uuid: string; displayName: string | null },
    store: any,
    deliveryAddress: DeliveryAddress | null,
    cartItems: CartItem[],
    preOrderState: PreOrderState,
    vouchers: { code: string }[] = []
  ): CreatePreOrderParams {
    const items: PreOrderItem[] = cartItems.map(item => ({
      menuItemId: item.product.menuItemId?.toString() || item.product.id,
      quantity: item.quantity,
      size: item.customizations.size,
      ice: item.customizations.ice,
      sweetness: item.customizations.sweetness,
      toppings: item.customizations.toppings,
    }));

    const storeIdNumber = typeof store.id === 'string' ? (parseInt(store.id.replace(/\D/g, '')) || 0) : store.id;
    const storeLocation = store.location?.coordinates
      ? store.location
      : { coordinates: [store.longitude || 0, store.latitude || 0] as [number, number] };

    const adaptedStore = {
      id: storeIdNumber,
      name: store.name,
      address: store.address,
      location: storeLocation
    };

    return {
      user: { uuid: user.uuid, displayName: user.displayName },
      store: adaptedStore,
      deliveryAddress: deliveryAddress,
      orderType: preOrderState.orderType === OrderType.DELIVERY ? 'DELIVERY' : 'TAKEAWAY',
      paymentMethod: preOrderState.paymentMethod,
      items,
      promotions: [],
      vouchers: vouchers.map(v => ({ voucher_code: v.code })),
    };
  }

  static synthesizeConfirmedOrder(
    pricingResult: { subtotal: number; finalAmount: number; deliveryFee: number; discountAmount: number },
    user: { id: number; displayName: string | null; phone: string },
    store: any,
    deliveryAddress: DeliveryAddress | null,
    cartItems: CartItem[],
    preOrderState: PreOrderState
  ): SerializableConfirmOrder {
    const syntheticId = Date.now();
    const storeIdNumber = typeof store.id === 'string' ? (parseInt(store.id.replace(/\D/g, '')) || 0) : store.id;

    let addressData = null;
    if (deliveryAddress) {
      addressData = {
        lat: deliveryAddress.lat,
        lng: deliveryAddress.lng,
        detail: deliveryAddress.addressString || ''
      };
    } else {
      const lat = store.latitude || store.location?.coordinates?.[1] || 0;
      const lng = store.longitude || store.location?.coordinates?.[0] || 0;
      addressData = {
        lat: lat,
        lng: lng,
        detail: store.address || ''
      };
    }

    return {
      id: syntheticId,
      orderCode: `DRAFT-${syntheticId.toString().slice(-6)}`,
      userId: user.id || 0,
      storeId: storeIdNumber,
      source: 'MOBILE_APP',
      subtotal: pricingResult.subtotal,
      totalAmount: pricingResult.finalAmount,
      deliveryFee: pricingResult.deliveryFee,
      discountAmount: pricingResult.discountAmount,
      finalAmount: pricingResult.finalAmount,
      paymentMethod: preOrderState.paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'DRAFT',
      address: addressData,
      contactName: user.displayName,
      contactPhone: user.phone,
      note: '',
      items: cartItems.map((item, index) => ({
        id: syntheticId + index,
        orderId: syntheticId,
        productId: item.product.productId || parseInt(item.product.id) || 0,
        menuItemId: item.product.menuItemId || parseInt(item.product.id) || 0,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.finalPrice,
        options: {
          size: item.customizations.size,
          ice: item.customizations.ice,
          sweetness: item.customizations.sweetness,
          toppings: item.customizations.toppings
        },
        createdAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}