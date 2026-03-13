import { useBrandColors } from '@/src/presentation/theme/BrandColorContext';
import React from 'react';
import { Text, View } from 'react-native';
import { MenuSectionData } from '../MoreInterfaces';
import { styles } from '../styles';
import { MenuItem } from './MenuItem';

interface Props { section: MenuSectionData; onItemPress: (id: string) => void; }

export const MenuSection = ({ section, onItemPress }: Props) => {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={[styles.sectionContainer, { backgroundColor: BRAND_COLORS.screenBg.warm }]}>
      {section.title && <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>{section.title}</Text>}
      {section.items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          isLast={index === section.items.length - 1}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
};