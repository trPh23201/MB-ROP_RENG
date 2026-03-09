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
  const isReady = useAppSelector(selectIsAppReady);
  const initError = useAppSelector(selectInitError);
  const selectedBrandId = useAppSelector(selectSelectedBrandId);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, SPLASH_CONSTANTS.DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && minTimeElapsed) {
      if (selectedBrandId) {
        router.replace('/(tabs)');
      } else {
        router.replace('/select-brand' as any);
      }
    }
  }, [isReady, minTimeElapsed, selectedBrandId, router]);

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