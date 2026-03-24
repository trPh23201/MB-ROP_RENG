import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../shared/AppIcon';
import { useBrandColors } from '../../theme/BrandColorContext';
import { WELCOME_TEXT } from '../../screens/welcome/WelcomeConstants';
import { ENTRY_LAYOUT } from './EntryLayout';

interface EntryQuickActionsProps {
  onActionPress: (actionId: string, label: string) => void;
}

export function EntryQuickActions({ onActionPress }: EntryQuickActionsProps) {
  const BRAND_COLORS = useBrandColors();
  return (
    <View style={[styles.container, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
      {WELCOME_TEXT.QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionItem}
          onPress={() => onActionPress(action.id, action.label)}
        >
          <View style={[styles.iconContainer, { backgroundColor: BRAND_COLORS.primary.p2 }]}>
            <AppIcon name={action.icon} size="lg" />
          </View>
          <Text style={[styles.label, { color: BRAND_COLORS.primary.p3 }]}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: ENTRY_LAYOUT.QUICK_ACTION_CONTAINER_BORDER_RADIUS,
    padding: ENTRY_LAYOUT.QUICK_ACTION_CONTAINER_PADDING,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    alignItems: 'center',
    gap: ENTRY_LAYOUT.QUICK_ACTION_GAP,
  },
  iconContainer: {
    width: ENTRY_LAYOUT.QUICK_ACTION_ICON_SIZE,
    height: ENTRY_LAYOUT.QUICK_ACTION_ICON_SIZE,
    borderRadius: ENTRY_LAYOUT.QUICK_ACTION_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: ENTRY_LAYOUT.QUICK_ACTION_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'center',
  },
});
