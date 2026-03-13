import { BrandColorService } from '@/src/application/services/BrandColorService';
import { useDb } from '@/src/infrastructure/db/sqlite/provider';
import { selectInitError, selectIsAppReady } from '@/src/state/slices/appSlice';
import { selectSelectedBrandId } from '@/src/state/slices/brandSlice';
import { useAppSelector } from '@/src/utils/hooks';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SPLASH_CONSTANTS } from './constants';
import { splashStyles } from './styles';
import { useBrandColorActions } from '../../theme/BrandColorContext';
import { useBrandColors } from '../../theme/BrandColorContext';

export default function SplashScreen() {
  const BRAND_COLORS = useBrandColors();
  const { updateColors } = useBrandColorActions();
  const router = useRouter();
  const db = useDb();
  const isReady = useAppSelector(selectIsAppReady);
  const initError = useAppSelector(selectInitError);
  const selectedBrandId = useAppSelector(selectSelectedBrandId);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [colorsSynced, setColorsSynced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, SPLASH_CONSTANTS.DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedBrandId) {
      console.log('[SplashScreen] No brandId selected, skipping color sync');
      setColorsSynced(true);
      return;
    }

    console.log(`[SplashScreen] Syncing colors for brand ${selectedBrandId}...`);
    const brandColorService = new BrandColorService(db);
    brandColorService.getColorsFromDb(selectedBrandId)
      .then((colorMap) => {
        if (colorMap) {
          updateColors(colorMap);
          console.log(`[SplashScreen] Colors applied via Context for brand ${selectedBrandId}`);
        } else {
          console.log(`[SplashScreen] No colors in DB for brand ${selectedBrandId}, using defaults`);
        }
        setColorsSynced(true);
      })
      .catch((err: Error) => {
        console.log('[SplashScreen] Color sync error:', err);
        setColorsSynced(true);
      });
  }, [selectedBrandId, db, updateColors]);

  useEffect(() => {
    console.log(`[SplashScreen] Navigation check: isReady=${isReady}, minTime=${minTimeElapsed}, colorsSynced=${colorsSynced}, brandId=${selectedBrandId}`);
    if (isReady && minTimeElapsed && colorsSynced) {
      if (selectedBrandId) {
        console.log('[SplashScreen] Navigating to /(tabs)');
        router.replace('/(tabs)');
      } else {
        console.log('[SplashScreen] Navigating to /select-brand');
        router.replace('/select-brand');
      }
    }
  }, [isReady, minTimeElapsed, colorsSynced, selectedBrandId, router]);

  return (
    <View style={[splashStyles.container, { backgroundColor: BRAND_COLORS.screenBg.bold }]}>
      <View style={splashStyles.logoContainer}>
        <View style={[splashStyles.logoPlaceholder, { backgroundColor: BRAND_COLORS.primary.p3 }]}>
          <Text style={[splashStyles.logoText, { color: BRAND_COLORS.primary.p1 }]}>LOGO{'\n'}RỐP RẺNG</Text>
        </View>
        <Text
          style={[
            splashStyles.brandName,
            { fontFamily: 'Phudu-Bold', color: BRAND_COLORS.primary.p3 }
          ]}
        >
          {SPLASH_CONSTANTS.BRAND_NAME}
        </Text>
        <Text
          style={[
            splashStyles.tagline,
            { fontFamily: 'SpaceGrotesk-Medium', color: BRAND_COLORS.primary.p3 }
          ]}
        >
          {SPLASH_CONSTANTS.TAGLINE}
        </Text>
        {initError ? (
          <Text style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>
            {initError}
          </Text>
        ) : null}
      </View>
    </View>
  );
}