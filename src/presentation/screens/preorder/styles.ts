/**
 * PreOrder Screen - Shared Styles
 * Purpose: Reusable StyleSheet for PreOrder components
 */

import { StyleSheet } from 'react-native';

export const preOrderStyles = StyleSheet.create({
  // Common
  divider: {
    height: 1,
  },
  
  // Shadows
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});