import { Product, ProductBadge } from '../../domain/entities/Product';
import { Store } from '../../domain/entities/Store';
import { HomeMenuResult } from '../../domain/repositories/HomeRepository';
import { HomeMenuResponseDTO, MenuAPIItemDTO, ProductDTO, StoreDTO } from '../dto/HomeMenuDTO';

export class ProductMapper {
  static toEntity(dto: ProductDTO): Product {
    const price = parseFloat(dto.price);
    const badge = ProductMapper.parseBadge(dto.meta);

    return {
      id: String(dto.product_id),
      menuItemId: dto.menu_item_id,
      productId: dto.product_id,
      name: dto.name,
      price,
      imageUrl: dto.image_url,
      categoryId: String(dto.category_id),
      originalPrice: undefined,
      badge,
      discount: undefined,
      status: 'AVAILABLE',
    };
  }

  static toEntityFromMenuItem(dto: MenuAPIItemDTO): Product {
    const price = parseFloat(dto.price);
    const badge = ProductMapper.parseBadge(dto.meta);

    return {
      id: String(dto.product_id),
      menuItemId: dto.id,
      productId: dto.product_id,
      name: dto.product.name,
      price,
      imageUrl: dto.product.image_url,
      categoryId: String(dto.product.category_id),
      originalPrice: undefined,
      badge,
      discount: undefined,
      status: 'AVAILABLE',
    };
  }

  static toEntityList(dtos: ProductDTO[]): Product[] {
    return dtos.map(dto => ProductMapper.toEntity(dto));
  }

  static toStoreEntity(dto: StoreDTO): Store {
    return {
      id: dto.id,
      regionId: dto.region_id,
      name: dto.name,
      slug: dto.slug,
      address: dto.address,
      location: dto.location,
      phone: dto.phone,
      email: dto.email,
      timezone: dto.timezone,
      isActive: dto.is_active === 1,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at,
      currentLoyaltyPoint: dto.current_loyalty_point,
    };
  }

  static toHomeMenuResult(response: HomeMenuResponseDTO): HomeMenuResult {
    let products: Product[] = [];
    let toppings: Product[] = [];

    if (response.data.menu?.items) {
      products = response.data.menu.items.map(dto => ProductMapper.toEntityFromMenuItem(dto));
    } else if (response.data.products) {
      products = ProductMapper.toEntityList(response.data.products);
    }

    if (response.data.menu?.toppings) {
      toppings = response.data.menu.toppings.map(dto => ProductMapper.toEntityFromMenuItem(dto));
    }

    const storeId = response.data.store_id || response.data.menu?.store_id || 0;
    const menuId = response.data.menu_id || response.data.menu?.id || 0;

    return {
      storeId,
      store: response.data.store ? ProductMapper.toStoreEntity(response.data.store) : {} as Store,
      menuId,
      products,
      toppings,
    };
  }

  private static parseBadge(meta: Record<string, unknown> | null): ProductBadge | undefined {
    if (!meta) return undefined;
    if (meta.isNew === true) return 'NEW';
    if (meta.isHot === true) return 'HOT';
    return undefined;
  }
}