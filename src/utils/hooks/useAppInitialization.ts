/**
 * useAppInitialization Hook
 * Single-point initialization for the app
 */
import { registerAllBackgroundServices, serviceRegistry } from '@/src/infrastructure/services/lifecycle';
import { setInitError, setInitialized } from '@/src/state/slices/appSlice';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks';

export function useAppInitialization() {
    const dispatch = useAppDispatch();
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                registerAllBackgroundServices();

                const result = await serviceRegistry.runStartup();

                if (!isMounted) return;

                if (!result.success) {
                    const errMsg = result.errors.join(', ');
                    dispatch(setInitError(errMsg));
                    setError(errMsg);
                    // Error captured by Sentry
                    return;
                }

                dispatch(setInitialized(true));
                setIsReady(true);
            } catch (err) {
                if (!isMounted) return;

                const msg = err instanceof Error ? err.message : 'Init failed';
                dispatch(setInitError(msg));
                setError(msg);
                // Error captured by Sentry
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return { isReady, error };
}
