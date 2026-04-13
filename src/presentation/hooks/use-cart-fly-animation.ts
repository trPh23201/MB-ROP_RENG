import { useCallback, useState } from 'react';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { HapticFeedback } from '../utils/HapticFeedback';

export interface FlyPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlyState {
  imageUrl: string;
  startPosition: FlyPosition;
}

// Manages bezier fly animation state for cart thumbnail visual feedback.
// Call triggerFly with product image + absolute start position (pageX/Y from measure).
// Call onCartLayout when MiniCartButton mounts to register its absolute position.
export function useCartFlyAnimation() {
  const [flyState, setFlyState] = useState<FlyState | null>(null);
  const [cartPosition, setCartPosition] = useState<FlyPosition>({
    x: 0,
    y: 0,
    width: 44,
    height: 44,
  });

  // 0 → 1 drives bezier curve interpolation in CartFlyAnimation
  const progress = useSharedValue(0);

  const onFinish = useCallback(() => {
    HapticFeedback.medium();
    setFlyState(null);
  }, []);

  const onCartLayout = useCallback((x: number, y: number, width: number, height: number) => {
    setCartPosition({ x, y, width, height });
  }, []);

  const triggerFly = useCallback(
    (startPos: FlyPosition, imageUrl: string) => {
      setFlyState({ imageUrl, startPosition: startPos });
      progress.value = 0;
      progress.value = withTiming(
        1,
        { duration: 420, easing: Easing.bezier(0.2, 0.8, 0.2, 1) },
        (finished) => {
          if (finished) {
            runOnJS(onFinish)();
          }
        }
      );
    },
    [progress, onFinish]
  );

  return { flyState, cartPosition, progress, onCartLayout, triggerFly };
}
