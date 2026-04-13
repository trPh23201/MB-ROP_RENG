import { Voucher, calculateVoucherDiscount } from '../../../src/domain/entities/Voucher';

function makeVoucher(overrides: Partial<Voucher> = {}): Voucher {
  return {
    id: 1,
    code: 'PROMO10',
    name: 'Giảm 10%',
    type: 'percent',
    description: null,
    rules: { percent: 10 },
    canCombine: false,
    startAt: '2024-01-01T00:00:00Z',
    endAt: '2025-01-01T00:00:00Z',
    isValid: true,
    ...overrides,
  };
}

describe('calculateVoucherDiscount (entity function)', () => {
  it('returns 0 when voucher is not valid', () => {
    const voucher = makeVoucher({ isValid: false });
    expect(calculateVoucherDiscount(voucher, 100000)).toBe(0);
  });

  it('applies fixed discount', () => {
    const voucher = makeVoucher({ type: 'fixed', rules: { amount: 20000 }, isValid: true });
    expect(calculateVoucherDiscount(voucher, 100000)).toBe(20000);
  });

  it('applies percent discount and floors result', () => {
    const voucher = makeVoucher({ type: 'percent', rules: { percent: 10 }, isValid: true });
    expect(calculateVoucherDiscount(voucher, 99999)).toBe(9999);
  });

  it('returns 0 when no rules match', () => {
    const voucher = makeVoucher({ rules: {}, isValid: true });
    expect(calculateVoucherDiscount(voucher, 100000)).toBe(0);
  });
});
