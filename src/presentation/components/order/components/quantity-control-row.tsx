import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';

interface QuantityControlRowProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const QuantityControlRow = React.memo(function QuantityControlRow({
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlRowProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={styles.quantityControls}>
      <TouchableOpacity
        style={[styles.quantityButton, { backgroundColor: `${BRAND_COLORS.secondary.s3}20` }]}
        onPress={onDecrease}
      >
        <Ionicons name="remove" size={20} color={BRAND_COLORS.secondary.s3} />
      </TouchableOpacity>

      <Text style={[styles.quantityValue, { color: BRAND_COLORS.ui.heading }]}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.quantityButton, { backgroundColor: `${BRAND_COLORS.secondary.s3}20` }]}
        onPress={onIncrease}
      >
        <Ionicons name="add" size={20} color={BRAND_COLORS.secondary.s3} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    minWidth: 24,
    textAlign: 'center',
  },
});
