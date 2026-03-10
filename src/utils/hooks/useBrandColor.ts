import { Brand } from '@/src/domain/entities/Brand';
import { useDb } from '@/src/infrastructure/db/sqlite/provider';
import { popupService } from '@/src/presentation/layouts/popup/PopupService';
import { useCallback, useMemo, useState } from 'react';
import { BrandColorService } from '../../application/services/BrandColorService';

export function useBrandColor() {
  const db = useDb();
  const service = useMemo(() => new BrandColorService(db), [db]);
  const [, setColorVersion] = useState(0);

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
      const result = await service.syncColors(brandId);
      popupService.loading(false);
      setColorVersion(v => v + 1);
      return result;
    } catch (err) {
      console.log('[useBrandColor] applyBrandColors error:', err);
      popupService.loading(false);
      return false;
    }
  }, [service]);

  const resetColors = useCallback(() => {
    service.resetColors();
    setColorVersion(v => v + 1);
  }, [service]);

  const forceColorUpdate = useCallback(() => {
    setColorVersion(v => v + 1);
  }, []);

  return { fetchAndCacheBrand, applyBrandColors, resetColors, forceColorUpdate };
}
