import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { UtilityItemData } from '../MoreInterfaces';
import { MORE_LAYOUT } from '../MoreLayout';
import { styles } from '../styles';

interface Props {
  item: UtilityItemData;
  onPress?: (id: string) => void;
}

export const UtilityItem = ({ item, onPress }: Props) => {
  const BRAND_COLORS = useBrandColors();
  return (
    <TouchableOpacity style={styles.gridItem} onPress={() => onPress?.(item.id)}>
      <View style={[styles.iconContainer, { backgroundColor: BRAND_COLORS.ui.iconFill, borderColor: BRAND_COLORS.bta.primaryBg }]}>
        <AppIcon
          name={item.icon}
          size={MORE_LAYOUT.GRID_ICON_SIZE}
          color={BRAND_COLORS.primary.p3}
        />
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.gridLabel, { color: BRAND_COLORS.ui.heading }]}>{item.label}</Text>
    </TouchableOpacity>
  );
};