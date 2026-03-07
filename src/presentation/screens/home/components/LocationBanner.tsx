import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';

interface LocationBannerProps {
  userAddress?: string;
  locationError?: string | null;
  onPress?: () => void;
}

export function LocationBanner({ userAddress, locationError, onPress }: LocationBannerProps) {
  if (locationError) {
    return (
      <View style={styles.errorBanner}>
        <AppIcon name="alert-circle-outline" size="sm" style={styles.errorIcon} />
        <Text style={styles.errorText}>
          {locationError} - Hiển thị menu mặc định
        </Text>
      </View>
    );
  }

  if (!userAddress) return null;

  return (
    <TouchableOpacity
      style={styles.addressBanner}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.addressContent}>
        <AppIcon name="location" size="md" style={styles.locationIcon} />
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressLabel}>Vị trí hiện tại</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {userAddress}
          </Text>
        </View>
      </View>
      <AppIcon name="chevron-forward" size="sm" style={styles.chevronIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF4F4',
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    color: '#FF3B30',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#FF3B30',
  },

  addressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    color: BRAND_COLORS.primary.xanhReu,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  chevronIcon: {
    color: BRAND_COLORS.text.secondary,
  },
});