import { createTamagui, createTokens } from 'tamagui';
import { BRAND_COLORS } from './src/presentation/theme/colors';

const tokens = createTokens({
  color: {
    // Primary colors
    p1: BRAND_COLORS.primary.p1,
    p2: BRAND_COLORS.primary.p2,
    p3: BRAND_COLORS.primary.p3,
    // Secondary colors
    s1: BRAND_COLORS.secondary.s1,
    s2: BRAND_COLORS.secondary.s2,
    s3: BRAND_COLORS.secondary.s3,
    s4: BRAND_COLORS.secondary.s4,
    s5: BRAND_COLORS.secondary.s5,
    s6: BRAND_COLORS.secondary.s6,
    // System colors
    background: BRAND_COLORS.background.default,
    white: BRAND_COLORS.background.default,
    black: BRAND_COLORS.background.black,
  },
  space: {
    0: 0,
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
    true: 16,
  },
  size: {
    0: 0,
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
    true: 16,
  },
  radius: {
    0: 0,
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    24: 24,
    32: 32,
    full: 9999,
    true: 12,
  },
  zIndex: {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  },
});

const config = createTamagui({
  tokens,
  themes: {
    light: {
      background: BRAND_COLORS.background.default,
      color: BRAND_COLORS.primary.p3,
    },
  },
});

export default config;

export type AppTamagui = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamagui {}
}