import { Brand } from '@/src/domain/entities/Brand';
import { useDb } from '@/src/infrastructure/db/sqlite/provider';
import { popupService } from '@/src/presentation/layouts/popup/PopupService';
import { useBrandColorActions } from '@/src/presentation/theme/BrandColorContext';
import { useCallback, useMemo } from 'react';
import { BrandColorService } from '../../application/services/BrandColorService';

export function useBrandColor() {
  const db = useDb();
  const service = useMemo(() => new BrandColorService(db), [db]);
  const { updateColors, resetColors: contextReset } = useBrandColorActions();

  const fetchAndCacheBrand = useCallback(async (brandId: number): Promise<Brand | null> => {
    popupService.loading(true, 'Đang tải thông tin brand...');
    try {
      const brand = await service.fetchAndCacheBrand(brandId);
      popupService.loading(false);
      return brand;
    } catch (err) {
      console.log('[useBrandColor] fetchAndCacheBrand error:', err);
      popupService.loading(false);
      return null;
    }
  }, [service]);

  const applyBrandColors = useCallback(async (brandId: number): Promise<boolean> => {
    popupService.loading(true, 'Đang cập nhật giao diện...');
    try {
      const colorMap = await service.getColorsFromDb(brandId);
      if (!colorMap) {
        popupService.loading(false);
        return false;
      }
      // Update colorStore AND trigger Context re-render
      updateColors(colorMap);
      popupService.loading(false);
      return true;
    } catch (err) {
      console.log('[useBrandColor] applyBrandColors error:', err);
      popupService.loading(false);
      return false;
    }
  }, [service, updateColors]);

  const resetBrandColors = useCallback(() => {
    contextReset();
  }, [contextReset]);

  return { fetchAndCacheBrand, applyBrandColors, resetColors: resetBrandColors };
}
