import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';

interface OrderStatusChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function OrderStatusChip({ label, isSelected, onPress }: OrderStatusChipProps) {
  const BRAND_COLORS = useBrandColors();
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: BRAND_COLORS.screenBg.warm, borderColor: BRAND_COLORS.ui.placeholder },
        isSelected && [styles.chipSelected, { backgroundColor: BRAND_COLORS.bta.primaryBg, borderColor: BRAND_COLORS.bta.primaryBg }]
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.chipText,
        { color: BRAND_COLORS.ui.subtitle },
        isSelected && [styles.chipTextSelected, { color: BRAND_COLORS.bta.primaryText }]
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipSelected: {
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    fontWeight: '600',
  },
});