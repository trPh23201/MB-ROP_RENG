import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { HEADER_ICONS } from '../../../theme/iconConstants';
import { HOME_LAYOUT } from '../HomeLayout';

export function HomeSearchBar() {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push('../(tabs)/search');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSearchPress} activeOpacity={0.8}>
      <AppIcon name={HEADER_ICONS.SEARCH} size="sm" color={BRAND_COLORS.secondary.nauCaramel} />
      <Text style={styles.placeholder}>Tìm kiếm</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_SEARCH_BAR_BORDER_RADIUS,
    paddingHorizontal: HOME_LAYOUT.HOME_SEARCH_BAR_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HOME_SEARCH_BAR_PADDING_VERTICAL,
    gap: HOME_LAYOUT.HOME_SEARCH_BAR_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholder: {
    fontSize: HOME_LAYOUT.HOME_SEARCH_BAR_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauCaramel,
  },
});