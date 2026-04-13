import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';
import { TYPOGRAPHY } from '../../../theme/typography';

interface OptionItem {
  id: string;
  label: string;
}

interface OptionSelectorRowProps {
  title: string;
  hint?: string;
  options: OptionItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  required?: boolean;
}

export const OptionSelectorRow = React.memo(function OptionSelectorRow({
  title,
  hint,
  options,
  selectedId,
  onSelect,
  required,
}: OptionSelectorRowProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: BRAND_COLORS.ui.heading }]}>
        {title}
        {required && (
          <Text style={[styles.required, { color: BRAND_COLORS.semantic.error }]}> *</Text>
        )}
      </Text>
      {hint && (
        <Text style={[styles.sectionHint, { color: BRAND_COLORS.ui.subtitle }]}>{hint}</Text>
      )}
      <View style={styles.optionRow}>
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                { borderColor: BRAND_COLORS.ui.placeholder, backgroundColor: BRAND_COLORS.screenBg.warm },
                isSelected && { borderColor: BRAND_COLORS.secondary.s3, backgroundColor: `${BRAND_COLORS.secondary.s3}18` },
              ]}
              onPress={() => onSelect(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: BRAND_COLORS.ui.heading },
                  isSelected && { color: BRAND_COLORS.secondary.s3, fontFamily: TYPOGRAPHY.fontFamily.bodyBold },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    marginBottom: 4,
  },
  required: {},
  sectionHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    marginBottom: 12,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
  },
});
