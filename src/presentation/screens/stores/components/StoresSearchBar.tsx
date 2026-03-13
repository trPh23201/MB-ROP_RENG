import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../../theme/iconConstants';
import { STORES_TEXT } from '../StoresConstants';
import { STORES_LAYOUT } from '../StoresLayout';

interface StoresSearchBarProps { value: string; onChangeText: (text: string) => void; }

export function StoresSearchBar({ value, onChangeText }: StoresSearchBarProps) {
  const BRAND_COLORS = useBrandColors();
  const handleMapPress = () => {
    console.log('[StoresSearchBar] Map button pressed (placeholder)');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchInput, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
        <AppIcon name={HEADER_ICONS.SEARCH} size="sm" color={BRAND_COLORS.secondary.s6} />
        <TextInput
          style={[styles.input, { color: BRAND_COLORS.secondary.s5 }]}
          placeholder={STORES_TEXT.SEARCH_PLACEHOLDER}
          placeholderTextColor={BRAND_COLORS.secondary.s6}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: STORES_LAYOUT.SEARCH_BAR_MARGIN_HORIZONTAL,
    marginBottom: STORES_LAYOUT.SEARCH_BAR_MARGIN_BOTTOM,
    gap: 5,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.05,
    borderRadius: STORES_LAYOUT.SEARCH_BAR_BORDER_RADIUS,
    paddingHorizontal: STORES_LAYOUT.SEARCH_BAR_PADDING_HORIZONTAL,
    gap: STORES_LAYOUT.SEARCH_BAR_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: STORES_LAYOUT.SEARCH_INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: STORES_LAYOUT.MAP_BUTTON_BORDER_RADIUS,
    paddingHorizontal: STORES_LAYOUT.MAP_BUTTON_PADDING_HORIZONTAL,
    paddingVertical: STORES_LAYOUT.MAP_BUTTON_PADDING_VERTICAL,
    gap: STORES_LAYOUT.MAP_BUTTON_GAP,
    borderWidth: 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapButtonText: {
    fontSize: STORES_LAYOUT.MAP_BUTTON_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});