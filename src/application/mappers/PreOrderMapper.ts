import { PreOrder } from '../../domain/entities/PreOrder';
import { CreatePreOrderParams } from '../../domain/repositories/PreOrderRepository';
import { ConfirmOrderResponseDTO, CreatePreOrderRequestDTO, CreatePreOrderResponseDTO } from '../dto/PreOrderDTO';

export class PreOrderMapper {
  static toRequestDTO(params: CreatePreOrderParams): CreatePreOrderRequestDTO {
    const now = new Date().toISOString();
    const { user, store, deliveryAddress, items } = params;
    const userLat = deliveryAddress?.lat || 0;
    const userLng = deliveryAddress?.lng || 0;
    const userAddr = deliveryAddress?.detail || '';

    return {
      user_id: user.uuid,
      user_lat: userLat,
      user_lng: userLng,
      user_address: userAddr,
      store_id: store.id,
      store_lat: store.location.coordinates[1],
      store_lng: store.location.coordinates[0],
      store_address: store.address || '',
      user_name: user.displayName || '',
      shipping_type: params.orderType === 'DELIVERY' ? 'delivery' : 'pickup',
      payment_method: params.paymentMethod,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        size: item.size,
        ice: item.ice,
        sweetness: item.sweetness,
        toppings: item.toppings.map(t => ({ toppingIds: Number(t.id) })),
      })),
      vouchers: params.vouchers,
      promotions: params.promotions,
      dateTimeCreated: now,
      dateTimeUpdated: now,
    };
  }

  static toEntity(dto: CreatePreOrderResponseDTO): PreOrder {
    const { order } = dto;
    return {
      preorderId: 0,
      subtotal: order.summary.subtotal,
      discountAmount: order.summary.discount_amount,
      deliveryFee: order.summary.delivery_fee,
      finalAmount: order.summary.total,
      createdAt: new Date(),
      availableVouchers: order.available_vouchers?.map(v => ({
        code: v.code,
        name: v.name,
        description: v.description,
        discountAmount: v.discount_amount,
        type: v.type,
      }))
    };
  }

  static toConfirmEntity(dto: ConfirmOrderResponseDTO): PreOrder {
    const { order } = dto;
    return {
      preorderId: order.order_id,
      subtotal: order.summary.subtotal,
      discountAmount: order.summary.discount_amount,
      deliveryFee: order.summary.delivery_fee,
      finalAmount: order.summary.total,
      createdAt: new Date(),
    };
  }

  static toSerializable(entity: PreOrder) {
    return {
      preorderId: entity.preorderId,
      subtotal: entity.subtotal,
      discountAmount: entity.discountAmount,
      deliveryFee: entity.deliveryFee,
      finalAmount: entity.finalAmount,
      createdAt: entity.createdAt.toISOString(),
      availableVouchers: entity.availableVouchers,
    };
  }
}