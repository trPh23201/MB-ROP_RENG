import React, { createContext, useCallback, useContext, useState } from 'react';
import { BRAND_COLORS, BrandColorsType, resetColorStore, updateColorStore } from './colors';

interface BrandColorContextValue {
  brandColors: BrandColorsType;
  updateColors: (colorMap: Map<string, string>) => void;
  resetColors: () => void;
}

const BrandColorContext = createContext<BrandColorContextValue | null>(null);

export function BrandColorProvider({ children }: React.PropsWithChildren) {
  const [, setVersion] = useState(0);

  const updateColors = useCallback((colorMap: Map<string, string>) => {
    updateColorStore(colorMap);
    setVersion(v => v + 1);
  }, []);

  const resetColors = useCallback(() => {
    resetColorStore();
    setVersion(v => v + 1);
  }, []);

  return (
    <BrandColorContext.Provider value={{ brandColors: BRAND_COLORS, updateColors, resetColors }}>
      {children}
    </BrandColorContext.Provider>
  );
}

export function useBrandColors(): BrandColorsType {
  const ctx = useContext(BrandColorContext);
  if (!ctx) {
    return BRAND_COLORS;
  }
  return ctx.brandColors;
}

export function useBrandColorActions() {
  const ctx = useContext(BrandColorContext);
  if (!ctx) {
    throw new Error('useBrandColorActions must be used within <BrandColorProvider>');
  }
  return { updateColors: ctx.updateColors, resetColors: ctx.resetColors };
}
