export interface BrandColorDTO {
    id: number;
    brand_id: number;
    color_name: string;
    hex_code: string;
    rgb_code: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface BrandDetailDTO {
    id: number;
    name: string;
    logo_url: string | null;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    colors: BrandColorDTO[];
}

export interface GetBrandsResponseDTO {
    brands: BrandDetailDTO[];
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface GetBrandByIdResponseDTO {
    brand: BrandDetailDTO;
}