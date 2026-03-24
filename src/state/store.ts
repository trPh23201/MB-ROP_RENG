import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { StateTrackingService } from '../infrastructure/services/StateTrackingService';
import appReducer from './slices/appSlice';
import auth from './slices/authSlice';
import brandReducer from './slices/brandSlice';
import confirmOrderReducer from './slices/confirmOrderSlice';
import deliveryReducer from './slices/deliverySlice';
import homeReducer from './slices/homeSlice';
import orderCart from './slices/orderCartSlice';
import ordersReducer from './slices/ordersSlice';
import preOrderReducer from './slices/preOrderSlice';
import storesReducer from './slices/storesSlice';

// Persist config for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['isAuthenticated', 'user', 'phoneNumber', 'pendingAction'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, auth);

// Persist config for brand slice - remember selected brand
const brandPersistConfig = {
  key: 'brand',
  storage: AsyncStorage,
  whitelist: ['selectedBrandId'],
};

const persistedBrandReducer = persistReducer(brandPersistConfig, brandReducer);

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: persistedAuthReducer,
    brand: persistedBrandReducer,
    orderCart,
    delivery: deliveryReducer,
    home: homeReducer,
    preOrder: preOrderReducer,
    confirmOrder: confirmOrderReducer,
    orders: ordersReducer,
    stores: storesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).prepend(StateTrackingService.middleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;