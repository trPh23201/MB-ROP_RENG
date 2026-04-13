import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { HEADER_ICONS } from '../../../theme/iconConstants';
import { STORES_TEXT } from '../StoresConstants';
import { STORES_LAYOUT } from '../StoresLayout';

export function StoresHeader() {
  const BRAND_COLORS = useBrandColors();
  const handleVoucherPress = () => {
    // Voucher navigation: not yet implemented
  };

  const handleNotificationPress = () => {
    // Notification navigation: not yet implemented
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: BRAND_COLORS.secondary.s5 }]}>{STORES_TEXT.SCREEN_TITLE}</Text>
      <View style={styles.iconGroup}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}
          onPress={handleVoucherPress}
          activeOpacity={0.7}
        >
          <AppIcon name={HEADER_ICONS.VOUCHER} size="sm" />
          <View style={[styles.badge, { backgroundColor: BRAND_COLORS.secondary.s3 }]}>
            <Text style={styles.badgeText}>{STORES_TEXT.VOUCHER_BADGE}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: BRAND_COLORS.primary.p1 }]}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          <View style={[styles.badge, styles.badgeRed, { backgroundColor: BRAND_COLORS.secondary.s3 }]}>
            <Text style={styles.badgeText}>{STORES_TEXT.NOTIFICATION_COUNT}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: STORES_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: STORES_LAYOUT.HEADER_PADDING_VERTICAL,
  },
  title: {
    fontSize: STORES_LAYOUT.HEADER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    width: STORES_LAYOUT.HEADER_ICON_SIZE,
    height: STORES_LAYOUT.HEADER_ICON_SIZE,
    borderRadius: STORES_LAYOUT.HEADER_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: STORES_LAYOUT.HEADER_BADGE_TOP,
    right: STORES_LAYOUT.HEADER_BADGE_RIGHT,
    width: STORES_LAYOUT.HEADER_BADGE_SIZE,
    height: STORES_LAYOUT.HEADER_BADGE_SIZE,
    borderRadius: STORES_LAYOUT.HEADER_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRed: {
    backgroundColor: '#FF0000',
  },
  badgeText: {
    fontSize: STORES_LAYOUT.HEADER_BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: '#FFFFFF',
  },
});