import { AppState, AppStateStatus } from 'react-native';
import { IS_IOS } from '../../../utils/platform';
import { AppLifecycleEvent } from './appLifecycle.types';

type LifecycleListener = (event: AppLifecycleEvent, prevEvent: AppLifecycleEvent) => void;

class AppLifecycleManager {
    private static instance: AppLifecycleManager;
    private listeners = new Set<LifecycleListener>();
    private currentEvent: AppLifecycleEvent = AppLifecycleEvent.FOREGROUND;
    private subscription: ReturnType<typeof AppState.addEventListener> | null = null;

    private constructor() {
        this.subscription = AppState.addEventListener('change', this.handleStateChange);
    }

    static getInstance(): AppLifecycleManager {
        if (!AppLifecycleManager.instance) {
            AppLifecycleManager.instance = new AppLifecycleManager();
        }
        return AppLifecycleManager.instance;
    }

    subscribe(listener: LifecycleListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    getCurrentEvent(): AppLifecycleEvent {
        return this.currentEvent;
    }

    private handleStateChange = (nextState: AppStateStatus) => {
        const prevEvent = this.currentEvent;
        const nextEvent = this.mapStateToEvent(nextState);

        if (prevEvent !== nextEvent) {
            this.currentEvent = nextEvent;
            this.listeners.forEach(listener => listener(nextEvent, prevEvent));
        }
    };

    private mapStateToEvent(state: AppStateStatus): AppLifecycleEvent {
        switch (state) {
            case 'active':
                return AppLifecycleEvent.FOREGROUND;
            case 'background':
                return AppLifecycleEvent.BACKGROUND;
            case 'inactive':
                return IS_IOS ? AppLifecycleEvent.INACTIVE : AppLifecycleEvent.FOREGROUND;
            default:
                return AppLifecycleEvent.FOREGROUND;
        }
    }

    destroy(): void {
        this.subscription?.remove();
        this.listeners.clear();
    }
}

export const appLifecycle = AppLifecycleManager.getInstance();
