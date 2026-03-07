
import { AppLifecycleEvent } from '@/src/infrastructure/services/lifecycle/appLifecycle.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppLocation {
    lat: number;
    lng: number;
}

interface AppState {
    isInitialized: boolean;
    initError: string | null;
    location: AppLocation | null;
    dataFetchedAt: number | null;
    lifecycleState: AppLifecycleEvent;
}

const initialState: AppState = {
    isInitialized: false,
    initError: null,
    location: null,
    dataFetchedAt: null,
    lifecycleState: AppLifecycleEvent.FOREGROUND,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        setInitError: (state, action: PayloadAction<string | null>) => {
            state.initError = action.payload;
        },
        setAppLocation: (state, action: PayloadAction<AppLocation>) => {
            state.location = action.payload;
        },
        updateDataTimestamp: (state, action: PayloadAction<number>) => {
            state.dataFetchedAt = action.payload;
        },
        setLifecycleState: (state, action: PayloadAction<AppLifecycleEvent>) => {
            state.lifecycleState = action.payload;
        },
        resetAppState: () => initialState,
    },
});

export const {
    setInitialized,
    setInitError,
    setAppLocation,
    updateDataTimestamp,
    setLifecycleState,
    resetAppState,
} = appSlice.actions;

export default appSlice.reducer;

type RootState = { app: AppState };

export const selectIsAppReady = (state: RootState) => state.app.isInitialized;
export const selectInitError = (state: RootState) => state.app.initError;
export const selectAppLocation = (state: RootState) => state.app.location;
export const selectDataFetchedAt = (state: RootState) => state.app.dataFetchedAt;
export const selectLifecycleState = (state: RootState) => state.app.lifecycleState;

export const STALE_THRESHOLD_MS = 5 * 60 * 1000;
