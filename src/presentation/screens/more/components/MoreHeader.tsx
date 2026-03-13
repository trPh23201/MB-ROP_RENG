import { useBrandColors } from '@/src/presentation/theme/BrandColorContext';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MORE_STRINGS } from '../MoreConstants';
import { styles } from '../styles';

export const MoreHeader = () => {
  const BRAND_COLORS = useBrandColors();
  const insets = useSafeAreaInsets();
  return (
      <View style={[styles.headerContainer, { backgroundColor: BRAND_COLORS.screenBg.bold, borderBottomColor: BRAND_COLORS.screenBg.fresh }, { paddingTop: insets.top }]}>
        <Text style={[styles.headerTitle, { color: BRAND_COLORS.text.inverse }]}>{MORE_STRINGS.HEADER_TITLE}</Text>
      </View>
  );
};