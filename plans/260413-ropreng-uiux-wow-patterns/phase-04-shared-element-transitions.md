# Phase 4: Shared Element Transitions

## Overview
- **Priority:** P2 (Medium Effort)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** B (after Group A completes)
- **Depends on:** Phase 2 (EntryProductCard already modified with haptics)

Food card image morphs into product detail view using Reanimated's `sharedTransitionTag`.

## Key Insights
- Reanimated v4 supports `sharedTransitionTag` on `Animated.Image` for cross-screen morphing
- EntryProductCard uses `expo-image` `<Image>` — needs wrapping with `Animated.createAnimatedComponent` or using Reanimated's `Animated.Image`
- Product detail is triggered by `handleProductPress` in HomeScreen which calls `setShowPreOrder(true)` — this opens a bottom sheet, NOT a navigation push
- **Pivot:** Since product "detail" is a bottom sheet (not a screen navigation), traditional shared element transitions won't work. Instead: animate the card image expanding into the bottom sheet with a layout animation.
- Alternative approach: Use `Animated.View` with `entering` animation (ZoomIn) on the bottom sheet product image

## File Ownership (EXCLUSIVE)

### New Files
- `src/presentation/components/entry/animated-product-card.tsx` — wraps EntryProductCard with press scale animation (Reanimated)
- `src/presentation/screens/preorder/components/product-detail-header.tsx` — animated header for PreOrderBottomSheet with ZoomIn entering

### Modified Files
- `src/presentation/components/entry/EntryProductCard.tsx` — wrap with Animated.View for scale press feedback
- `src/presentation/screens/home/HomeScreen.tsx` — use AnimatedProductCard in renderProduct

## Implementation Steps

### 1. Create `animated-product-card.tsx`
```tsx
// Wraps EntryProductCard with Reanimated press animation
// On press: scale to 0.95 → spring back → trigger onPress
// Uses useAnimatedStyle + useSharedValue + withSpring
// Props: same as EntryProductCard
```
- Import Animated from react-native-reanimated
- Use `Pressable` with `onPressIn`/`onPressOut` for scale animation
- Call `haptics.medium()` on press (reuse Phase 2 utility)

### 2. Create `product-detail-header.tsx`
```tsx
// Animated product image header for bottom sheet
// Uses Animated.Image with FadeInUp.springify() entering animation
// Shows product image expanding when bottom sheet opens
// Props: { imageUrl: string; productName: string }
```

### 3. Update HomeScreen renderProduct
- Replace `EntryProductCard` with `AnimatedProductCard` in `renderProduct` callback
- Import from new file

### 4. Update EntryProductCard.tsx
- Replace `TouchableOpacity` with Reanimated `Animated.View` + `Pressable`
- Add `sharedTransitionTag={`product-${product.id}`}` to Image for future navigation-based transitions

## Todo List
- [x] Create animated-product-card.tsx with scale press animation
- [x] Create product-detail-header.tsx with entering animation
- [x] Update HomeScreen to use AnimatedProductCard
- [x] Add sharedTransitionTag to product images (future-proof)
- [x] Test press animation feels premium (spring bounce)
- [x] Run existing tests: `npm test`

## Success Criteria
- Product cards have satisfying press scale animation (0.95 → 1.0 with spring)
- Bottom sheet product header fades/zooms in when sheet opens
- No jank or frame drops during animation
- All 145 tests still pass

## Risk Assessment
- **Medium:** Replacing TouchableOpacity with Pressable may affect hit area — test thoroughly
- **Note:** Full shared element transition requires screen navigation (not bottom sheet). Current implementation adds press animation + entering animation as equivalent premium feel.
