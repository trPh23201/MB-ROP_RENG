import { Brand } from '@/src/domain/entities/Brand';
import { BrandColorDbItem, BrandColorRepository } from '@/src/infrastructure/db/sqlite/repositories/BrandColorRepository';
import { brandRepository } from '@/src/infrastructure/repositories/BrandRepositoryImpl';
import { BRAND_COLORS, DYNAMIC_COLORS } from '@/src/presentation/theme/colors';
import { SQLiteDatabase } from 'expo-sqlite';

const ORIGINAL_BRAND_COLORS = JSON.parse(JSON.stringify(BRAND_COLORS));
const ORIGINAL_DYNAMIC_COLORS = JSON.parse(JSON.stringify(DYNAMIC_COLORS));

export class BrandColorService {
  private readonly repo: BrandColorRepository;

  constructor(private readonly db: SQLiteDatabase) {
    this.repo = new BrandColorRepository(db);
  }

  async fetchAndCacheBrand(brandId: number): Promise<Brand> {
    const hasCache = await this.repo.hasColors(brandId);
    const brand = await brandRepository.getBrandById(brandId);

    if (!hasCache) {
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
      console.log(`[BrandColorService] Fetched & saved brand ${brandId} to DB`);
    } else {
      console.log(`[BrandColorService] Using cached colors for brand ${brandId}`);
    }

    return brand;
  }

  async syncColors(brandId: number): Promise<boolean> {
    const hasData = await this.repo.hasColors(brandId);
    if (!hasData) {
      console.log(`[BrandColorService] No colors in DB for brand ${brandId}`);
      return false;
    }

    const dbColors = await this.repo.getColorsByBrandId(brandId);
    if (dbColors.length === 0) {
      console.log(`[BrandColorService] No active colors for brand ${brandId}`);
      return false;
    }

    const colorMap = new Map<string, string>();
    for (const color of dbColors) {
      colorMap.set(color.color_name, color.hex_code);
      console.log(`[BrandColorService] ${color.color_name} → ${color.hex_code}`);
    }

    this.applyColors(colorMap);
    console.log(`[BrandColorService] Sync complete: ${dbColors.length} colors applied`);
    return true;
  }

  applyColors(colorMap: Map<string, string>): void {
    if (colorMap.size === 0) return;

    let applied = 0;

    for (const [colorName, hexCode] of colorMap) {
      if (colorName.includes('.')) {
        const parts = colorName.split('.');
        let target: any = BRAND_COLORS;
        for (let i = 0; i < parts.length - 1; i++) {
          target = target?.[parts[i]];
        }
        if (target && parts[parts.length - 1] in target) {
          target[parts[parts.length - 1]] = hexCode;
          applied++;
        }
        continue;
      }

      let found = false;
      for (const group of Object.values(BRAND_COLORS)) {
        if (typeof group === 'object' && group !== null && colorName in group) {
          (group as any)[colorName] = hexCode;
          applied++;
          found = true;
          break;
        }
      }
      if (!found) {
        for (const group of Object.values(DYNAMIC_COLORS)) {
          if (typeof group === 'object' && group !== null && colorName in group) {
            (group as any)[colorName] = hexCode;
            applied++;
            break;
          }
        }
      }
    }

    console.log(`[BrandColorService] Applied ${applied}/${colorMap.size} colors`);
  }

  resetColors(): void {
    for (const groupKey of Object.keys(ORIGINAL_BRAND_COLORS)) {
      const original = ORIGINAL_BRAND_COLORS[groupKey];
      const current = (BRAND_COLORS as any)[groupKey];
      if (typeof original === 'object' && original !== null && current) {
        for (const key of Object.keys(original)) {
          current[key] = original[key];
        }
      }
    }
    for (const groupKey of Object.keys(ORIGINAL_DYNAMIC_COLORS)) {
      const original = ORIGINAL_DYNAMIC_COLORS[groupKey];
      const current = (DYNAMIC_COLORS as any)[groupKey];
      if (typeof original === 'object' && original !== null && current) {
        for (const key of Object.keys(original)) {
          current[key] = original[key];
        }
      }
    }
    console.log('[BrandColorService] Reset to original colors');
  }
}
