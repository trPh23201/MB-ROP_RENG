import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { networkService } from '../../../infrastructure/services/NetworkService';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';

interface NetworkGuardProps {
    children: React.ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
    const BRAND_COLORS = useBrandColors();
    const [isConnected, setIsConnected] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        // Subscribe to network changes
        const unsubscribe = networkService.subscribe((connected) => {
            setIsConnected(connected);
            // Hide loading if connected
            if (connected) {
                setIsChecking(false);
            }
        });

        return unsubscribe;
    }, []);

    const handleRetry = async () => {
        setIsChecking(true);
        // Force check connection
        const connected = await networkService.checkConnection();
        // If still not connected, stop loading after delay to show retry failed
        if (!connected) {
            setTimeout(() => {
                setIsChecking(false);
            }, 500);
        }
    };

    return (
        <>
            {children}
            <Modal
                visible={!isConnected}
                transparent={false}
                animationType="fade"
                statusBarTranslucent
            >
                <View style={[styles.container, { backgroundColor: BRAND_COLORS.background.default }]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="sad-outline" size={64} color={BRAND_COLORS.text.secondary} />
                    </View>

                    <Text style={[styles.title, { color: BRAND_COLORS.text.primary }]}>Oh no! Chúng ta mất kết nối thật rồi</Text>
                    <Text style={[styles.message, { color: BRAND_COLORS.text.secondary }]}>
                        Bạn hãy kiểm tra lại kết nối internet nhé.{'\n'}
                        Hệ thống sẽ tự động kết nối lại khi có mạng.
                    </Text>

                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: BRAND_COLORS.primary.p3 }]}
                        onPress={handleRetry}
                        disabled={isChecking}
                    >
                        {isChecking ? (<ActivityIndicator color="white" />) :
                            (<Text style={styles.retryText}>Thử lại</Text>)}
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 12,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontFamily: TYPOGRAPHY.fontFamily.heading,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 140,
        minHeight: 48,
        alignItems: 'center',
    },
    retryText: {
        color: 'white',
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        fontSize: TYPOGRAPHY.fontSize.md,
    },
});