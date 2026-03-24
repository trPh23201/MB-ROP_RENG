import { selectAppLocation, selectDataFetchedAt, STALE_THRESHOLD_MS, updateDataTimestamp } from '@/src/state/slices/appSlice';
import { fetchHomeMenu, fetchVouchers } from '@/src/state/slices/homeSlice';
import { store } from '@/src/state/store';
import { BaseBackgroundService } from '../BackgroundService.base';
import { IServiceMetadata, ServicePriority } from '../appLifecycle.types';

export class HomeDataBackgroundService extends BaseBackgroundService {
    readonly metadata: IServiceMetadata = {
        name: 'HomeDataService',
        priority: ServicePriority.MEDIUM,
        runOnForeground: true,
    };

    async startup(): Promise<void> {
        await this.fetchData();
    }

    async onForeground(): Promise<void> {
        const state = store.getState();
        const dataFetchedAt = selectDataFetchedAt(state);
        const isStale = !dataFetchedAt || (Date.now() - dataFetchedAt > STALE_THRESHOLD_MS);
        if (isStale) {
            console.log('[HomeDataBackgroundService] Data stale, refreshing...');
            await this.fetchData();
        } else {
            console.log('[HomeDataBackgroundService] Data still fresh, skipping refresh');
        }
    }

    private async fetchData(): Promise<void> {
        const location = selectAppLocation(store.getState());
        if (!location) {
            throw new Error('Location not available');
        }

        console.log('[HomeDataBackgroundService] Fetching home data...');

        await Promise.all([
            store.dispatch(fetchHomeMenu({ lat: location.lat, lng: location.lng, limit: 10, page: 0 })),
            store.dispatch(fetchVouchers({ lat: location.lat, lng: location.lng, limit: 20, page: 0 })),
        ]);

        store.dispatch(updateDataTimestamp(Date.now()));
        console.log('[HomeDataBackgroundService] Home data fetched and cached');
    }
}
