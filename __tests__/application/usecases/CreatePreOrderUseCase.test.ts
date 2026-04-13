import { CreatePreOrderUseCase } from '../../../src/application/usecases/CreatePreOrderUseCase';
import { PreOrderRepository, CreatePreOrderParams } from '../../../src/domain/repositories/PreOrderRepository';
import { PreOrder } from '../../../src/domain/entities/PreOrder';

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

function makeParams(overrides: Partial<CreatePreOrderParams> = {}): CreatePreOrderParams {
  return {
    user: { uuid: 'uuid-001', displayName: 'Nguyễn Văn A' },
    store: {
      id: 5,
      name: 'Store HCM',
      address: '123 Nguyễn Huệ',
      location: { coordinates: [106.6, 10.7] },
    },
    deliveryAddress: { lat: 10.7, lng: 106.6, detail: '123 Đường Test' },
    orderType: 'DELIVERY',
    paymentMethod: 'cash',
    items: [
      {
        menuItemId: '10',
        quantity: 2,
        size: 'medium',
        ice: 'normal',
        sweetness: 'normal',
        toppings: [],
      },
    ],
    promotions: [],
    vouchers: [],
    ...overrides,
  };
}

function makeRepository(overrides: Partial<PreOrderRepository> = {}): PreOrderRepository {
  return {
    create: jest.fn().mockResolvedValue(makePreOrder()),
    confirm: jest.fn().mockResolvedValue(makePreOrder()),
    ...overrides,
  };
}

describe('CreatePreOrderUseCase', () => {
  it('calls repository.create with provided params', async () => {
    const repo = makeRepository();
    const useCase = new CreatePreOrderUseCase(repo);
    const params = makeParams();

    await useCase.execute(params);

    expect(repo.create).toHaveBeenCalledWith(params);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('returns PreOrder from repository', async () => {
    const repo = makeRepository({
      create: jest.fn().mockResolvedValue(makePreOrder({ finalAmount: 85000 })),
    });
    const useCase = new CreatePreOrderUseCase(repo);

    const result = await useCase.execute(makeParams());

    expect(result.preorderId).toBe(1);
    expect(result.finalAmount).toBe(85000);
  });

  it('handles TAKEAWAY order type (null deliveryAddress)', async () => {
    const repo = makeRepository();
    const useCase = new CreatePreOrderUseCase(repo);
    const params = makeParams({ orderType: 'TAKEAWAY', deliveryAddress: null });

    await useCase.execute(params);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      orderType: 'TAKEAWAY',
      deliveryAddress: null,
    }));
  });

  it('passes vouchers to repository', async () => {
    const repo = makeRepository();
    const useCase = new CreatePreOrderUseCase(repo);
    const params = makeParams({ vouchers: [{ voucher_code: 'PROMO10' }] });

    await useCase.execute(params);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      vouchers: [{ voucher_code: 'PROMO10' }],
    }));
  });

  it('propagates repository errors', async () => {
    const repo = makeRepository({
      create: jest.fn().mockRejectedValue(new Error('Pre-order creation failed')),
    });
    const useCase = new CreatePreOrderUseCase(repo);

    await expect(useCase.execute(makeParams())).rejects.toThrow('Pre-order creation failed');
  });

  it('returns pre-order with available vouchers', async () => {
    const preOrder = makePreOrder({
      availableVouchers: [
        { code: 'SUMMER10', name: 'Giảm hè', description: null, discountAmount: 10000, type: 'percent' },
      ],
    });
    const repo = makeRepository({ create: jest.fn().mockResolvedValue(preOrder) });
    const useCase = new CreatePreOrderUseCase(repo);

    const result = await useCase.execute(makeParams());

    expect(result.availableVouchers).toHaveLength(1);
    expect(result.availableVouchers![0].code).toBe('SUMMER10');
  });
});
