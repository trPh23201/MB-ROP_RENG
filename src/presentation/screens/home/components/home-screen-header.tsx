import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../../theme/iconConstants';
import { HOME_LAYOUT } from '../HomeLayout';
import { HOME_TEXT } from '../HomeConstants';

interface HomeScreenHeaderProps {
  userName: string;
  voucherCount: number;
}

export const HomeScreenHeader = React.memo(function HomeScreenHeader({
  userName,
  voucherCount,
}: HomeScreenHeaderProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <AppIcon
          name={HEADER_ICONS.GREETING}
          size="lg"
          style={[styles.greetingIcon, { color: BRAND_COLORS.primary.p1 }]}
        />
        <Text
          style={[styles.greetingText, { color: BRAND_COLORS.primary.p1 }]}
          numberOfLines={1}
        >
          {userName}{HOME_TEXT.HEADER.GREETING_SUFFIX}
        </Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={[styles.voucherBadge, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
          <AppIcon name={HEADER_ICONS.VOUCHER} size="sm" />
          <Text style={[styles.voucherCount, { color: BRAND_COLORS.primary.p3 }]}>{voucherCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
          <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HEADER_PADDING_VERTICAL,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HOME_LAYOUT.GREETING_GAP,
    flex: 1,
  },
  greetingIcon: {},
  greetingText: {
    fontSize: HOME_LAYOUT.GREETING_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.VOUCHER_BADGE_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.VOUCHER_BADGE_PADDING_VERTICAL,
    borderRadius: HOME_LAYOUT.VOUCHER_BADGE_BORDER_RADIUS,
    gap: HOME_LAYOUT.VOUCHER_BADGE_GAP,
  },
  voucherCount: {
    fontSize: HOME_LAYOUT.VOUCHER_BADGE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  iconButton: {
    width: HOME_LAYOUT.HEADER_ICON_SIZE,
    height: HOME_LAYOUT.HEADER_ICON_SIZE,
    borderRadius: HOME_LAYOUT.HEADER_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
