import { ProductMapper } from '../../../src/application/mappers/ProductMapper';
import { ProductDTO, MenuAPIItemDTO, StoreDTO } from '../../../src/application/dto/HomeMenuDTO';

function makeProductDTO(overrides: Partial<ProductDTO> = {}): ProductDTO {
  return {
    menu_item_id: 10,
    product_id: 1,
    name: 'Cà phê sữa',
    price: '35000',
    image_url: 'https://example.com/img.jpg',
    category_id: 2,
    meta: null,
    ...overrides,
  };
}

function makeMenuAPIItemDTO(overrides: Partial<MenuAPIItemDTO> = {}): MenuAPIItemDTO {
  return {
    id: 10,
    menu_id: 5,
    product_id: 1,
    display_name: 'Cà phê sữa đá',
    price: '35000',
    available: 1,
    sort_order: 1,
    meta: null,
    product: {
      id: 1,
      sku: 'CF-001',
      name: 'Cà phê sữa',
      description: '',
      category_id: 2,
      image_url: 'https://example.com/img.jpg',
      base_price: '35000',
      is_active: 1,
      product_type: 'drink',
      points_required: 0,
      created_at: '2024-01-01T00:00:00Z',
      option_groups: [],
    },
    ...overrides,
  };
}

function makeStoreDTO(overrides: Partial<StoreDTO> = {}): StoreDTO {
  return {
    id: 5,
    region_id: 1,
    name: 'Store HCM',
    slug: 'store-hcm',
    address: '123 Nguyễn Huệ',
    location: { type: 'Point', coordinates: [106.6, 10.7] },
    phone: '0901234567',
    email: null,
    timezone: 'Asia/Ho_Chi_Minh',
    is_active: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    deleted_at: null,
    current_loyalty_point: 0,
    ...overrides,
  };
}

describe('ProductMapper.toEntity', () => {
  it('maps ProductDTO to Product entity', () => {
    const product = ProductMapper.toEntity(makeProductDTO());
    expect(product.id).toBe('1');
    expect(product.name).toBe('Cà phê sữa');
    expect(product.price).toBe(35000);
    expect(product.status).toBe('AVAILABLE');
  });

  it('parses price string to number', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ price: '42000.5' }));
    expect(product.price).toBe(42000.5);
  });

  it('converts category_id to string', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ category_id: 3 }));
    expect(product.categoryId).toBe('3');
  });

  it('returns undefined badge when meta is null', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ meta: null }));
    expect(product.badge).toBeUndefined();
  });

  it('returns NEW badge for isNew meta', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ meta: { isNew: true } }));
    expect(product.badge).toBe('NEW');
  });

  it('returns HOT badge for isHot meta', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ meta: { isHot: true } }));
    expect(product.badge).toBe('HOT');
  });

  it('returns undefined badge when meta has neither isNew nor isHot', () => {
    const product = ProductMapper.toEntity(makeProductDTO({ meta: { other: true } }));
    expect(product.badge).toBeUndefined();
  });
});

describe('ProductMapper.toEntityFromMenuItem', () => {
  it('maps MenuAPIItemDTO to Product entity', () => {
    const product = ProductMapper.toEntityFromMenuItem(makeMenuAPIItemDTO());
    expect(product.id).toBe('1');
    expect(product.menuItemId).toBe(10);
    expect(product.name).toBe('Cà phê sữa');
    expect(product.price).toBe(35000);
  });

  it('uses product.image_url from nested product', () => {
    const product = ProductMapper.toEntityFromMenuItem(makeMenuAPIItemDTO());
    expect(product.imageUrl).toBe('https://example.com/img.jpg');
  });
});

describe('ProductMapper.toEntityList', () => {
  it('maps array of DTOs to Product entities', () => {
    const dtos = [makeProductDTO({ product_id: 1 }), makeProductDTO({ product_id: 2, name: 'Trà sữa' })];
    const products = ProductMapper.toEntityList(dtos);
    expect(products).toHaveLength(2);
    expect(products[1].name).toBe('Trà sữa');
  });

  it('returns empty array for empty input', () => {
    expect(ProductMapper.toEntityList([])).toHaveLength(0);
  });
});

describe('ProductMapper.toStoreEntity', () => {
  it('maps StoreDTO to Store entity', () => {
    const store = ProductMapper.toStoreEntity(makeStoreDTO());
    expect(store.id).toBe(5);
    expect(store.name).toBe('Store HCM');
    expect(store.address).toBe('123 Nguyễn Huệ');
    expect(store.isActive).toBe(true);
  });

  it('converts is_active 1 to true', () => {
    const store = ProductMapper.toStoreEntity(makeStoreDTO({ is_active: 1 }));
    expect(store.isActive).toBe(true);
  });

  it('converts is_active 0 to false', () => {
    const store = ProductMapper.toStoreEntity(makeStoreDTO({ is_active: 0 }));
    expect(store.isActive).toBe(false);
  });
});
