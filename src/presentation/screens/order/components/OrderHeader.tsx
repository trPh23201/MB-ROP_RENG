import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { ORDER_TEXT } from '../OrderConstants';
import { orderStyles } from '../styles';

export function OrderHeader() {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={[orderStyles.header, { backgroundColor: BRAND_COLORS.screenBg.fresh }]}>
      <View style={orderStyles.headerLeft}>
        <AppIcon name="grid-outline" size="sm" />
        <Text style={[orderStyles.headerTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_TEXT.HEADER_TITLE}</Text>
        <AppIcon name="chevron-down-outline" size="sm" />
      </View>
      
      <View style={orderStyles.headerRight}>
        <TouchableOpacity>
          <AppIcon name="search-outline" size="sm" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AppIcon name="heart-outline" size="sm" />
        </TouchableOpacity>
      </View>
    </View>
  );
}