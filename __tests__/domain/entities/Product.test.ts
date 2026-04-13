import { Product, ProductStatus, ProductBadge } from '../../../src/domain/entities/Product';

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

describe('Product entity', () => {
  it('creates a basic product with required fields', () => {
    const product = makeProduct();
    expect(product.id).toBe('1');
    expect(product.name).toBe('Cà phê sữa');
    expect(product.price).toBe(35000);
    expect(product.status).toBe('AVAILABLE');
  });

  it('accepts OUT_OF_STOCK status', () => {
    const product = makeProduct({ status: 'OUT_OF_STOCK' });
    expect(product.status).toBe('OUT_OF_STOCK');
  });

  it('has optional originalPrice for discounted items', () => {
    const product = makeProduct({ price: 28000, originalPrice: 35000 });
    expect(product.originalPrice).toBe(35000);
    expect(product.price).toBe(28000);
    expect(product.originalPrice! > product.price).toBe(true);
  });

  it('has undefined originalPrice when no discount', () => {
    const product = makeProduct({ originalPrice: undefined });
    expect(product.originalPrice).toBeUndefined();
  });

  it('accepts NEW badge', () => {
    const product = makeProduct({ badge: 'NEW' });
    expect(product.badge).toBe('NEW');
  });

  it('accepts HOT badge', () => {
    const product = makeProduct({ badge: 'HOT' });
    expect(product.badge).toBe('HOT');
  });

  it('has undefined badge when not set', () => {
    const product = makeProduct({ badge: undefined });
    expect(product.badge).toBeUndefined();
  });

  it('stores menuItemId and productId separately', () => {
    const product = makeProduct({ menuItemId: 99, productId: 55 });
    expect(product.menuItemId).toBe(99);
    expect(product.productId).toBe(55);
  });

  it('id is stored as string', () => {
    const product = makeProduct({ id: '42' });
    expect(typeof product.id).toBe('string');
  });
});
