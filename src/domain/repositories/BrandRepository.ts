import { Brand } from '../entities/Brand';

export interface BrandsResult {
    brands: Brand[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface BrandRepository {
    getBrands(): Promise<BrandsResult>;
}