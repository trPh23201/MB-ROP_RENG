import { useBrandColors } from '@/src/presentation/theme/BrandColorContext';
import React from 'react';
import { Text, View } from 'react-native';
import { MORE_STRINGS } from '../MoreConstants';
import { styles } from '../styles';

export const VersionFooter = () => {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={styles.footerContainer}>
      <Text style={[styles.versionText, { color: BRAND_COLORS.ui.placeholder }]}>{MORE_STRINGS.VERSION}</Text>
    </View>
  );
};