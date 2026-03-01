import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchProfile, logout } from '../../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BaseFullScreenLayout } from '../../layouts/BaseFullScreenLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
import { PROFILE_STRINGS } from './ProfileConstants';

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user?.uuid) {
            dispatch(fetchProfile(user.uuid));
        }
    }, [isAuthenticated, user?.uuid, dispatch]);

    const handleRefresh = useCallback(() => {
        if (isAuthenticated && user?.uuid) {
            dispatch(fetchProfile(user.uuid));
        }
    }, [isAuthenticated, user?.uuid, dispatch]);

    const handleLogout = useCallback(() => {
        popupService.confirm(
            PROFILE_STRINGS.LOGOUT_CONFIRM_MSG,
            {
                title: PROFILE_STRINGS.LOGOUT_CONFIRM_TITLE,
                cancelText: PROFILE_STRINGS.CANCEL,
                confirmText: PROFILE_STRINGS.AGREE,
                confirmStyle: 'destructive',
            }
        ).then((confirmed) => {
            if (confirmed) {
                dispatch(logout());
                // router.replace('/');
            }
        });
    }, [dispatch]);

    const handleLogin = useCallback(() => {
        router.push('../(auth)/login');
    }, [router]);

    const formatDate = (dateString?: Date | string | null) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const InfoRow = ({ label, value, icon, isLast = false }: { label: string, value: string, icon: keyof typeof Ionicons.glyphMap, isLast?: boolean }) => (
        <View style={[styles.infoRow, isLast && styles.noBorder]}>
            <View style={styles.infoLabelContainer}>
                <Ionicons name={icon} size={20} color={BRAND_COLORS.text.tertiary} style={styles.icon} />
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    if (!isAuthenticated || !user) {
        return (
            <BaseFullScreenLayout backgroundColor={BRAND_COLORS.background.default} safeAreaEdges={['left', 'right', 'bottom']}>
                <View style={styles.unauthContainer}>
                    <Ionicons name="person-circle-outline" size={80} color={BRAND_COLORS.text.disabled} />
                    <Text style={styles.unauthText}>{PROFILE_STRINGS.LOGIN_REQUIRED}</Text>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                        <Text style={styles.primaryButtonText}>{PROFILE_STRINGS.LOGIN}</Text>
                    </TouchableOpacity>
                </View>
            </BaseFullScreenLayout>
        );
    }

    return (
        <BaseFullScreenLayout backgroundColor={BRAND_COLORS.background.default} safeAreaEdges={['left', 'right', 'bottom']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[BRAND_COLORS.primary.xanhReu]} />
                }
            >

                <View style={styles.headerSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color={BRAND_COLORS.primary.xanhReu} />
                    </View>
                    <Text style={styles.nameText}>{user.displayName || user.phone}</Text>
                    <Text style={styles.roleText}>{user.role === 'end_user' ? 'Khách hàng' : user.role}</Text>
                </View>

                <View style={styles.cardSection}>
                    <InfoRow label={PROFILE_STRINGS.PHONE} value={user.phone} icon="call-outline" />
                    <InfoRow label={PROFILE_STRINGS.EMAIL} value={user.email || '--'} icon="mail-outline" />
                    <InfoRow label={PROFILE_STRINGS.NAME} value={user.displayName || '--'} icon="person-outline" />
                    <InfoRow label={PROFILE_STRINGS.CREATED_AT} value={formatDate(user.createdAt)} icon="calendar-outline" isLast />
                </View>

                <View style={styles.cardSection}>
                    <View style={styles.pointRow}>
                        <View style={styles.pointBox}>
                            <Text style={styles.pointLabel}>{PROFILE_STRINGS.LOYALTY_POINT}</Text>
                            <Text style={styles.pointValue}>{user.loyaltyPoint}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.pointBox}>
                            <Text style={styles.pointLabel}>{PROFILE_STRINGS.AVAILABLE_POINT}</Text>
                            <Text style={styles.pointValue}>{user.availablePoint}</Text>
                        </View>
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
        color: BRAND_COLORS.text.secondary,
        textAlign: 'center',
        marginVertical: 24,
        lineHeight: 24,
    },
    primaryButton: {
        backgroundColor: BRAND_COLORS.primary.xanhReu,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: BRAND_COLORS.text.inverse,
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
        backgroundColor: BRAND_COLORS.primary.beSua,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
        color: BRAND_COLORS.text.primary,
        marginBottom: 4,
    },
    roleText: {
        fontSize: 14,
        color: BRAND_COLORS.text.secondary,
    },
    cardSection: {
        backgroundColor: BRAND_COLORS.background.paper,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: BRAND_COLORS.shadow.light,
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
        borderBottomColor: BRAND_COLORS.border.light,
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
        color: BRAND_COLORS.text.secondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
        color: BRAND_COLORS.text.primary,
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
        color: BRAND_COLORS.text.secondary,
        marginBottom: 8,
    },
    pointValue: {
        fontSize: 24,
        fontWeight: '700',
        color: BRAND_COLORS.primary.xanhReu,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: BRAND_COLORS.border.light,
    },
    logoutButton: {
        backgroundColor: BRAND_COLORS.background.paper,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: BRAND_COLORS.semantic.error,
    },
    logoutButtonText: {
        color: BRAND_COLORS.semantic.error,
        fontSize: 16,
        fontWeight: '600',
    },
});