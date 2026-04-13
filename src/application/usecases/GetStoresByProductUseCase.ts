import { GetStoresByProductParams, StoreRepository, StoresByProductResult } from '../../domain/repositories/StoreRepository';
import { ValidationError } from '../../core/errors/AppErrors';

export class GetStoresByProductUseCase {
  constructor(private readonly repository: StoreRepository) {}

  async execute(params: GetStoresByProductParams): Promise<StoresByProductResult> {
    if (!params.lat || !params.lng) {
      throw new ValidationError('location', 'Vị trí không hợp lệ');
    }

    if (!params.productId) {
      throw new ValidationError('productId', 'Sản phẩm không hợp lệ');
    }

    return this.repository.getStoresByProduct({
      productId: params.productId,
      lat: params.lat,
      lng: params.lng,
      page: params.page ?? 0,
      limit: params.limit ?? 10,
    });
  }
}