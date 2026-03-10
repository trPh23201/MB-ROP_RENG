import { StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';

export const selectBrandStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },

    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: BRAND_COLORS.ui.heading,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: BRAND_COLORS.ui.subtitle,
        textAlign: 'center',
        letterSpacing: 0.3,
    },

    brandList: {
        flex: 1,
    },
    brandListContent: {
        paddingBottom: 20,
    },

    brandCard: {
        backgroundColor: BRAND_COLORS.background.primary,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: BRAND_COLORS.border.light,
        shadowColor: BRAND_COLORS.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    brandCardSelected: {
        borderColor: BRAND_COLORS.bta.primaryBg,
        backgroundColor: '#F5F7ED',
        shadowColor: BRAND_COLORS.bta.primaryBg,
        shadowOpacity: 0.3,
        elevation: 6,
    },
    brandLogoContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: BRAND_COLORS.screenBg.warm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        overflow: 'hidden',
    },
    brandLogoImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    brandLogoFallback: {
        fontSize: 28,
        color: BRAND_COLORS.ui.heading,
        fontWeight: '600',
    },
    brandName: {
        fontSize: 16,
        fontWeight: '600',
        color: BRAND_COLORS.ui.heading,
        flex: 1,
    },
    selectedCheck: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: BRAND_COLORS.bta.primaryBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCheckText: {
        color: BRAND_COLORS.bta.primaryText,
        fontSize: 14,
        fontWeight: '700',
    },

    buttonContainer: {
        paddingTop: 16,
    },
    continueButton: {
        backgroundColor: BRAND_COLORS.bta.primaryBg,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND_COLORS.bta.primaryBg,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonDisabled: {
        backgroundColor: BRAND_COLORS.ui.placeholder,
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: BRAND_COLORS.bta.primaryText,
        letterSpacing: 0.5,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: BRAND_COLORS.ui.subtitle,
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    errorText: {
        fontSize: 15,
        color: BRAND_COLORS.semantic.error,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: BRAND_COLORS.bta.accentBg,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: BRAND_COLORS.bta.accentText,
    },
});