import { GetBrandsUseCase } from '../../../src/application/usecases/GetBrandsUseCase';
import { BrandRepository, BrandsResult } from '../../../src/domain/repositories/BrandRepository';
import { Brand } from '../../../src/domain/entities/Brand';

function makeBrand(overrides: Partial<Brand> = {}): Brand {
  return {
    id: 1,
    name: 'Brand A',
    logoUrl: null,
    description: 'Brand description',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    deletedAt: null,
    colors: [],
    ...overrides,
  };
}

function makeBrandsResult(overrides: Partial<BrandsResult> = {}): BrandsResult {
  return {
    brands: [makeBrand()],
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
    ...overrides,
  };
}

function makeRepository(overrides: Partial<BrandRepository> = {}): BrandRepository {
  return {
    getBrands: jest.fn().mockResolvedValue(makeBrandsResult()),
    getBrandById: jest.fn(),
    ...overrides,
  };
}

describe('GetBrandsUseCase', () => {
  it('calls repository.getBrands and returns result', async () => {
    const repo = makeRepository();
    const useCase = new GetBrandsUseCase(repo);

    const result = await useCase.execute();

    expect(repo.getBrands).toHaveBeenCalledTimes(1);
    expect(result.brands).toHaveLength(1);
    expect(result.brands[0].name).toBe('Brand A');
  });

  it('returns pagination info from repository', async () => {
    const repo = makeRepository({
      getBrands: jest.fn().mockResolvedValue(makeBrandsResult({
        page: 2,
        limit: 5,
        total: 25,
        totalPages: 5,
      })),
    });
    const useCase = new GetBrandsUseCase(repo);

    const result = await useCase.execute();

    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(5);
  });

  it('returns empty brands array when no brands exist', async () => {
    const repo = makeRepository({
      getBrands: jest.fn().mockResolvedValue(makeBrandsResult({ brands: [], total: 0 })),
    });
    const useCase = new GetBrandsUseCase(repo);

    const result = await useCase.execute();

    expect(result.brands).toHaveLength(0);
  });

  it('propagates repository errors', async () => {
    const repo = makeRepository({
      getBrands: jest.fn().mockRejectedValue(new Error('API Error')),
    });
    const useCase = new GetBrandsUseCase(repo);

    await expect(useCase.execute()).rejects.toThrow('API Error');
  });

  it('returns multiple brands', async () => {
    const brands = [makeBrand({ id: 1, name: 'Brand A' }), makeBrand({ id: 2, name: 'Brand B' })];
    const repo = makeRepository({
      getBrands: jest.fn().mockResolvedValue(makeBrandsResult({ brands, total: 2 })),
    });
    const useCase = new GetBrandsUseCase(repo);

    const result = await useCase.execute();

    expect(result.brands).toHaveLength(2);
    expect(result.brands[1].name).toBe('Brand B');
  });
});
