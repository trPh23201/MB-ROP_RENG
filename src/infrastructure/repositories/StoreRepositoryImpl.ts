import { AxiosError } from 'axios';
import { GetStoresByProductResponseDTO, GetStoresResponseDTO, StoreDetailDTO } from '../../application/dto/StoreDTO';
import { StoreMapper } from '../../application/mappers/StoreMapper';
import { ApiError, NetworkError } from '../../core/errors/AppErrors';
import { Store } from '../../domain/entities/Store';
import { GetStoresByProductParams, GetStoresParams, StoreRepository, StoresByProductResult, StoresResult } from '../../domain/repositories/StoreRepository';
import { STORE_ENDPOINTS } from '../api/store/StoreApiConfig';
import { httpClient } from '../http/HttpClient';

export class StoreRepositoryImpl implements StoreRepository {
  private static instance: StoreRepositoryImpl;

  private constructor() {}

  public static getInstance(): StoreRepositoryImpl {
    if (!StoreRepositoryImpl.instance) {
      StoreRepositoryImpl.instance = new StoreRepositoryImpl();
    }
    return StoreRepositoryImpl.instance;
  }

  async getStores(params?: GetStoresParams): Promise<StoresResult> {
    try {
      const response = await httpClient.get<GetStoresResponseDTO>(
        STORE_ENDPOINTS.GET_ALL,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
          },
        }
      );

      return StoreMapper.toStoresResult(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStoreById(id: number): Promise<Store> {
    try {
      const response = await httpClient.get<{ store: StoreDetailDTO }>(
        STORE_ENDPOINTS.GET_BY_ID(id)
      );

      return StoreMapper.toStoreEntity(response.store);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStoresByProduct(params: GetStoresByProductParams): Promise<StoresByProductResult> {
    try {
      const response = await httpClient.get<GetStoresByProductResponseDTO>(
        STORE_ENDPOINTS.GET_BY_PRODUCT,
        {
          params: {
            lat: params.lat,
            lng: params.lng,
            page: params.page ?? 0,
            limit: params.limit ?? 10,
            product_id: params.productId,
          },
        }
      );

      if (response.code !== 1001) {
        throw new ApiError(response.message || 'Không thể tải cửa hàng');
      }

      return {
        stores: response.data.map(dto => StoreMapper.toStoreFromProductDTO(dto)),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof AxiosError) {
      if (!error.response) {
        return new NetworkError();
      }

      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 400:
          return new ApiError(message || 'Yêu cầu không hợp lệ');
        case 401:
          return new ApiError('Vui lòng đăng nhập lại');
        case 404:
          return new ApiError('Không tìm thấy cửa hàng');
        case 500:
        case 502:
        case 503:
          return new ApiError('Máy chủ đang bảo trì. Vui lòng thử lại sau.');
        default:
          return new ApiError(message || 'Có lỗi xảy ra');
      }
    }

    return new ApiError('Có lỗi không xác định');
  }
}

export const storeRepository = StoreRepositoryImpl.getInstance();