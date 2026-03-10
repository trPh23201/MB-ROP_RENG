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

export default function SplashScreen() {
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
    brandColorService.syncColors(selectedBrandId)
      .then((applied: boolean) => {
        console.log(`[SplashScreen] Colors synced from DB: ${applied}`);
        setColorsSynced(true);
      })
      .catch((err: Error) => {
        console.log('[SplashScreen] Color sync error:', err);
        setColorsSynced(true);
      });
  }, [selectedBrandId, db]);

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
    <View style={splashStyles.container}>
      <View style={splashStyles.logoContainer}>
        <View style={splashStyles.logoPlaceholder}>
          <Text style={splashStyles.logoText}>LOGO{'\n'}RỐP RẺNG</Text>
        </View>
        <Text
          style={[
            splashStyles.brandName,
            { fontFamily: 'Phudu-Bold' }
          ]}
        >
          {SPLASH_CONSTANTS.BRAND_NAME}
        </Text>
        <Text
          style={[
            splashStyles.tagline,
            { fontFamily: 'SpaceGrotesk-Medium' }
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