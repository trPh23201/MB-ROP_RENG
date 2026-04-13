# Phase 2: Haptic Feedback

## Overview
- **Priority:** P1 (Quick Win)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** A (no dependencies)

Add tactile haptic feedback to key touch points using `expo-haptics` (already installed).

## Key Insights
- expo-haptics API: `Haptics.impactAsync(ImpactFeedbackStyle.Light|Medium|Heavy)`, `Haptics.notificationAsync(NotificationFeedbackType.Success|Error)`
- Haptic guide from research: Light=toggles, Medium=cart add, Heavy(3x)=errors, Success=order confirmed
- `useAddToCart` hook dispatches `addToCart(product)` — wrap with haptic

## File Ownership (EXCLUSIVE)

### New Files
- `src/presentation/utils/haptics.ts` — centralized haptic utility with semantic methods

### Modified Files
- `src/presentation/components/entry/EntryProductCard.tsx` — haptic on add button press
- `src/presentation/components/shared/MiniCartButton.tsx` — haptic on press
- `src/presentation/components/order/components/option-selector-row.tsx` — haptic on option toggle
- `src/presentation/components/order/components/quantity-control-row.tsx` — haptic on +/- press

## Implementation Steps

### 1. Create `src/presentation/utils/haptics.ts`
```tsx
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// No-op on web/unsupported platforms
const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptics = {
  light: () => isSupported && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => isSupported && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => isSupported && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => isSupported && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => isSupported && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  selection: () => isSupported && Haptics.selectionAsync(),
};
```

### 2. EntryProductCard — add haptic to add button
- Import `haptics` from utils
- On `addButton` press: call `haptics.medium()` before `onPress?.(product)`

### 3. MiniCartButton — haptic on tap
- Import `haptics`
- Call `haptics.light()` on press

### 4. option-selector-row — haptic on option select
- Import `haptics`
- Call `haptics.selection()` when user selects size/ice/sweetness

### 5. quantity-control-row — haptic on quantity change
- Import `haptics`
- Call `haptics.light()` on increment/decrement

## Todo List
- [x] Create haptics.ts utility
- [x] Add haptic to EntryProductCard add button
- [x] Add haptic to MiniCartButton
- [x] Add haptic to option-selector-row
- [x] Add haptic to quantity-control-row
- [x] Manual test on iOS simulator/device
- [x] Run existing tests: `npm test`

## Success Criteria
- Haptic fires on every listed touch point
- Platform-safe: no crash on web/unsupported
- Haptics utility is single file < 30 LOC
- All 145 tests still pass

## Risk Assessment
- **Low:** expo-haptics has simple API, already installed
- **Note:** Haptics don't fire in iOS Simulator by default (device-only), but code won't crash
