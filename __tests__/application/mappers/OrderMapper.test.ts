import { OrderMapper } from '../../../src/application/mappers/OrderMapper';
import { OrderDTO, OrderItemDTO } from '../../../src/application/dto/OrderDTO';

function makeOrderItemDTO(overrides: Partial<OrderItemDTO> = {}): OrderItemDTO {
  return {
    id: 1,
    order_id: 100,
    product_id: 10,
    menu_item_id: 20,
    name: 'Cà phê sữa đá',
    qty: 2,
    unit_price: '35000',
    total_price: '70000',
    options: { size: 'medium', ice: 'normal', sweetness: 'normal', toppings: [] },
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeOrderDTO(overrides: Partial<OrderDTO> = {}): OrderDTO {
  return {
    id: 100,
    order_code: 'ORD-001',
    user_id: 1,
    store_id: 5,
    staff_user_id: null,
    pos_id: null,
    source: 'app',
    subtotal: '70000',
    total_amount: '70000',
    delivery_fee: '15000',
    discount_amount: '0',
    final_amount: '85000',
    payment_method: 'cash',
    payment_status: 'pending',
    order_status: 'pending',
    address: null,
    contact_name: null,
    contact_phone: null,
    note: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    deleted_at: null,
    order_items: [makeOrderItemDTO()],
    ...overrides,
  };
}

describe('OrderMapper.toDomain', () => {
  it('maps DTO to Order entity correctly', () => {
    const order = OrderMapper.toDomain(makeOrderDTO());
    expect(order.id).toBe(100);
    expect(order.orderCode).toBe('ORD-001');
    expect(order.userId).toBe(1);
    expect(order.storeId).toBe(5);
  });

  it('parses string amounts to numbers', () => {
    const order = OrderMapper.toDomain(makeOrderDTO({
      subtotal: '70000',
      total_amount: '70000',
      delivery_fee: '15000',
      discount_amount: '0',
      final_amount: '85000',
    }));
    expect(order.subtotal).toBe(70000);
    expect(order.deliveryFee).toBe(15000);
    expect(order.finalAmount).toBe(85000);
    expect(typeof order.subtotal).toBe('number');
  });

  it('maps order_items to items array', () => {
    const order = OrderMapper.toDomain(makeOrderDTO());
    expect(order.items).toHaveLength(1);
    expect(order.items[0].name).toBe('Cà phê sữa đá');
  });

  it('handles empty order_items', () => {
    const order = OrderMapper.toDomain(makeOrderDTO({ order_items: [] }));
    expect(order.items).toHaveLength(0);
  });

  it('handles undefined order_items as empty array', () => {
    const order = OrderMapper.toDomain(makeOrderDTO({ order_items: undefined }));
    expect(order.items).toHaveLength(0);
  });
});

describe('OrderMapper.itemToDomain', () => {
  it('maps OrderItemDTO to OrderItem correctly', () => {
    const item = OrderMapper.itemToDomain(makeOrderItemDTO());
    expect(item.id).toBe(1);
    expect(item.orderId).toBe(100);
    expect(item.menuItemId).toBe(20);
    expect(item.qty).toBe(2);
  });

  it('parses string prices to numbers', () => {
    const item = OrderMapper.itemToDomain(makeOrderItemDTO({
      unit_price: '35000',
      total_price: '70000',
    }));
    expect(item.unitPrice).toBe(35000);
    expect(item.totalPrice).toBe(70000);
    expect(typeof item.unitPrice).toBe('number');
  });

  it('allows null productId', () => {
    const item = OrderMapper.itemToDomain(makeOrderItemDTO({ product_id: null }));
    expect(item.productId).toBeNull();
  });

  it('maps options correctly', () => {
    const item = OrderMapper.itemToDomain(makeOrderItemDTO({
      options: { size: 'large', ice: 'less', sweetness: 'more', toppings: ['topping1'] },
    }));
    expect(item.options.size).toBe('large');
    expect(item.options.toppings).toHaveLength(1);
  });
});
