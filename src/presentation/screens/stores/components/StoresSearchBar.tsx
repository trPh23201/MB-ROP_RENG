import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { HEADER_ICONS } from '../../../theme/iconConstants';
import { STORES_TEXT } from '../StoresConstants';
import { STORES_LAYOUT } from '../StoresLayout';

interface StoresSearchBarProps { value: string; onChangeText: (text: string) => void; }

export function StoresSearchBar({ value, onChangeText }: StoresSearchBarProps) {
  const handleMapPress = () => {
    console.log('[StoresSearchBar] Map button pressed (placeholder)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInput}>
        <AppIcon name={HEADER_ICONS.SEARCH} size="sm" color={BRAND_COLORS.secondary.nauCaramel} />
        <TextInput
          style={styles.input}
          placeholder={STORES_TEXT.SEARCH_PLACEHOLDER}
          placeholderTextColor={BRAND_COLORS.secondary.nauCaramel}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={styles.mapButton} onPress={handleMapPress} activeOpacity={0.7}>
        <AppIcon name="map-outline" size="sm" />
        <Text style={styles.mapButtonText}>{STORES_TEXT.MAP_BUTTON}</Text>
      </TouchableOpacity>
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
    backgroundColor: BRAND_COLORS.primary.beSua,
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
    color: BRAND_COLORS.secondary.reuDam,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
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
    color: BRAND_COLORS.secondary.reuDam,
  },
});