import { AxiosError } from 'axios';
import { GetBrandByIdResponseDTO, GetBrandsResponseDTO } from '../../application/dto/BrandDTO';
import { BrandMapper } from '../../application/mappers/BrandMapper';
import { ApiError, NetworkError } from '../../core/errors/AppErrors';
import { Brand } from '../../domain/entities/Brand';
import { BrandRepository, BrandsResult } from '../../domain/repositories/BrandRepository';
import { BRAND_ENDPOINTS } from '../api/brand/BrandApiConfig';
import { httpClient } from '../http/HttpClient';

export class BrandRepositoryImpl implements BrandRepository {
    private static instance: BrandRepositoryImpl;

    private constructor() { }

    public static getInstance(): BrandRepositoryImpl {
        if (!BrandRepositoryImpl.instance) {
            BrandRepositoryImpl.instance = new BrandRepositoryImpl();
        }
        return BrandRepositoryImpl.instance;
    }

    async getBrands(): Promise<BrandsResult> {
        try {
            const response = await httpClient.get<GetBrandsResponseDTO>(
                BRAND_ENDPOINTS.GET_ALL,
            );

            return BrandMapper.toBrandsResult(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBrandById(id: number): Promise<Brand> {
        try {
            const response = await httpClient.get<GetBrandByIdResponseDTO>(
                BRAND_ENDPOINTS.GET_BY_ID(id),
            );

            return BrandMapper.toBrandEntity(response.brand);
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
                    return new ApiError('Không tìm thấy thương hiệu');
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

export const brandRepository = BrandRepositoryImpl.getInstance();