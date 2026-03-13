import { Brand } from '../../domain/entities/Brand';
import { BrandRepository } from '../../domain/repositories/BrandRepository';

export class GetBrandByIdUseCase {
    constructor(private readonly repository: BrandRepository) { }

    async execute(id: number): Promise<Brand> {
        return this.repository.getBrandById(id);
    }
}