import {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/shared/AppIcon';
import { useBrandColors } from '../theme/BrandColorContext';
import { TYPOGRAPHY } from '../theme/typography';

export interface BaseBottomSheetLayoutProps {
    children: React.ReactNode;

    // Header configuration
    title?: string;
    showCloseButton?: boolean;
    showClearButton?: boolean;
    clearButtonText?: string;
    onClose?: () => void;
    onClear?: () => void;
    headerRightComponent?: React.ReactNode;

    // Sheet configuration
    snapPoints?: (string | number)[];
    initialSnapIndex?: number;
    enablePanDownToClose?: boolean;
    enableDynamicSizing?: boolean;

    // Footer
    footerComponent?: React.ComponentType<BottomSheetFooterProps>;

    // Backdrop
    backdropOpacity?: number;
    backdropPressBehavior?: 'close' | 'none' | 'collapse';

    // Callbacks
    onChange?: (index: number) => void;
    onDismiss?: () => void;

    // Stack behavior
    stackBehavior?: 'push' | 'replace';
}

const HEADER_HEIGHT = 60;
const HEADER_ICON_SIZE = 24;

import { SPRING_CONFIG } from '../constants/animation-configs';

export const BaseBottomSheetLayout = forwardRef<BottomSheetModal, BaseBottomSheetLayoutProps>(
    (
        {
            children,
            title,
            showCloseButton = true,
            showClearButton = false,
            clearButtonText = 'Xóa',
            onClose,
            onClear,
            headerRightComponent,
            snapPoints = ['90%'],
            initialSnapIndex = 0,
            enablePanDownToClose = true,
            enableDynamicSizing = false,
            footerComponent,
            backdropOpacity = 0.5,
            backdropPressBehavior = 'close',
            onChange,
            onDismiss,
            stackBehavior = 'push',
        },
        ref
    ) => {
        const BRAND_COLORS = useBrandColors();
        const insets = useSafeAreaInsets();

        // Memoize default snap points if not provided
        const finalSnapPoints = useMemo(() => snapPoints, [snapPoints]);

        const renderBackdrop = useCallback(
            (props: BottomSheetDefaultBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={backdropOpacity}
                    pressBehavior={backdropPressBehavior}
                />
            ),
            [backdropOpacity, backdropPressBehavior]
        );

        const renderFooter = useCallback(
            (props: BottomSheetFooterProps) => {
                if (!footerComponent) return null;
                const Footer = footerComponent;
                return (
                    <BottomSheetFooter {...props} bottomInset={0}>
                        <Footer {...props} />
                    </BottomSheetFooter>
                );
            },
            [footerComponent]
        );

        // Default handle styles
        const backgroundStyle = useMemo(
            () => ({
                backgroundColor: BRAND_COLORS.screenBg.warm,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
            }),
            [BRAND_COLORS]
        );

        const indicatorStyle = useMemo(
            () => ({
                backgroundColor: BRAND_COLORS.ui.placeholder,
                width: 40,
                height: 4,
            }), [BRAND_COLORS]
        );


        return (
            <BottomSheetModal
                ref={ref}
                index={initialSnapIndex}
                snapPoints={finalSnapPoints}
                animationConfigs={SPRING_CONFIG}
                onChange={onChange}
                onDismiss={onDismiss}
                enablePanDownToClose={enablePanDownToClose}
                enableDynamicSizing={enableDynamicSizing}
                backdropComponent={renderBackdrop}
                footerComponent={renderFooter}
                stackBehavior={stackBehavior}
                topInset={insets.top}
                backgroundStyle={backgroundStyle}
                handleIndicatorStyle={indicatorStyle}
            >
                <View style={[styles.header, { borderBottomWidth: title ? 1 : 0, borderBottomColor: BRAND_COLORS.ui.placeholder }]}>
                    {showClearButton ? (
                        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={[styles.clearText, { color: BRAND_COLORS.ui.subtitle }]}>{clearButtonText}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 30 }} />
                    )}

                    {title && <Text style={[styles.title, { color: BRAND_COLORS.ui.heading }]}>{title}</Text>}

                    {headerRightComponent ? (
                        headerRightComponent
                    ) : showCloseButton ? (
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.closeButton}>
                            <AppIcon name="close" size={HEADER_ICON_SIZE} color={BRAND_COLORS.ui.subtitle} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 30 }} />
                    )}
                </View>

                {children}
            </BottomSheetModal>
        );
    }
);
BaseBottomSheetLayout.displayName = 'BaseBottomSheetLayout';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: HEADER_HEIGHT,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        flex: 1,
        textAlign: 'center',
    },
    clearText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    },
    closeButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
