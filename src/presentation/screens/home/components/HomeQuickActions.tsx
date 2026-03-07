import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../../welcome/WelcomeConstants';
import { HOME_LAYOUT } from '../HomeLayout';

export function HomeQuickActions() {
  const handleActionPress = (actionId: string, label: string) => {
    console.log(`[HomeQuickActions] Selected: ${label} (${actionId})`);
    // TODO: Navigate to store selection or order flow
  };

  return (
    <View style={styles.container}>
      {WELCOME_TEXT.QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionItem}
          onPress={() => handleActionPress(action.id, action.label)}
        >
          <View style={styles.iconContainer}>
            <AppIcon name={action.icon} size="lg" />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_QUICK_ACTION_CONTAINER_BORDER_RADIUS,
    padding: HOME_LAYOUT.HOME_QUICK_ACTION_CONTAINER_PADDING,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    alignItems: 'center',
    gap: HOME_LAYOUT.HOME_QUICK_ACTION_GAP,
  },
  iconContainer: {
    width: HOME_LAYOUT.HOME_QUICK_ACTION_ICON_SIZE,
    height: HOME_LAYOUT.HOME_QUICK_ACTION_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.xanhBo,
    borderRadius: HOME_LAYOUT.HOME_QUICK_ACTION_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: HOME_LAYOUT.HOME_QUICK_ACTION_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});