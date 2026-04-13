import { fetchBrands, selectBrand as selectBrandAction, selectBrandError, selectBrandLoading, selectBrands, selectSelectedBrandId } from '@/src/state/slices/brandSlice';
import { AppDispatch } from '@/src/state/store';
import { useAppSelector } from '@/src/utils/hooks';
import { useBrandColor } from '@/src/utils/hooks/useBrandColor';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useBrandColors } from '../../theme/BrandColorContext';
import { SELECT_BRAND_CONSTANTS } from './constants';
import { selectBrandStyles as styles } from './styles';

type SerializableBrand = {
    id: number;
    name: string;
    logoUrl: string | null;
    description: string;
    isActive: boolean;
    colors: { id: number; colorName: string; hexCode: string }[];
};

export default function SelectBrandScreen() {
    const BRAND_COLORS = useBrandColors();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { fetchAndCacheBrand, applyBrandColors } = useBrandColor();
    const brands = useAppSelector(selectBrands);
    const isLoading = useAppSelector(selectBrandLoading);
    const error = useAppSelector(selectBrandError);
    const selectedBrandId = useAppSelector(selectSelectedBrandId);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;


    useEffect(() => {
        dispatch(fetchBrands());

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [dispatch, fadeAnim, slideAnim]);

    const handleSelectBrand = useCallback(
        async (brandId: number) => {
            dispatch(selectBrandAction(brandId));

            try {
                await fetchAndCacheBrand(brandId);
                await applyBrandColors(brandId);
            } catch (err) {
                // Error captured by Sentry
            }
        },
        [dispatch, fetchAndCacheBrand, applyBrandColors],
    );

    const handleContinue = useCallback(() => {
        if (selectedBrandId) {
            router.replace('/(tabs)');
        }
    }, [selectedBrandId, router]);

    const handleRetry = useCallback(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const renderBrandCard = useCallback(
        ({ item }: { item: SerializableBrand }) => {
            const isSelected = selectedBrandId === item.id;

            return (
                <Pressable
                    onPress={() => handleSelectBrand(item.id)}
                    style={[
                        styles.brandCard,
                        { backgroundColor: BRAND_COLORS.background.primary, borderColor: BRAND_COLORS.border.light, shadowColor: BRAND_COLORS.shadow.light },
                        isSelected && [styles.brandCardSelected, { borderColor: BRAND_COLORS.bta.primaryBg, shadowColor: BRAND_COLORS.bta.primaryBg }]
                    ]}
                >
                    {isSelected && (
                        <View style={[styles.selectedCheck, { backgroundColor: BRAND_COLORS.bta.primaryBg }]}>
                            <Text style={[styles.selectedCheckText, { color: BRAND_COLORS.bta.primaryText }]}>✓</Text>
                        </View>
                    )}

                    <View style={[styles.brandLogoContainer, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
                        {item.logoUrl ? (
                            <Image
                                source={{ uri: item.logoUrl }}
                                style={styles.brandLogoImage}
                                contentFit="cover"
                                cachePolicy="disk"
                            />
                        ) : (
                            <Text style={[styles.brandLogoFallback, { color: BRAND_COLORS.ui.heading }]}>
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </View>

                    <Text style={[styles.brandName, { color: BRAND_COLORS.ui.heading }]} numberOfLines={2}>
                        {item.name}
                    </Text>
                </Pressable>
            );
        },
        [selectedBrandId, handleSelectBrand],
    );

    const renderContent = () => {
        if (isLoading && brands.length === 0) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={BRAND_COLORS.bta.primaryBg}
                    />
                    <Text style={[styles.loadingText, { color: BRAND_COLORS.ui.subtitle }]}>
                        {SELECT_BRAND_CONSTANTS.LOADING_TEXT}
                    </Text>
                </View>
            );
        }

        if (error && brands.length === 0) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: BRAND_COLORS.semantic.error }]}>{error}</Text>
                    <Pressable style={[styles.retryButton, { backgroundColor: BRAND_COLORS.bta.accentBg }]} onPress={handleRetry}>
                        <Text style={[styles.retryButtonText, { color: BRAND_COLORS.bta.accentText }]}>
                            {SELECT_BRAND_CONSTANTS.ERROR_RETRY}
                        </Text>
                    </Pressable>
                </View>
            );
        }

        return (
            <>
                <FlatList
                    data={brands}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderBrandCard}
                    style={styles.brandList}
                    contentContainerStyle={styles.brandListContent}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[
                            styles.continueButton,
                            { backgroundColor: BRAND_COLORS.bta.primaryBg, shadowColor: BRAND_COLORS.bta.primaryBg },
                            !selectedBrandId && [styles.continueButtonDisabled, { backgroundColor: BRAND_COLORS.ui.placeholder }],
                        ]}
                        onPress={handleContinue}
                        disabled={!selectedBrandId}
                    >
                        <Text style={[styles.continueButtonText, { color: BRAND_COLORS.bta.primaryText }]}>
                            {SELECT_BRAND_CONSTANTS.BUTTON_TEXT}
                        </Text>
                    </Pressable>
                </View>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={BRAND_COLORS.screenBg.gradient as [string, string, ...string[]]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.headerContainer}>
                        <Text
                            style={[styles.title, { color: BRAND_COLORS.ui.heading }, { fontFamily: 'Phudu-Bold' }]}
                        >
                            {SELECT_BRAND_CONSTANTS.TITLE}
                        </Text>
                        <Text
                            style={[styles.subtitle, { color: BRAND_COLORS.ui.subtitle }, { fontFamily: 'SpaceGrotesk-Medium' }]}
                        >
                            {SELECT_BRAND_CONSTANTS.SUBTITLE}
                        </Text>
                    </View>

                    {renderContent()}
                </Animated.View>
            </LinearGradient>
        </View>
    );
}
