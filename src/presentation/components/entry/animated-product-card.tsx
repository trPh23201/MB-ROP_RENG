import React from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { EntryProductCard, ProductCardData } from './EntryProductCard';

interface AnimatedProductCardProps {
  product: ProductCardData;
  onPress?: (product: ProductCardData) => void;
}

// Wraps EntryProductCard with a scale press animation via onTouch* events.
// Uses Animated.View instead of Pressable to avoid double press handling
// (EntryProductCard already has its own TouchableOpacity).
export function AnimatedProductCard({ product, onPress }: AnimatedProductCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const springIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const springOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={springIn}
      onTouchEnd={springOut}
      onTouchCancel={springOut}
    >
      <EntryProductCard product={product} onPress={onPress} />
    </Animated.View>
  );
}
