import { ConfirmOrderService } from '../../../src/domain/services/ConfirmOrderService';
import { ConfirmOrder } from '../../../src/domain/entities/ConfirmOrder';
import { ConfirmOrderItem } from '../../../src/domain/entities/ConfirmOrderItem';

function makeItem(overrides: Partial<ConfirmOrderItem> = {}): ConfirmOrderItem {
  return {
    id: 1,
    orderId: 100,
    productId: 10,
    menuItemId: 20,
    name: 'Cà phê sữa đá',
    quantity: 2,
    unitPrice: 35000,
    totalPrice: 70000,
    options: { size: 'medium', ice: 'normal', sweetness: 'normal', toppings: [] },
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

function makeOrder(overrides: Partial<ConfirmOrder> = {}): ConfirmOrder {
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
    items: [makeItem()],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

describe('ConfirmOrderService.hasDeliveryAddress', () => {
  it('returns false when address is null', () => {
    const order = makeOrder({ address: null });
    expect(ConfirmOrderService.hasDeliveryAddress(order)).toBe(false);
  });

  it('returns true when address has detail', () => {
    const order = makeOrder({
      address: { lat: 10.7, lng: 106.6, detail: '123 Nguyễn Huệ' },
    });
    expect(ConfirmOrderService.hasDeliveryAddress(order)).toBe(true);
  });

  it('returns false when address detail is empty', () => {
    const order = makeOrder({
      address: { lat: 10.7, lng: 106.6, detail: '' },
    });
    expect(ConfirmOrderService.hasDeliveryAddress(order)).toBe(false);
  });
});

describe('ConfirmOrderService.hasDiscount', () => {
  it('returns true when discountAmount > 0', () => {
    const order = makeOrder({ discountAmount: 10000 });
    expect(ConfirmOrderService.hasDiscount(order)).toBe(true);
  });

  it('returns false when discountAmount is 0', () => {
    const order = makeOrder({ discountAmount: 0 });
    expect(ConfirmOrderService.hasDiscount(order)).toBe(false);
  });
});

describe('ConfirmOrderService.getTotalItemsCount', () => {
  it('sums quantities across all items', () => {
    const items = [makeItem({ quantity: 2 }), makeItem({ id: 2, quantity: 3 })];
    const order = makeOrder({ items });
    expect(ConfirmOrderService.getTotalItemsCount(order)).toBe(5);
  });

  it('returns 0 for empty items', () => {
    const order = makeOrder({ items: [] });
    expect(ConfirmOrderService.getTotalItemsCount(order)).toBe(0);
  });
});

describe('ConfirmOrderService.canConfirm', () => {
  it('returns valid when items exist and finalAmount > 0', () => {
    const order = makeOrder();
    const result = ConfirmOrderService.canConfirm(order);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns invalid when items array is empty', () => {
    const order = makeOrder({ items: [] });
    const result = ConfirmOrderService.canConfirm(order);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('sản phẩm');
  });

  it('returns invalid when finalAmount is 0', () => {
    const order = makeOrder({ finalAmount: 0 });
    const result = ConfirmOrderService.canConfirm(order);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('ConfirmOrderService.canRemoveItem', () => {
  it('returns true when more than 1 item', () => {
    const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
    const order = makeOrder({ items });
    expect(ConfirmOrderService.canRemoveItem(order)).toBe(true);
  });

  it('returns false when only 1 item', () => {
    const order = makeOrder({ items: [makeItem()] });
    expect(ConfirmOrderService.canRemoveItem(order)).toBe(false);
  });
});

describe('ConfirmOrderService.withUpdatedItems', () => {
  it('recalculates subtotal and finalAmount from new items', () => {
    const order = makeOrder({ deliveryFee: 15000, discountAmount: 0 });
    const newItems = [makeItem({ totalPrice: 50000 }), makeItem({ id: 2, totalPrice: 30000 })];
    const updated = ConfirmOrderService.withUpdatedItems(order, newItems);

    expect(updated.subtotal).toBe(80000);
    expect(updated.finalAmount).toBe(80000 + 15000 - 0);
    expect(updated.items).toHaveLength(2);
  });

  it('applies discount when recalculating', () => {
    const order = makeOrder({ deliveryFee: 10000, discountAmount: 5000 });
    const newItems = [makeItem({ totalPrice: 60000 })];
    const updated = ConfirmOrderService.withUpdatedItems(order, newItems);

    expect(updated.finalAmount).toBe(60000 + 10000 - 5000);
  });

  it('clamps finalAmount to 0 minimum', () => {
    const order = makeOrder({ deliveryFee: 0, discountAmount: 100000 });
    const newItems = [makeItem({ totalPrice: 10000 })];
    const updated = ConfirmOrderService.withUpdatedItems(order, newItems);

    expect(updated.finalAmount).toBe(0);
  });
});
