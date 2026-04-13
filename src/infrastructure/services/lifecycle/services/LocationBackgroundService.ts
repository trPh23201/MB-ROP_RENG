import { locationService } from '@/src/infrastructure/services';
import { setAppLocation } from '@/src/state/slices/appSlice';
import { store } from '@/src/state/store';
import { BaseBackgroundService } from '../BackgroundService.base';
import { IServiceMetadata, ServicePriority } from '../appLifecycle.types';

export class LocationBackgroundService extends BaseBackgroundService {
    readonly metadata: IServiceMetadata = {
        name: 'LocationService',
        priority: ServicePriority.HIGH,
        runOnForeground: false,
    };

    async startup(): Promise<void> {
        const location = await locationService.getCurrentPosition();
        store.dispatch(
            setAppLocation({
                lat: location.latitude,
                lng: location.longitude,
            })
        );
    }
}
