import { StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.screenBg.bold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: 60,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: BRAND_COLORS.primary.beSua,
    fontSize: 16,
    textAlign: 'center',
  },
  brandName: {
    fontSize: 40,
    fontWeight: '700',
    color: BRAND_COLORS.primary.xanhReu,
    letterSpacing: 2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: BRAND_COLORS.primary.xanhReu,
    letterSpacing: 4,
    marginTop: 8,
    textAlign: 'center',
  },
});