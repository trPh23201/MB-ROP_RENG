import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';

interface OrderStatusChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function OrderStatusChip({ label, isSelected, onPress }: OrderStatusChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
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
    backgroundColor: BRAND_COLORS.screenBg.warm,
    marginRight: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.ui.placeholder,
  },
  chipSelected: {
    backgroundColor: BRAND_COLORS.bta.primaryBg,
    borderColor: BRAND_COLORS.bta.primaryBg,
  },
  chipText: {
    fontSize: 14,
    color: BRAND_COLORS.ui.subtitle,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: BRAND_COLORS.bta.primaryText,
    fontWeight: '600',
  },
});