import { Brand, BrandColor } from '../../domain/entities/Brand';
import { BrandsResult } from '../../domain/repositories/BrandRepository';
import { BrandColorDTO, BrandDetailDTO, GetBrandsResponseDTO } from '../dto/BrandDTO';

export class BrandMapper {
    static toBrandColorEntity(dto: BrandColorDTO): BrandColor {
        return {
            id: dto.id,
            colorName: dto.color_name,
            hexCode: dto.hex_code,
        };
    }

    static toBrandEntity(dto: BrandDetailDTO): Brand {
        return {
            id: dto.id,
            name: dto.name,
            logoUrl: dto.logo_url,
            description: dto.description,
            isActive: dto.is_active,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
            deletedAt: dto.deleted_at,
            colors: dto.colors.map(c => BrandMapper.toBrandColorEntity(c)),
        };
    }

    static toBrandsResult(response: GetBrandsResponseDTO): BrandsResult {
        return {
            brands: response.brands.map(b => BrandMapper.toBrandEntity(b)),
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.total_pages,
        };
    }

    static toSerializableBrand(brand: Brand) {
        return {
            id: brand.id,
            name: brand.name,
            logoUrl: brand.logoUrl,
            description: brand.description,
            isActive: brand.isActive,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
            deletedAt: brand.deletedAt,
            colors: brand.colors.map(c => ({
                id: c.id,
                colorName: c.colorName,
                hexCode: c.hexCode,
            })),
        };
    }
}