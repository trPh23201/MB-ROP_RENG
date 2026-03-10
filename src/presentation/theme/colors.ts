
export const BRAND_COLORS = {
  primary: {
    beSua: '#FAEDC0',
    xanhBo: '#D4DF9A',
    xanhReu: '#606A37',
  },

  secondary: {
    xanhChanh: '#BADA55',
    xanhNeon: '#D5E100',
    nauEspresso: '#5B4537',
    hongSua: '#F1A5A1',
    reuDam: '#444E27',
    nauCaramel: '#BC9E70',
    vangNhat: '#F9E5A0',
  },

  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#8A8A8A',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    accent: '#606A37',
  },

  background: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    tertiary: '#F0F0F0',
    paper: '#FFFFFF',
    default: '#F5F5F5',
    black: '#000000',
  },

  border: {
    light: '#E8E8E8',
    medium: '#D0D0D0',
    dark: '#A0A0A0',
    focus: '#606A37',
  },

  semantic: {
    success: '#4CAF50',
    error: '#E74C3C',
    warning: '#FF9800',
    info: '#2196F3',
  },

  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.15)',
    heavy: 'rgba(0, 0, 0, 0.25)',
  },

  screenBg: {
    warm: '#FAEDC0',
    fresh: '#D4DF9A',
    bold: '#606A37',
    gradient: ['#606A37', '#D4DF9A', '#FAEDC0', '#FFFFFF'],
  },

  ui: {
    heading: '#444E27',
    subtitle: '#5B4537',
    placeholder: '#BC9E70',
    badge: '#F1A5A1',
    iconFill: '#BADA55',
    promo: '#D5E100',
  },

  bta: {
    primaryBg: '#606A37',
    primaryText: '#FFFFFF',
    secondaryText: '#BC9E70',
    accentBg: '#BADA55',
    accentText: '#444E27',
  },
};

export const DYNAMIC_COLORS = {
  colorTest: {
    red: '#FFFFFF',
    blue: '#000000',
  },
};

export type BrandColorsType = typeof BRAND_COLORS;

export const COLORS = BRAND_COLORS;