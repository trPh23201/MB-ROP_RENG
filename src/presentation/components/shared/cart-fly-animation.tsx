import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { FlyPosition, FlyState } from '../../hooks/use-cart-fly-animation';

interface CartFlyAnimationProps {
  flyState: FlyState | null;
  cartPosition: FlyPosition;
  progress: SharedValue<number>;
}

const FLY_SIZE = 40;

// Absolute-positioned overlay that animates a product thumbnail along a
// quadratic bezier curve from its card position to the MiniCartButton.
// Rendered at the top of the screen tree so it overlays all other content.
export function CartFlyAnimation({ flyState, cartPosition, progress }: CartFlyAnimationProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!flyState) {
      return { opacity: 0, pointerEvents: 'none' } as const;
    }

    const { startPosition } = flyState;
    const startX = startPosition.x;
    const startY = startPosition.y;

    // Center end point on the MiniCartButton
    const endX = cartPosition.x + cartPosition.width / 2 - FLY_SIZE / 2;
    const endY = cartPosition.y + cartPosition.height / 2 - FLY_SIZE / 2;

    // Quadratic bezier control point arcs above both endpoints
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - 120;

    const t = progress.value;
    const u = 1 - t;

    // B(t) = u²·P0 + 2u·t·P1 + t²·P2
    const x = u * u * startX + 2 * u * t * controlX + t * t * endX;
    const y = u * u * startY + 2 * u * t * controlY + t * t * endY;

    const scale = interpolate(t, [0, 1], [1, 0.25]);
    const opacity = interpolate(t, [0, 0.6, 1], [1, 0.6, 0]);

    return {
      opacity,
      transform: [{ translateX: x }, { translateY: y }, { scale }],
    };
  });

  // Skip rendering entirely when no animation is active
  if (!flyState) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        source={{ uri: flyState.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: FLY_SIZE,
    height: FLY_SIZE,
    borderRadius: FLY_SIZE / 2,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 20,
  },
  image: {
    width: FLY_SIZE,
    height: FLY_SIZE,
  },
});
