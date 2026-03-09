import { fetchBrands, selectBrand as selectBrandAction, selectBrandError, selectBrandLoading, selectBrands, selectSelectedBrandId } from '@/src/state/slices/brandSlice';
import { useAppSelector } from '@/src/utils/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BRAND_COLORS } from '../../theme/colors';
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
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const brands = useAppSelector(selectBrands);
    const selectedBrandId = useAppSelector(selectSelectedBrandId);
    const loading = useAppSelector(selectBrandLoading);
    const error = useAppSelector(selectBrandError);
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
        (brandId: number) => {
            dispatch(selectBrandAction(brandId));
        },
        [dispatch],
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
                    style={[styles.brandCard, isSelected && styles.brandCardSelected]}
                >
                    {isSelected && (
                        <View style={styles.selectedCheck}>
                            <Text style={styles.selectedCheckText}>✓</Text>
                        </View>
                    )}

                    <View style={styles.brandLogoContainer}>
                        {item.logoUrl ? (
                            <Image
                                source={{ uri: item.logoUrl }}
                                style={styles.brandLogoImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.brandLogoFallback}>
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </View>

                    <Text style={styles.brandName} numberOfLines={2}>
                        {item.name}
                    </Text>
                </Pressable>
            );
        },
        [selectedBrandId, handleSelectBrand],
    );

    const renderContent = () => {
        if (loading && brands.length === 0) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={BRAND_COLORS.bta.primaryBg}
                    />
                    <Text style={styles.loadingText}>
                        {SELECT_BRAND_CONSTANTS.LOADING_TEXT}
                    </Text>
                </View>
            );
        }

        if (error && brands.length === 0) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable style={styles.retryButton} onPress={handleRetry}>
                        <Text style={styles.retryButtonText}>
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
                            !selectedBrandId && styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={!selectedBrandId}
                    >
                        <Text style={styles.continueButtonText}>
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
                            style={[styles.title, { fontFamily: 'Phudu-Bold' }]}
                        >
                            {SELECT_BRAND_CONSTANTS.TITLE}
                        </Text>
                        <Text
                            style={[styles.subtitle, { fontFamily: 'SpaceGrotesk-Medium' }]}
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
