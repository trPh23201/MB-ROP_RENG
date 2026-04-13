import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';
import { PopupContext } from './PopupContext';
import { popupService } from './PopupService';

export function PopupRenderer() {
    const BRAND_COLORS = useBrandColors();
    const { state, dispatch } = useContext(PopupContext);
    const { current, isVisible, isAnimating } = state;

    useEffect(() => {
        if (isAnimating && !isVisible) {
            dispatch({ type: 'ANIMATION_COMPLETE' });
        }
    }, [isAnimating, isVisible, dispatch]);

    useEffect(() => {
        if (!current || !isVisible) return;

        const onBackPress = () => {
            popupService.dismiss(current.id);
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [current, isVisible]);

    if (!current || !isVisible) return null;

    const { id, config } = current;

    const handleConfirm = () => {
        popupService.resolve(id, true);
    };

    const handleCancel = () => {
        popupService.resolve(id, false);
    };

    const renderContent = () => {
        switch (config.type) {
            case 'loading':
                return (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        {config.message && <Text style={styles.loadingText}>{config.message}</Text>}
                    </View>
                );

            case 'alert':
                return (
                    <View style={styles.card}>
                        {config.title && <Text style={[styles.title, { color: BRAND_COLORS.text.primary }]}>{config.title}</Text>}
                        <Text style={[styles.message, { color: BRAND_COLORS.text.secondary }]}>{config.message}</Text>
                        <TouchableOpacity style={[styles.buttonMain, { backgroundColor: BRAND_COLORS.primary.p3 }]} onPress={() => popupService.resolve(id, undefined)}>
                            <Text style={styles.buttonMainText}>{config.buttonText || 'Đóng'}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'confirm':
                return (
                    <View style={styles.card}>
                        {config.title && <Text style={[styles.title, { color: BRAND_COLORS.text.primary }]}>{config.title}</Text>}
                        <Text style={[styles.message, { color: BRAND_COLORS.text.secondary }]}>{config.message}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.buttonSecondary, { backgroundColor: BRAND_COLORS.background.paper, borderColor: BRAND_COLORS.border.medium }]} onPress={handleCancel}>
                                <Text style={[styles.buttonSecondaryText, { color: BRAND_COLORS.text.primary }]}>{config.cancelText || 'Hủy'}</Text>
                            </TouchableOpacity>
                            <View style={{ width: 12 }} />
                            <TouchableOpacity
                                style={[
                                    styles.buttonMain,
                                    { flex: 1, backgroundColor: BRAND_COLORS.primary.p3 },
                                    config.confirmStyle === 'destructive' && { backgroundColor: BRAND_COLORS.semantic.error }
                                ]}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.buttonMainText}>{config.confirmText || 'Đồng ý'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'custom': {
                const CustomComponent = config.component;
                const customProps = config.props || {};
                return (
                    <CustomComponent
                        {...customProps}
                        onResolve={(value: unknown) => popupService.resolve(id, value)}
                        onDismiss={() => popupService.dismiss(id)}
                    />
                );
            }

            default:
                return null;
        }
    };

    return (
        <View style={styles.overlay} pointerEvents="auto">
            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 9999,
        elevation: 9999,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10000,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.heading,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
    },
    buttonMain: {
        width: '50%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonMainText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        fontSize: TYPOGRAPHY.fontSize.md,
    },
    buttonSecondary: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonSecondaryText: {
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        fontSize: TYPOGRAPHY.fontSize.md,
    },
    loadingContainer: {
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 16,
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 12,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        fontSize: TYPOGRAPHY.fontSize.md,
    },
});



