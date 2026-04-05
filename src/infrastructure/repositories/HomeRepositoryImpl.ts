import { AxiosError } from 'axios';
import { HomeMenuResponseDTO, MenuAPIItemDTO } from '../../application/dto/HomeMenuDTO';
import { VouchersResponseDTO } from '../../application/dto/VoucherDTO';
import { ProductMapper } from '../../application/mappers/ProductMapper';
import { VoucherMapper } from '../../application/mappers/VoucherMapper';
import { ApiError, NetworkError } from '../../core/errors/AppErrors';
import { HomeMenuParams, HomeMenuResult, HomeRepository, MenuByStoreResult, VouchersParams, VouchersResult } from '../../domain/repositories/HomeRepository';
import { HOME_API_SUCCESS_CODE, HOME_ENDPOINTS } from '../api/home/HomeApiConfig';
import { httpClient } from '../http/HttpClient';

export class HomeRepositoryImpl implements HomeRepository {
  private static instance: HomeRepositoryImpl;

  private constructor() { }

  public static getInstance(): HomeRepositoryImpl {
    if (!HomeRepositoryImpl.instance) {
      HomeRepositoryImpl.instance = new HomeRepositoryImpl();
    }
    return HomeRepositoryImpl.instance;
  }

  private extractToppings = (menuItems: MenuAPIItemDTO[]) => {
    const toppingMap = new Map<string, any>();
    menuItems?.forEach(dto => {
      dto.product?.option_groups?.forEach(group => {
        if (group.is_topping) {
          group.items.forEach(group_item => {
            if (!toppingMap.has(String(group_item.id))) {
              toppingMap.set(String(group_item.id), {
                //Currently use for mapping
                id: String(group_item.id),
                name: group_item.name,
                price: Number(group_item.additional_price),
                //Additional fields for potential future use
                linkedProductId: group_item.linked_product_id,
                isActive: group_item.is_active,
                optionGroupId: group_item.id,
                optionGroupName: group.name,
              });
            }
          });
        }
      });
    });
    return Array.from(toppingMap.values());
  };
 
  async getHomeMenu(params: HomeMenuParams): Promise<HomeMenuResult> {
    try {
      const response = await httpClient.get<HomeMenuResponseDTO>(HOME_ENDPOINTS.MENU, {
        params: {
          lat: params.lat,
          lng: params.lng,
          limit: params.limit,
          page: params.page,
        },
      });

      if (response.code !== HOME_API_SUCCESS_CODE) {
        throw new ApiError(response.message || 'Không thể tải menu');
      }

      const partialResult = ProductMapper.toHomeMenuResult(response);
      const menuId = partialResult.menuId;

      if (menuId) {
        try {
          const menuDetailResponse = await httpClient.get<{ menu: { items: MenuAPIItemDTO[], toppings: MenuAPIItemDTO[] } }>(`/menus/${menuId}`);
          if (menuDetailResponse && menuDetailResponse.menu) {
            if (menuDetailResponse.menu.items) {
              partialResult.products = menuDetailResponse.menu.items.map(dto => ProductMapper.toEntityFromMenuItem(dto));
              partialResult.toppings = this.extractToppings(menuDetailResponse.menu.items);
            }
          }
        } catch (detailError) {
          console.error('[HomeRepositoryImpl] Failed to fetch full menu details:', detailError);
        }
      }

      return partialResult;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMenuByStore(storeId: number): Promise<MenuByStoreResult> {
    try {
      const response = await httpClient.get<{
        menu: {
          id: number;
          store_id: number;
          items: MenuAPIItemDTO[];
          toppings?: MenuAPIItemDTO[];
        }
      }>(`/menus/v2/${storeId}`);

      const products = response.menu.items
        ? response.menu.items.map(dto => ProductMapper.toEntityFromMenuItem(dto))
        : [];

      const toppings = this.extractToppings(response.menu.items);

      return {
        menuId: response.menu.id,
        storeId: response.menu.store_id,
        products,
        toppings,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVouchers(params: VouchersParams): Promise<VouchersResult> {
    try {
      const response = await httpClient.get<VouchersResponseDTO>(HOME_ENDPOINTS.VOUCHERS, {
        params: {
          lat: params.lat,
          lng: params.lng,
          limit: params.limit,
          page: params.page,
        },
      });

      if (response.code !== HOME_API_SUCCESS_CODE) {
        throw new ApiError(response.message || 'Không thể tải voucher');
      }

      return VoucherMapper.toVouchersResult(response);
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
          return new ApiError('Không tìm thấy cửa hàng gần bạn');
        case 500:
        case 502:
        case 503:
          return new ApiError('Máy chủ đang bảo trì. Vui lòng thử lại sau');
        default:
          return new ApiError(message || 'Đã có lỗi xảy ra');
      }
    }

    return new ApiError('Đã có lỗi xảy ra');
  }
}

export const homeRepository = HomeRepositoryImpl.getInstance();