import { Brand } from '@/src/domain/entities/Brand';
import { BrandColorDbItem, BrandColorRepository } from '@/src/infrastructure/db/sqlite/repositories/BrandColorRepository';
import { brandRepository } from '@/src/infrastructure/repositories/BrandRepositoryImpl';
import { updateColorStore, resetColorStore } from '@/src/presentation/theme/colors';
import { SQLiteDatabase } from 'expo-sqlite';

export class BrandColorService {
  private readonly repo: BrandColorRepository;

  constructor(private readonly db: SQLiteDatabase) {
    this.repo = new BrandColorRepository(db);
  }

  async fetchAndCacheBrand(brandId: number): Promise<Brand> {
    const brand = await brandRepository.getBrandById(brandId);

    // Always upsert colors from API (INSERT OR REPLACE handles duplicates)
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
    console.log(`[BrandColorService] Synced ${colorDbItems.length} colors for brand ${brandId} to DB`);

    return brand;
  }

  /**
   * Read colors from DB and apply to colorStore via Proxy.
   * Returns the colorMap so the caller (hook) can pass it to context's updateColors().
   */
  async getColorsFromDb(brandId: number): Promise<Map<string, string> | null> {
    const hasData = await this.repo.hasColors(brandId);
    if (!hasData) {
      console.log(`[BrandColorService] No colors in DB for brand ${brandId}`);
      return null;
    }

    const dbColors = await this.repo.getColorsByBrandId(brandId);
    if (dbColors.length === 0) {
      console.log(`[BrandColorService] No active colors for brand ${brandId}`);
      return null;
    }

    const colorMap = new Map<string, string>();
    for (const color of dbColors) {
      colorMap.set(color.color_name, color.hex_code);
      console.log(`[BrandColorService] ${color.color_name} → ${color.hex_code}`);
    }

    console.log(`[BrandColorService] Read ${dbColors.length} colors from DB for brand ${brandId}`);
    return colorMap;
  }

  /**
   * Legacy method: read from DB and apply directly to colorStore.
   * For use when context is not available.
   */
  async syncColors(brandId: number): Promise<boolean> {
    const colorMap = await this.getColorsFromDb(brandId);
    if (!colorMap) return false;

    updateColorStore(colorMap);
    console.log(`[BrandColorService] Sync complete: ${colorMap.size} colors applied`);
    return true;
  }

  resetColors(): void {
    resetColorStore();
    console.log('[BrandColorService] Reset to original colors');
  }
}
