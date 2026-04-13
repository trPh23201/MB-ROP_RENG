import { IBackgroundService, IServiceMetadata, ServicePriority } from './appLifecycle.types';

export function BackgroundService(config: { name: string; priority: ServicePriority; runOnForeground?: boolean }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function <T extends new (...args: any[]) => object>(constructor: T) {
        type ServiceMethod = () => Promise<void>;
        return class extends constructor implements IBackgroundService {
            readonly metadata: IServiceMetadata = {
                name: config.name,
                priority: config.priority,
                runOnForeground: config.runOnForeground ?? false,
            };

            async startup(): Promise<void> {
                const self = this as Record<string, unknown>;
                if ('startup' in this && typeof self.startup === 'function') {
                    return (self.startup as ServiceMethod)();
                }
            }

            async onForeground(): Promise<void> {
                const self = this as Record<string, unknown>;
                if ('onForeground' in this && typeof self.onForeground === 'function') {
                    return (self.onForeground as ServiceMethod)();
                }
            }

            async onBackground(): Promise<void> {
                const self = this as Record<string, unknown>;
                if ('onBackground' in this && typeof self.onBackground === 'function') {
                    return (self.onBackground as ServiceMethod)();
                }
            }

            async cleanup(): Promise<void> {
                const self = this as Record<string, unknown>;
                if ('cleanup' in this && typeof self.cleanup === 'function') {
                    return (self.cleanup as ServiceMethod)();
                }
            }
        };
    };
}

export abstract class BaseBackgroundService implements IBackgroundService {
    abstract readonly metadata: IServiceMetadata;

    abstract startup(): Promise<void>;

    async onForeground(): Promise<void> { }

    async onBackground(): Promise<void> { }

    async cleanup(): Promise<void> { }
}
