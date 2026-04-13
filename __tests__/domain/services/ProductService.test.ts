import { ProductService } from '../../../src/domain/services/ProductService';
import { Product } from '../../../src/domain/entities/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    menuItemId: 10,
    productId: 1,
    name: 'Cà phê sữa',
    price: 35000,
    imageUrl: 'https://example.com/img.jpg',
    categoryId: '2',
    status: 'AVAILABLE',
    ...overrides,
  };
}

describe('ProductService.hasDiscount', () => {
  it('returns true when originalPrice > price', () => {
    const product = makeProduct({ price: 28000, originalPrice: 35000 });
    expect(ProductService.hasDiscount(product)).toBe(true);
  });

  it('returns false when originalPrice is undefined', () => {
    const product = makeProduct({ originalPrice: undefined });
    expect(ProductService.hasDiscount(product)).toBe(false);
  });

  it('returns false when originalPrice equals price', () => {
    const product = makeProduct({ price: 35000, originalPrice: 35000 });
    expect(ProductService.hasDiscount(product)).toBe(false);
  });

  it('returns false when originalPrice < price', () => {
    const product = makeProduct({ price: 40000, originalPrice: 35000 });
    expect(ProductService.hasDiscount(product)).toBe(false);
  });
});

describe('ProductService.getDiscountPercentage', () => {
  it('calculates discount percentage correctly', () => {
    // (35000 - 28000) / 35000 * 100 = 20%
    const product = makeProduct({ price: 28000, originalPrice: 35000 });
    expect(ProductService.getDiscountPercentage(product)).toBe(20);
  });

  it('returns 0 when no discount', () => {
    const product = makeProduct({ originalPrice: undefined });
    expect(ProductService.getDiscountPercentage(product)).toBe(0);
  });

  it('returns 0 when price equals originalPrice', () => {
    const product = makeProduct({ price: 35000, originalPrice: 35000 });
    expect(ProductService.getDiscountPercentage(product)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    // (10000 - 6667) / 10000 * 100 = 33.33 => rounds to 33
    const product = makeProduct({ price: 6667, originalPrice: 10000 });
    expect(ProductService.getDiscountPercentage(product)).toBe(33);
  });
});

describe('ProductService.isAvailable', () => {
  it('returns true for AVAILABLE products', () => {
    const product = makeProduct({ status: 'AVAILABLE' });
    expect(ProductService.isAvailable(product)).toBe(true);
  });

  it('returns false for OUT_OF_STOCK products', () => {
    const product = makeProduct({ status: 'OUT_OF_STOCK' });
    expect(ProductService.isAvailable(product)).toBe(false);
  });
});
