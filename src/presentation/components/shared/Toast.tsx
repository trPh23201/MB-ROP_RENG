import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface ToastProps {
  message: string;
  duration?: number;
  onHide: () => void;
}

export function Toast({ message, duration = 2000, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: (width - 300) / 2,
    width: 300,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.beSua,
    textAlign: 'center',
  },
});

// ========== Toast Manager ==========
let currentToast: (() => void) | null = null;

export function showToast(message: string, duration = 2000) {
  // Hide current toast if exists
  if (currentToast) {
    currentToast();
  }

  // Create new toast (requires React root wrapper)
  console.log('[Toast]', message); // Fallback for now
  
  // TODO: Implement proper toast manager with React portal
  // For MVP: Using Alert as fallback for product unavailable
}