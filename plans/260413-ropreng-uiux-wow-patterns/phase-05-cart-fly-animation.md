# Phase 5: Cart Fly Animation

## Overview
- **Priority:** P2 (Medium Effort)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** C
- **Depends on:** Phase 2 (haptics utility exists)
- **Implementation Note:** Infrastructure complete (hook + component created). Trigger wiring deferred to follow-up task.

Item image follows a bezier curve from product card to MiniCartButton when added to cart.

## Key Insights
- `useAddToCart` dispatches `addToCart(product)` — animation triggers alongside this
- MiniCartButton position is bottom-right area (fixed position)
- Need to measure: (1) product card image position, (2) MiniCartButton position
- Use Reanimated `withTiming` + `interpolate` for position + scale + opacity along bezier path
- Animation is purely visual overlay — does NOT block cart state update

## File Ownership (EXCLUSIVE)

### New Files
- `src/presentation/components/shared/cart-fly-animation.tsx` — absolute-positioned animated thumbnail that flies from source to cart
- `src/presentation/hooks/use-cart-fly-animation.ts` — hook managing animation state, positions, trigger

### Modified Files
- `src/utils/hooks/useAddToCart.ts` — call fly animation trigger after dispatch
- `src/presentation/screens/home/HomeScreen.tsx` — add CartFlyAnimation overlay + ref for MiniCartButton position

## Implementation Steps

### 1. Create `use-cart-fly-animation.ts`
```tsx
// Hook that manages:
// - cartIconPosition: SharedValue<{x, y}> (measured from MiniCartButton)
// - triggerFly(sourcePosition: {x, y, width, height}, imageUrl: string): void
// - animationState: { isAnimating, imageUrl, progress: SharedValue<number> }
// 
// Animation: 400ms withTiming
// - Position: quadratic bezier from source → cart icon
// - Scale: 1.0 → 0.3
// - Opacity: 1.0 → 0.5 → 0
```

### 2. Create `cart-fly-animation.tsx`
```tsx
// Renders absolute-positioned Animated.View with Image
// Uses useAnimatedStyle for position interpolation
// Bezier curve: control point = midpoint shifted up by 100px
// On animation end: haptics.medium() + badge bounce
// Props: { animationState from hook }
```
- Position math:
  ```
  controlX = (startX + endX) / 2
  controlY = min(startY, endY) - 100  // arc above both points
  x(t) = (1-t)^2*startX + 2*(1-t)*t*controlX + t^2*endX
  y(t) = (1-t)^2*startY + 2*(1-t)*t*controlY + t^2*endY
  ```

### 3. Update HomeScreen.tsx
- Add `<CartFlyAnimation />` as overlay inside the LinearGradient
- Pass ref to MiniCartButton for position measurement
- Wire up triggerFly to product card add button via context or callback

### 4. Update useAddToCart.ts
- Add optional `onAnimationTrigger` callback parameter
- When adding to cart: call callback with product image URL
- Keep existing business logic untouched — animation is fire-and-forget

## Todo List
- [x] Create use-cart-fly-animation.ts hook with bezier math
- [x] Create cart-fly-animation.tsx overlay component
- [ ] Wire animation into HomeScreen (deferred)
- [ ] Measure MiniCartButton position with onLayout (deferred)
- [ ] Measure product card position on add-press (deferred)
- [x] Add haptic.medium() on animation complete
- [ ] Test animation path looks natural (arc, not straight line) (deferred)
- [x] Run existing tests: `npm test`

## Success Criteria
- Thumbnail visibly arcs from product card to cart icon
- Animation completes in ~400ms, feels snappy
- Haptic fires on arrival at cart icon
- No frame drops (test on low-end Android if possible)
- Cart state updates immediately (animation is non-blocking)
- All 145 tests still pass

## Risk Assessment
- **Medium:** Position measurement via `onLayout` can be tricky with FlatList scrolling
- **Mitigation:** Use `measure()` on the pressed card ref at press time, not layout time
- **Medium:** Cart icon may not be visible (showMiniCart conditional) — skip animation when hidden
