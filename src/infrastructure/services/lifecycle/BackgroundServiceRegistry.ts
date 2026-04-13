import { AppLifecycleEvent, IBackgroundService } from './appLifecycle.types';
import { appLifecycle } from './AppLifecycleManager';

class BackgroundServiceRegistry {
    private services = new Map<string, IBackgroundService>();
    private isStarted = false;

    register(service: IBackgroundService): void {
        if (this.services.has(service.metadata.name)) {
            return;
        }
        this.services.set(service.metadata.name, service);
    }

    async runStartup(): Promise<{ success: boolean; errors: string[] }> {
        if (this.isStarted) {
            return { success: true, errors: [] };
        }

        const errors: string[] = [];
        const sorted = this.getSortedServices();

        for (const service of sorted) {
            try {
                await service.startup();
            } catch (error) {
                const msg = `${service.metadata.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(msg);
                // Error captured by Sentry
            }
        }

        this.isStarted = true;
        this.subscribeToLifecycle();

        return { success: errors.length === 0, errors };
    }

    private getSortedServices(): IBackgroundService[] {
        return [...this.services.values()].sort(
            (a, b) => a.metadata.priority - b.metadata.priority
        );
    }

    private subscribeToLifecycle(): void {
        appLifecycle.subscribe(async (event, prevEvent) => {
            if (event === AppLifecycleEvent.FOREGROUND && prevEvent === AppLifecycleEvent.BACKGROUND) {
                await this.handleForeground();
            } else if (event === AppLifecycleEvent.BACKGROUND) {
                await this.handleBackground();
            }
        });
    }

    private async handleForeground(): Promise<void> {
        for (const service of this.getSortedServices()) {
            if (service.metadata.runOnForeground && service.onForeground) {
                try {
                    await service.onForeground();
                } catch (error) {
                    // Error captured by Sentry
                }
            }
        }
    }

    private async handleBackground(): Promise<void> {
        for (const service of this.getSortedServices()) {
            if (service.onBackground) {
                try {
                    await service.onBackground();
                } catch (error) {
                    // Error captured by Sentry
                }
            }
        }
    }
}

export const serviceRegistry = new BackgroundServiceRegistry();
