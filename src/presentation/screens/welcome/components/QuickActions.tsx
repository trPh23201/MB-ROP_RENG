import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthGuard } from '../../../../utils/hooks/useAuthGuard';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../WelcomeConstants';

export function QuickActions() {
  const handleActionPress = useAuthGuard(
    (actionId: string, label: string) => {
      console.log(`Clicked: ${label} (${actionId})`);
      router.push('/(tabs)/order');
    },
    'PURCHASE',
    (actionId: string) => ({ actionId, returnTo: '/welcome' })
  );

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
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: BRAND_COLORS.primary.xanhBo,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});