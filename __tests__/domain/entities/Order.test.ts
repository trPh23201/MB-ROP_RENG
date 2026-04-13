import { Order, OrderItem } from '../../../src/domain/entities/Order';

function makeOrderItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    id: 1,
    orderId: 100,
    productId: 10,
    menuItemId: 20,
    name: 'Cà phê sữa đá',
    qty: 2,
    unitPrice: 35000,
    totalPrice: 70000,
    options: { size: 'medium', ice: 'normal', sweetness: 'normal', toppings: [] },
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 100,
    orderCode: 'ORD-001',
    userId: 1,
    storeId: 5,
    source: 'app',
    subtotal: 70000,
    totalAmount: 70000,
    deliveryFee: 15000,
    discountAmount: 0,
    finalAmount: 85000,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    address: null,
    contactName: null,
    contactPhone: null,
    note: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: null,
    deletedAt: null,
    items: [makeOrderItem()],
    ...overrides,
  };
}

describe('Order entity', () => {
  it('creates an order with required fields', () => {
    const order = makeOrder();
    expect(order.id).toBe(100);
    expect(order.orderCode).toBe('ORD-001');
    expect(order.finalAmount).toBe(85000);
  });

  it('calculates finalAmount = subtotal + deliveryFee - discount', () => {
    const order = makeOrder({
      subtotal: 100000,
      deliveryFee: 20000,
      discountAmount: 10000,
      finalAmount: 110000,
    });
    expect(order.finalAmount).toBe(order.subtotal + order.deliveryFee - order.discountAmount);
  });

  it('stores order items', () => {
    const items = [makeOrderItem({ id: 1 }), makeOrderItem({ id: 2, qty: 1, totalPrice: 35000 })];
    const order = makeOrder({ items });
    expect(order.items).toHaveLength(2);
    expect(order.items[0].qty).toBe(2);
    expect(order.items[1].qty).toBe(1);
  });

  it('allows null address for takeaway', () => {
    const order = makeOrder({ address: null });
    expect(order.address).toBeNull();
  });

  it('allows null deletedAt for active orders', () => {
    const order = makeOrder({ deletedAt: null });
    expect(order.deletedAt).toBeNull();
  });

  it('stores various payment statuses', () => {
    const paid = makeOrder({ paymentStatus: 'paid' });
    expect(paid.paymentStatus).toBe('paid');
  });

  it('stores various order statuses', () => {
    const completed = makeOrder({ orderStatus: 'completed' });
    expect(completed.orderStatus).toBe('completed');
  });
});

describe('OrderItem entity', () => {
  it('creates an order item with required fields', () => {
    const item = makeOrderItem();
    expect(item.id).toBe(1);
    expect(item.name).toBe('Cà phê sữa đá');
    expect(item.qty).toBe(2);
    expect(item.totalPrice).toBe(70000);
  });

  it('allows null productId', () => {
    const item = makeOrderItem({ productId: null });
    expect(item.productId).toBeNull();
  });

  it('stores item options', () => {
    const item = makeOrderItem({
      options: { size: 'large', ice: 'less', sweetness: 'more', toppings: ['topping1'] },
    });
    expect(item.options.size).toBe('large');
    expect(item.options.toppings).toHaveLength(1);
  });
});
