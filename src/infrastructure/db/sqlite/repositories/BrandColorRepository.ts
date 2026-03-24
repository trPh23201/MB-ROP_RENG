import { SQLiteDatabase } from 'expo-sqlite';

export interface BrandColorDbItem {
  id: number;
  brand_id: number;
  color_name: string;
  hex_code: string;
  rgb_code: string | null;
  is_active: number;
  sort_order: number;
  synced_at: number;
}

export class BrandColorRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async saveColors(brandId: number, colors: BrandColorDbItem[]): Promise<void> {
    const now = Date.now();

    await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM brand_colors WHERE brand_id = ?',
      [brandId]
    );

    await this.db.runAsync(
      'DELETE FROM brand_colors WHERE brand_id = ?',
      [brandId]
    );

    for (const color of colors) {
      await this.db.runAsync(
        `INSERT INTO brand_colors 
         (id, brand_id, color_name, hex_code, rgb_code, is_active, sort_order, synced_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          color.id,
          brandId,
          color.color_name,
          color.hex_code,
          color.rgb_code,
          color.is_active,
          color.sort_order,
          now,
        ]
      );
    }

    await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM brand_colors WHERE brand_id = ?',
      [brandId]
    );
  }

  async getColorsByBrandId(brandId: number): Promise<BrandColorDbItem[]> {
    return await this.db.getAllAsync<BrandColorDbItem>(
      'SELECT * FROM brand_colors WHERE brand_id = ? AND is_active = 1 ORDER BY sort_order ASC',
      [brandId]
    );
  }

  async getColorByName(brandId: number, colorName: string): Promise<BrandColorDbItem | null> {
    const result = await this.db.getFirstAsync<BrandColorDbItem>(
      'SELECT * FROM brand_colors WHERE brand_id = ? AND color_name = ? AND is_active = 1',
      [brandId, colorName]
    );
    return result ?? null;
  }

  async hasColors(brandId: number): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM brand_colors WHERE brand_id = ?',
      [brandId]
    );
    return (result?.count ?? 0) > 0;
  }
}
