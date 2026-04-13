import { router, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAppSelector } from '../../utils/hooks';
import { useBrandColors } from '../theme/BrandColorContext';
import { BaseFullScreenLayout, BaseFullScreenLayoutProps } from './BaseFullScreenLayout';

export interface BaseAuthenticatedLayoutProps extends BaseFullScreenLayoutProps {
    redirectTo?: string;
    preservePendingAction?: boolean;
    onAuthRequired?: () => void;
    onAuthSuccess?: () => void;
    renderAuthLoading?: () => React.ReactNode;
}

/**
 * BaseAuthenticatedLayout extends BaseFullScreenLayout with authentication guards.
 * Automatically redirects unauthenticated users to the login screen.
 */
export function BaseAuthenticatedLayout({
    children,
    redirectTo = '/(auth)/login',
    onAuthRequired,
    onAuthSuccess,
    preservePendingAction = false,
    renderAuthLoading,
    onMount,
    ...rest
}: BaseAuthenticatedLayoutProps) {
    const BRAND_COLORS = useBrandColors();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const pathname = usePathname();

    // Handle Auth Check
    useEffect(() => {
        if (!isAuthenticated) {
            if (onAuthRequired) {
                onAuthRequired();
            }

            // In a real app, we would dispatch a pending action here if preservePendingAction is true
            // dispatch(setPendingAction({ route: pathname }));

            router.replace(redirectTo as any);
        } else {
            if (onAuthSuccess) {
                onAuthSuccess();
            }
        }
    }, [isAuthenticated, redirectTo, onAuthRequired, onAuthSuccess, pathname]);

    // If not authenticated, show loading or nothing while redirecting
    if (!isAuthenticated) {
        if (renderAuthLoading) {
            return <>{renderAuthLoading()}</>;
        }
        return (
            <BaseFullScreenLayout {...rest}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={BRAND_COLORS.primary.p3} />
                </View>
            </BaseFullScreenLayout>
        );
    }

    return (
        <BaseFullScreenLayout onMount={onMount} {...rest}>
            {children}
        </BaseFullScreenLayout>
    );
}
