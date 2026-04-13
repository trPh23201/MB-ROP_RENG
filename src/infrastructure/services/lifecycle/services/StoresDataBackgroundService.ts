import { fetchStores } from '@/src/state/slices/storesSlice';
import { store } from '@/src/state/store';
import { BaseBackgroundService } from '../BackgroundService.base';
import { IServiceMetadata, ServicePriority } from '../appLifecycle.types';

export class StoresDataBackgroundService extends BaseBackgroundService {
    readonly metadata: IServiceMetadata = {
        name: 'StoresDataService',
        priority: ServicePriority.HIGH,
        runOnForeground: false,
    };

    async startup(): Promise<void> {
        await this.fetchStoresData();
    }

    async onForeground(): Promise<void> {
        await this.fetchStoresData();
    }

    private async fetchStoresData(): Promise<void> {
        try {
            await store.dispatch(fetchStores({ page: 1, limit: 20, refresh: true }));
        } catch (error) {
            // Error captured by Sentry
            throw error;
        }
    }
}
