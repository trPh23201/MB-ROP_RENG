import { PreOrder, PreOrderItem, AvailableVoucher } from '../../../src/domain/entities/PreOrder';

function makePreOrder(overrides: Partial<PreOrder> = {}): PreOrder {
  return {
    preorderId: 1,
    subtotal: 70000,
    discountAmount: 0,
    deliveryFee: 15000,
    finalAmount: 85000,
    createdAt: new Date('2024-01-01'),
    availableVouchers: [],
    ...overrides,
  };
}

function makePreOrderItem(overrides: Partial<PreOrderItem> = {}): PreOrderItem {
  return {
    menuItemId: '10',
    quantity: 2,
    size: 'medium',
    ice: 'normal',
    sweetness: 'normal',
    toppings: [],
    ...overrides,
  };
}

describe('PreOrder entity', () => {
  it('creates a pre-order with required fields', () => {
    const preOrder = makePreOrder();
    expect(preOrder.preorderId).toBe(1);
    expect(preOrder.subtotal).toBe(70000);
    expect(preOrder.finalAmount).toBe(85000);
  });

  it('finalAmount = subtotal + deliveryFee - discountAmount', () => {
    const preOrder = makePreOrder({
      subtotal: 100000,
      deliveryFee: 20000,
      discountAmount: 10000,
      finalAmount: 110000,
    });
    const calculated = preOrder.subtotal + preOrder.deliveryFee - preOrder.discountAmount;
    expect(preOrder.finalAmount).toBe(calculated);
  });

  it('has empty availableVouchers by default', () => {
    const preOrder = makePreOrder({ availableVouchers: [] });
    expect(preOrder.availableVouchers).toHaveLength(0);
  });

  it('stores available vouchers when provided', () => {
    const voucher: AvailableVoucher = {
      code: 'SUMMER10',
      name: 'Giảm hè 10%',
      description: null,
      discountAmount: 10000,
      type: 'percent',
    };
    const preOrder = makePreOrder({ availableVouchers: [voucher] });
    expect(preOrder.availableVouchers).toHaveLength(1);
    expect(preOrder.availableVouchers![0].code).toBe('SUMMER10');
  });

  it('createdAt is a Date', () => {
    const preOrder = makePreOrder();
    expect(preOrder.createdAt).toBeInstanceOf(Date);
  });

  it('allows zero discountAmount', () => {
    const preOrder = makePreOrder({ discountAmount: 0 });
    expect(preOrder.discountAmount).toBe(0);
  });
});

describe('PreOrderItem entity', () => {
  it('creates a valid pre-order item', () => {
    const item = makePreOrderItem();
    expect(item.menuItemId).toBe('10');
    expect(item.quantity).toBe(2);
    expect(item.size).toBe('medium');
  });

  it('accepts size variants', () => {
    expect(makePreOrderItem({ size: 'small' }).size).toBe('small');
    expect(makePreOrderItem({ size: 'large' }).size).toBe('large');
  });

  it('accepts ice variants', () => {
    expect(makePreOrderItem({ ice: 'separate' }).ice).toBe('separate');
    expect(makePreOrderItem({ ice: 'less' }).ice).toBe('less');
  });

  it('accepts sweetness variants', () => {
    expect(makePreOrderItem({ sweetness: 'less' }).sweetness).toBe('less');
    expect(makePreOrderItem({ sweetness: 'more' }).sweetness).toBe('more');
  });

  it('stores toppings', () => {
    const item = makePreOrderItem({
      toppings: [{ id: 't1', name: 'Trân châu', price: 5000 }],
    });
    expect(item.toppings).toHaveLength(1);
    expect(item.toppings[0].price).toBe(5000);
  });

  it('allows empty toppings', () => {
    const item = makePreOrderItem({ toppings: [] });
    expect(item.toppings).toHaveLength(0);
  });
});
