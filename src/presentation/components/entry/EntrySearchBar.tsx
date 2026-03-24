import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../shared/AppIcon';
import { useBrandColors } from '../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { ENTRY_LAYOUT } from './EntryLayout';

export function EntrySearchBar() {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();

  const handleSearchPress = () => {
    router.push('../(tabs)/search');
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: BRAND_COLORS.primary.p1 }]} onPress={handleSearchPress} activeOpacity={0.8}>
      <AppIcon name={HEADER_ICONS.SEARCH} size="sm" color={BRAND_COLORS.secondary.s6} />
      <Text style={[styles.placeholder, { color: BRAND_COLORS.secondary.s6 }]}>Tìm kiếm</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: ENTRY_LAYOUT.SEARCH_BAR_BORDER_RADIUS,
    paddingHorizontal: ENTRY_LAYOUT.SEARCH_BAR_PADDING_HORIZONTAL,
    paddingVertical: ENTRY_LAYOUT.SEARCH_BAR_PADDING_VERTICAL,
    gap: ENTRY_LAYOUT.SEARCH_BAR_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholder: {
    fontSize: ENTRY_LAYOUT.SEARCH_BAR_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});
