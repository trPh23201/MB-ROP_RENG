import { IS_IOS } from "@/src/utils/platform";
import * as Sentry from '@sentry/react-native';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { TamaguiProvider } from 'tamagui';
import { DatabaseProvider } from '../src/infrastructure/db/sqlite/provider';
import { initSentry } from '../src/infrastructure/services/monitoring';
import { ErrorBoundary } from '../src/presentation/components/shared/ErrorBoundary';
import { NetworkGuard } from '../src/presentation/layouts/network/NetworkGuard';
import { PopupProvider } from '../src/presentation/layouts/popup/PopupProvider';
import { BrandColorProvider } from '../src/presentation/theme/BrandColorContext';
import { persistor, store } from '../src/state/store';
import { useAppInitialization } from '../src/utils/hooks/useAppInitialization';
import config from '../tamagui.config';

// Initialize Sentry as early as possible
initSentry();

SplashScreen.preventAutoHideAsync();

function AppInitializer({ children, fontsLoaded }: { children: React.ReactNode; fontsLoaded: boolean }) {
  const { isReady, error } = useAppInitialization();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error, { extra: { context: 'AppInitializer' } });
    }
  }, [error]);

  return <>{children}</>;
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Phudu-Bold': require('../assets/fonts/Phudu-Bold.ttf'),
    'Phudu-Medium': require('../assets/fonts/Phudu-Medium.ttf'),
    'Phudu-SemiBold': require('../assets/fonts/Phudu-SemiBold.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NetworkGuard>
              <TamaguiProvider config={config}>
                <BottomSheetModalProvider>
                  <DatabaseProvider>
                    <BrandColorProvider>
                      <PopupProvider>
                        <AppInitializer fontsLoaded={fontsLoaded}>
                          <StatusBar style={IS_IOS ? 'dark' : 'auto'} />
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="select-brand" />
                            <Stack.Screen
                              name="address-management"
                              options={{
                                headerShown: false,
                                presentation: 'fullScreenModal',
                                animation: 'slide_from_bottom'
                              }}
                            />
                          </Stack>
                        </AppInitializer>
                      </PopupProvider>
                    </BrandColorProvider>
                  </DatabaseProvider>
                </BottomSheetModalProvider>
              </TamaguiProvider>
            </NetworkGuard>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);