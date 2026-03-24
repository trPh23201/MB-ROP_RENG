import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useBrandColors } from '../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../theme/typography';

interface GlobalTextProps extends RNTextProps {
  variant?: 'heading' | 'body' | 'mono';
  weight?: 'medium' | 'semiBold' | 'bold';
  color?: string;
}

export function GlobalText({
  variant = 'body',
  weight = 'medium',
  color = BRAND_COLORS.primary.p3,
  style,
  ...props
}: GlobalTextProps) {
  const BRAND_COLORS = useBrandColors();
  const getFontFamily = () => {
    switch (variant) {
      case 'heading':
        return TYPOGRAPHY.fontFamily.heading;
      case 'mono':
        return TYPOGRAPHY.fontFamily.monoBold;
      case 'body':
      default:
        return TYPOGRAPHY.fontFamily.bodyBold;
    }
  };

  return (
    <RNText
      style={[
        styles.base,
        { fontFamily: getFontFamily(), color },
        style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
});