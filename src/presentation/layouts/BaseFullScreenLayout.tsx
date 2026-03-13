import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../theme/colors';
import { BaseLayoutProps } from './BaseLayout';

export interface BaseFullScreenLayoutProps extends BaseLayoutProps {
    // Lifecycle hooks (Template Method pattern)
    onMount?: () => void | Promise<void>;
    onUnmount?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;

    // Header configuration
    renderHeader?: () => React.ReactNode;
    headerMode?: 'default' | 'transparent' | 'hidden';

    // Safe area configuration
    safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];

    // Background configuration
    backgroundColor?: string;

    // Keyboard behavior
    keyboardAvoidingBehavior?: 'padding' | 'height' | 'position';
    keyboardVerticalOffset?: number;
}

/**
 * BaseFullScreenLayout provides the skeleton structure for full-screen pages.
 * Handles safe area insets, lifecycle hooks, and common UI scaffolding.
 */
export function BaseFullScreenLayout({
    children,
    onMount,
    onUnmount,
    onFocus,
    onBlur,
    renderHeader,
    headerMode = 'default',
    safeAreaEdges = ['top'],
    backgroundColor = BRAND_COLORS.background.default,
    keyboardAvoidingBehavior,
    keyboardVerticalOffset = 0,
    style,
    testID,
}: BaseFullScreenLayoutProps) {
    
    useEffect(() => {
        onMount?.();
        return () => onUnmount?.();
    }, [onMount, onUnmount]);

    // Focus/Blur lifecycle
    useFocusEffect(
        useCallback(() => {
            onFocus?.();
            return () => onBlur?.();
        }, [onFocus, onBlur])
    );

    const containerStyle: StyleProp<ViewStyle> = {
        flex: 1,
        backgroundColor: backgroundColor,
        paddingTop: headerMode === 'transparent' ? 0 : undefined,
    };

    const content = (
        <View style={[containerStyle, style]} testID={testID}>
            {renderHeader?.()}
            <View style={{ flex: 1 }}>
                {children}
            </View>
        </View>
    );

    if (keyboardAvoidingBehavior) {
        return (
            <KeyboardAvoidingView
                behavior={keyboardAvoidingBehavior}
                keyboardVerticalOffset={keyboardVerticalOffset}
                style={{ flex: 1 }}
            >
                {content}
            </KeyboardAvoidingView>
        );
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor }}
            edges={safeAreaEdges}
        >
            {content}
        </SafeAreaView>
    );
}
