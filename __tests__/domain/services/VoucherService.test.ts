import { VoucherService } from '../../../src/domain/services/VoucherService';
import { Voucher } from '../../../src/domain/entities/Voucher';

function makeVoucher(overrides: Partial<Voucher> = {}): Voucher {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    id: 1,
    code: 'PROMO10',
    name: 'Giảm 10%',
    type: 'percent',
    description: null,
    rules: { percent: 10 },
    canCombine: false,
    startAt: yesterday.toISOString(),
    endAt: tomorrow.toISOString(),
    isValid: true,
    ...overrides,
  };
}

describe('VoucherService.isValid', () => {
  it('returns true for active voucher (now between start and end)', () => {
    const voucher = makeVoucher();
    expect(VoucherService.isValid(voucher)).toBe(true);
  });

  it('returns false for expired voucher', () => {
    const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const pastPlus1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const voucher = makeVoucher({
      startAt: past.toISOString(),
      endAt: pastPlus1.toISOString(),
    });
    expect(VoucherService.isValid(voucher)).toBe(false);
  });

  it('returns false for pending voucher (starts in future)', () => {
    const future1 = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const future2 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const voucher = makeVoucher({
      startAt: future1.toISOString(),
      endAt: future2.toISOString(),
    });
    expect(VoucherService.isValid(voucher)).toBe(false);
  });
});

describe('VoucherService.isExpired', () => {
  it('returns true for past voucher', () => {
    const past1 = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const past2 = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const voucher = makeVoucher({
      startAt: past1.toISOString(),
      endAt: past2.toISOString(),
    });
    expect(VoucherService.isExpired(voucher)).toBe(true);
  });

  it('returns false for currently active voucher', () => {
    const voucher = makeVoucher();
    expect(VoucherService.isExpired(voucher)).toBe(false);
  });
});

describe('VoucherService.isPending', () => {
  it('returns true for future voucher', () => {
    const future1 = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const future2 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const voucher = makeVoucher({
      startAt: future1.toISOString(),
      endAt: future2.toISOString(),
    });
    expect(VoucherService.isPending(voucher)).toBe(true);
  });

  it('returns false for active voucher', () => {
    const voucher = makeVoucher();
    expect(VoucherService.isPending(voucher)).toBe(false);
  });
});

describe('VoucherService.calculateDiscount', () => {
  it('calculates fixed discount correctly', () => {
    const voucher = makeVoucher({ type: 'fixed', rules: { amount: 20000 } });
    expect(VoucherService.calculateDiscount(voucher, 100000)).toBe(20000);
  });

  it('caps fixed discount to orderTotal', () => {
    const voucher = makeVoucher({ type: 'fixed', rules: { amount: 150000 } });
    expect(VoucherService.calculateDiscount(voucher, 100000)).toBe(100000);
  });

  it('calculates percent discount correctly', () => {
    const voucher = makeVoucher({ type: 'percent', rules: { percent: 10 } });
    // 100000 * 10 / 100 = 10000
    expect(VoucherService.calculateDiscount(voucher, 100000)).toBe(10000);
  });

  it('floors percent discount result', () => {
    const voucher = makeVoucher({ type: 'percent', rules: { percent: 10 } });
    // 99999 * 10 / 100 = 9999.9 => floor = 9999
    expect(VoucherService.calculateDiscount(voucher, 99999)).toBe(9999);
  });

  it('returns 0 for expired/invalid voucher', () => {
    const past1 = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const past2 = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const voucher = makeVoucher({
      startAt: past1.toISOString(),
      endAt: past2.toISOString(),
      type: 'percent',
      rules: { percent: 10 },
    });
    expect(VoucherService.calculateDiscount(voucher, 100000)).toBe(0);
  });

  it('returns 0 when no applicable rule', () => {
    const voucher = makeVoucher({ rules: {} });
    expect(VoucherService.calculateDiscount(voucher, 100000)).toBe(0);
  });
});

describe('VoucherService.getDaysUntilExpiry', () => {
  it('returns positive days for future expiry', () => {
    const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const voucher = makeVoucher({ endAt: future.toISOString() });
    const days = VoucherService.getDaysUntilExpiry(voucher);
    expect(days).toBeGreaterThanOrEqual(3);
    expect(days).toBeLessThanOrEqual(4);
  });

  it('returns negative days for past expiry', () => {
    const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const voucher = makeVoucher({ endAt: past.toISOString() });
    const days = VoucherService.getDaysUntilExpiry(voucher);
    expect(days).toBeLessThan(0);
  });
});
