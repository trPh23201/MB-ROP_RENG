
const DEFAULT_PRIMARY = { p1: '#FAEDC0', p2: '#D4DF9A', p3: '#606A37' };
const DEFAULT_SECONDARY = { s1: '#BADA55', s2: '#D5E100', s3: '#5B4537', s4: '#F1A5A1', s5: '#444E27', s6: '#BC9E70' };

const colorStore = {
  primary: { ...DEFAULT_PRIMARY },
  secondary: { ...DEFAULT_SECONDARY },
};

export function updateColorStore(colorMap: Map<string, string>): void {
  for (const [name, hex] of colorMap) {
    if (name in colorStore.primary) {
      (colorStore.primary as any)[name] = hex;
    } else if (name in colorStore.secondary) {
      (colorStore.secondary as any)[name] = hex;
    }
  }
}

export function resetColorStore(): void {
  Object.assign(colorStore.primary, DEFAULT_PRIMARY);
  Object.assign(colorStore.secondary, DEFAULT_SECONDARY);
}

const STATIC_COLORS = {
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#8A8A8A',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
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
};

type BrandColorsShape = {
  primary: { p1: string; p2: string; p3: string };
  secondary: { s1: string; s2: string; s3: string; s4: string; s5: string; s6: string };
  text: { primary: string; secondary: string; tertiary: string; disabled: string; inverse: string; accent: string };
  background: typeof STATIC_COLORS.background;
  border: { light: string; medium: string; dark: string; focus: string };
  semantic: typeof STATIC_COLORS.semantic;
  overlay: typeof STATIC_COLORS.overlay;
  shadow: typeof STATIC_COLORS.shadow;
  screenBg: { warm: string; fresh: string; bold: string; gradient: string[] };
  ui: { heading: string; subtitle: string; placeholder: string; badge: string; iconFill: string; promo: string };
  bta: { primaryBg: string; primaryText: string; secondaryText: string; accentBg: string; accentText: string };
};

const proxyHandler: ProxyHandler<typeof STATIC_COLORS> = {
  get(_target, prop: string) {
    const p = colorStore.primary;
    const s = colorStore.secondary;

    switch (prop) {
      case 'primary':
        return { ...p };
      case 'secondary':
        return { ...s };
      case 'screenBg':
        return { warm: p.p1, fresh: p.p2, bold: p.p3, gradient: [p.p3, p.p2, p.p1, '#FFFFFF'] };
      case 'ui':
        return { heading: s.s5, subtitle: s.s3, placeholder: s.s6, badge: s.s4, iconFill: s.s1, promo: s.s2 };
      case 'bta':
        return { primaryBg: p.p3, primaryText: '#FFFFFF', secondaryText: s.s6, accentBg: s.s1, accentText: s.s5 };
      case 'text':
        return { ...STATIC_COLORS.text, accent: p.p3 };
      case 'border':
        return { ...STATIC_COLORS.border, focus: p.p3 };
      case 'background':
      case 'semantic':
      case 'overlay':
      case 'shadow':
        return (STATIC_COLORS as any)[prop];

      default:
        return undefined;
    }
  },
};

export const BRAND_COLORS = new Proxy(STATIC_COLORS, proxyHandler) as unknown as BrandColorsShape;

export type BrandColorsType = BrandColorsShape;

export const COLORS = BRAND_COLORS;