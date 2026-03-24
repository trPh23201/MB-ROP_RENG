import { useBrandColors } from '@/src/presentation/theme/BrandColorContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { MenuItemData } from '../MoreInterfaces';
import { MORE_LAYOUT } from '../MoreLayout';
import { styles } from '../styles';

interface Props {
  item: MenuItemData;
  isLast?: boolean;
  onPress: (id: string) => void;
}

export const MenuItem = ({ item, isLast, onPress }: Props) => {
  const BRAND_COLORS = useBrandColors();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.menuItem, { backgroundColor: BRAND_COLORS.screenBg.warm }]}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.menuIcon}>
        <AppIcon
          name={item.icon}
          size={MORE_LAYOUT.MENU_ICON_SIZE}
          color={item.isDestructive ? '#D32F2F' : '#666'}
        />
      </View>
      <Text style={[styles.menuLabel, { color: BRAND_COLORS.ui.heading }, item.isDestructive && styles.destructiveText]}>
        {item.label}
      </Text>
      {!item.isDestructive && (
        <AppIcon name="chevron-forward" size={20} color="#CCC" />
      )}
      
      {!isLast && <View style={[StyleSheet.absoluteFillObject, styles.menuItemBorder, { borderBottomColor: BRAND_COLORS.ui.placeholder }, { top: undefined }]} />}
    </TouchableOpacity>
  );
};