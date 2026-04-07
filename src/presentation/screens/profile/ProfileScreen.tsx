import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProfile } from '../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { useBrandColors } from '../../theme/BrandColorContext';
import { PROFILE_STRINGS } from './ProfileConstants';

export default function ProfileScreen() {
    const BRAND_COLORS = useBrandColors();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);
    const isLoading = useAppSelector((state) => state.auth.isLoading);

    useEffect(() => {
        if (isAuthenticated && user?.uuid) {
            dispatch(fetchProfile(user.uuid));
        }
    }, [isAuthenticated, user?.uuid, dispatch]);

    const handleRefresh = () => {
        if (isAuthenticated && user?.uuid) {
            dispatch(fetchProfile(user.uuid));
        }
    };

    const handleLogin = () => {
        router.push('../(auth)/login');
    };

    const formatDate = (dateString?: Date | string | null) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const InfoRow = ({ label, value, icon, isLast = false }: { label: string, value: string, icon: keyof typeof Ionicons.glyphMap, isLast?: boolean }) => (
        <View style={[styles.infoRow, { borderBottomColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm }, isLast && styles.noBorder]}>
            <View style={styles.infoLabelContainer}>
                <Ionicons name={icon} size={20} color={BRAND_COLORS.text.tertiary} style={styles.icon} />
                <Text style={[styles.infoLabel, { color: BRAND_COLORS.ui.subtitle }]}>{label}</Text>
            </View>
            <Text style={[styles.infoValue, { color: BRAND_COLORS.ui.heading }]}>{value}</Text>
        </View>
    );

    if (!isAuthenticated || !user) {
        return (
            <BaseFullScreenLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['top', 'left', 'right', 'bottom']}>
                <View style={styles.unauthContainer}>
                    <Ionicons name="person-circle-outline" size={80} color={BRAND_COLORS.text.disabled} />
                    <Text style={[styles.unauthText, { color: BRAND_COLORS.ui.subtitle }]}>{PROFILE_STRINGS.LOGIN_REQUIRED}</Text>
                    <TouchableOpacity style={[styles.primaryButton, { backgroundColor: BRAND_COLORS.bta.primaryBg }]} onPress={handleLogin}>
                        <Text style={[styles.primaryButtonText, { color: BRAND_COLORS.bta.primaryText }]}>{PROFILE_STRINGS.LOGIN}</Text>
                    </TouchableOpacity>
                </View>
            </BaseFullScreenLayout>
        );
    }

    return (
        <BaseFullScreenLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['top', 'left', 'right', 'bottom']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[BRAND_COLORS.bta.primaryBg]} />
                }
            >

                <View style={styles.headerSection}>
                    <View style={[styles.avatarContainer, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
                        <Ionicons name="person" size={40} color={BRAND_COLORS.bta.primaryBg} />
                    </View>
                    <Text style={[styles.nameText, { color: BRAND_COLORS.ui.heading }]}>{user.displayName || user.phone}</Text>
                    <Text style={[styles.roleText, { color: BRAND_COLORS.ui.subtitle }]}>{user.role === 'end_user' ? 'Khách hàng' : user.role}</Text>
                </View>

                <View style={[styles.cardSection, { backgroundColor: BRAND_COLORS.screenBg.warm, shadowColor: BRAND_COLORS.shadow.light }]}>
                    <InfoRow label={PROFILE_STRINGS.PHONE} value={user.phone} icon="call-outline" />
                    <InfoRow label={PROFILE_STRINGS.EMAIL} value={user.email || '--'} icon="mail-outline" />
                    <InfoRow label={PROFILE_STRINGS.NAME} value={user.displayName || '--'} icon="person-outline" />
                    <InfoRow label={PROFILE_STRINGS.CREATED_AT} value={formatDate(user.createdAt)} icon="calendar-outline" isLast />
                </View>

                <View style={[styles.cardSection, { backgroundColor: BRAND_COLORS.screenBg.warm, shadowColor: BRAND_COLORS.shadow.light }]}>
                    <View style={styles.pointRow}>
                        <View style={styles.pointBox}>
                            <Text style={[styles.pointLabel, { color: BRAND_COLORS.ui.subtitle }]}>{PROFILE_STRINGS.LOYALTY_POINT}</Text>
                            <Text style={[styles.pointValue, { color: BRAND_COLORS.ui.heading }]}>{user.loyaltyPoint}</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: BRAND_COLORS.ui.placeholder }]} />
                        <View style={styles.pointBox}>
                            <Text style={[styles.pointLabel, { color: BRAND_COLORS.ui.subtitle }]}>{PROFILE_STRINGS.AVAILABLE_POINT}</Text>
                            <Text style={[styles.pointValue, { color: BRAND_COLORS.ui.heading }]}>{user.availablePoint}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.cardSection, { backgroundColor: BRAND_COLORS.screenBg.warm, shadowColor: BRAND_COLORS.shadow.light }]}>
                    <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>Mã của bạn</Text>

                    <View style={styles.codeContainer}>
                        <Text style={[styles.codeLabel, { color: BRAND_COLORS.ui.subtitle }]}>QR Code</Text>
                        {user.qrcodeUrl ? (
                            <Image source={{ uri: user.qrcodeUrl }} style={styles.qrImage} resizeMode="contain" />
                        ) : (
                            <Text style={[styles.emptyCodeText, { color: BRAND_COLORS.text.disabled }]}>Chưa có QR code</Text>
                        )}
                    </View>

                    <View style={[styles.codeContainer, styles.codeContainerSpacing]}>
                        <Text style={[styles.codeLabel, { color: BRAND_COLORS.ui.subtitle }]}>Barcode</Text>
                        {user.barcodeUrl ? (
                            <Image source={{ uri: user.barcodeUrl }} style={styles.barcodeImage} resizeMode="contain" />
                        ) : (
                            <Text style={[styles.emptyCodeText, { color: BRAND_COLORS.text.disabled }]}>Chưa có barcode</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </BaseFullScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    unauthContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    unauthText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 24,
        lineHeight: 24,
    },
    primaryButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    roleText: {
        fontSize: 14,
    },
    cardSection: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    infoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 15,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pointBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    pointLabel: {
        fontSize: 13,
        marginBottom: 8,
    },
    pointValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    codeContainer: {
        alignItems: 'center',
    },
    codeContainerSpacing: {
        marginTop: 20,
    },
    codeLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    qrImage: {
        width: 180,
        height: 180,
    },
    barcodeImage: {
        width: '100%',
        height: 100,
    },
    emptyCodeText: {
        fontSize: 14,
        textAlign: 'center',
    },
});