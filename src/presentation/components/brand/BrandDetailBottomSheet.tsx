import { Brand } from '@/src/domain/entities/Brand';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrandColors } from '../../theme/BrandColorContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 0.7;

interface BrandDetailBottomSheetProps {
    brand: Brand | null;
    onVisit: () => void;
}

export const BrandDetailBottomSheet = forwardRef<BottomSheetModal, BrandDetailBottomSheetProps>(
    ({ brand, onVisit }, ref) => {
        const BRAND_COLORS = useBrandColors();
        const insets = useSafeAreaInsets();
        const snapPoints = useMemo(() => ['95%'], []);

        const animationConfigs = useBottomSheetTimingConfigs({
            duration: 500,
            easing: Easing.out(Easing.cubic),
        });

        const renderBackdrop = useCallback(
            (props: BottomSheetDefaultBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.5}
                    pressBehavior="close"
                />
            ), []
        );

        if (!brand) return null;

        return (
            <BottomSheetModal
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                topInset={insets.top}
                enablePanDownToClose
                enableDynamicSizing={false}
                handleComponent={() => (
                    <View style={styles.handleBar}>
                        <View style={styles.handleIndicator} />
                    </View>
                )}
                backgroundStyle={[styles.sheetBackground, { backgroundColor: BRAND_COLORS.screenBg.warm }]}
                animationConfigs={animationConfigs}
            >
                <View style={styles.sheetBody}>
                    <BottomSheetScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.heroContainer}>
                            {brand.logoUrl ? (
                                <Image
                                    source={{ uri: brand.logoUrl }}
                                    style={styles.heroImage}
                                    contentFit="cover"
                                    cachePolicy="disk"
                                />
                            ) : (
                                <View style={[styles.heroPlaceholder, { backgroundColor: BRAND_COLORS.screenBg.bold }]}>
                                    <Text style={[styles.heroPlaceholderText, { color: BRAND_COLORS.bta.primaryText }]}>
                                        {brand.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.65)']}
                                style={styles.heroGradient}
                            />
                            <View style={styles.heroOverlay}>
                                <Text style={styles.brandName}>{brand.name}</Text>
                            </View>
                        </View>

                        {brand.description ? (
                            <View style={[styles.descriptionCard, { backgroundColor: BRAND_COLORS.background.secondary }]}>
                                <Text style={[styles.description, { color: BRAND_COLORS.ui.subtitle }]}>{brand.description}</Text>
                            </View>
                        ) : null}

                        <View style={[styles.promoCard, { backgroundColor: BRAND_COLORS.screenBg.fresh }]}>
                            <Text style={[styles.promoTitle, { color: BRAND_COLORS.ui.heading }]}>Khám phá {brand.name}</Text>
                            <Text style={[styles.promoText, { color: BRAND_COLORS.ui.subtitle }]}>
                                Thưởng thức hương vị đặc trưng từ {brand.name}. Đặt hàng ngay để nhận ưu đãi!
                            </Text>
                        </View>
                    </BottomSheetScrollView>

                    <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
                        <TouchableOpacity style={[styles.visitButton, { backgroundColor: BRAND_COLORS.bta.primaryBg, shadowColor: BRAND_COLORS.screenBg.bold }]} onPress={onVisit} activeOpacity={0.85}>
                            <Text style={[styles.visitButtonText, { color: BRAND_COLORS.bta.primaryText }]}>Ghé thăm</Text>
                            <Text style={[styles.visitButtonArrow, { color: BRAND_COLORS.bta.primaryText }]}>→</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    sheetBackground: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    handleBar: {
        alignItems: 'center',
        paddingVertical: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    handleIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    sheetBody: {
        flex: 1,
    },
    content: {
        gap: 16,
        paddingBottom: 8,
    },
    heroContainer: {
        width: '100%',
        height: HERO_HEIGHT,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroPlaceholderText: {
        fontSize: 72,
        fontFamily: 'Phudu-Bold',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: HERO_HEIGHT * 0.5,
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    brandName: {
        fontSize: 32,
        fontFamily: 'Phudu-Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    descriptionCard: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
    },
    description: {
        fontSize: 15,
        fontFamily: 'SpaceGrotesk-Medium',
        lineHeight: 22,
    },
    promoCard: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    promoTitle: {
        fontSize: 20,
        fontFamily: 'Phudu-Bold',
        textAlign: 'center',
    },
    promoText: {
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Medium',
        lineHeight: 20,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 48,
        paddingTop: 12,
    },
    visitButton: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    visitButtonText: {
        fontSize: 18,
        fontFamily: 'Phudu-Bold',
        letterSpacing: 0.5,
    },
    visitButtonArrow: {
        fontSize: 20,
        fontFamily: 'Phudu-Bold',
    },
});
