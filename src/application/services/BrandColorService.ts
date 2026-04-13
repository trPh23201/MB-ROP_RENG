import { Brand } from '@/src/domain/entities/Brand';
import { BrandColorDbItem, BrandColorRepository } from '@/src/infrastructure/db/sqlite/repositories/BrandColorRepository';
import { brandRepository } from '@/src/infrastructure/repositories/BrandRepositoryImpl';
import { resetColorStore, updateColorStore } from '@/src/presentation/theme/colors';
import { SQLiteDatabase } from 'expo-sqlite';

export class BrandColorService {
  private readonly repo: BrandColorRepository;

  constructor(private readonly db: SQLiteDatabase) {
    this.repo = new BrandColorRepository(db);
  }

  async fetchAndCacheBrand(brandId: number): Promise<Brand> {
    const brand = await brandRepository.getBrandById(brandId);

    const colorDbItems: BrandColorDbItem[] = brand.colors.map(c => ({
      id: c.id,
      brand_id: brandId,
      color_name: c.colorName,
      hex_code: c.hexCode,
      rgb_code: null,
      is_active: 1,
      sort_order: 0,
      synced_at: Date.now(),
    }));
    await this.repo.saveColors(brandId, colorDbItems);

    return brand;
  }

  async getColorsFromDb(brandId: number): Promise<Map<string, string> | null> {
    const hasData = await this.repo.hasColors(brandId);
    if (!hasData) {
      return null;
    }

    const dbColors = await this.repo.getColorsByBrandId(brandId);
    if (dbColors.length === 0) {
      return null;
    }

    const colorMap = new Map<string, string>();
    for (const color of dbColors) {
      colorMap.set(color.color_name, color.hex_code);
    }

    return colorMap;
  }

  async syncColors(brandId: number): Promise<boolean> {
    const colorMap = await this.getColorsFromDb(brandId);
    if (!colorMap) return false;

    updateColorStore(colorMap);
    return true;
  }

  resetColors(): void {
    resetColorStore();
  }
}
