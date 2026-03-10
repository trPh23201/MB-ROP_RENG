import { BrandRepository, BrandsResult } from '../../domain/repositories/BrandRepository';

export class GetBrandsUseCase {
    constructor(private readonly repository: BrandRepository) { }

    async execute(): Promise<BrandsResult> {
        return this.repository.getBrands();
    }
}