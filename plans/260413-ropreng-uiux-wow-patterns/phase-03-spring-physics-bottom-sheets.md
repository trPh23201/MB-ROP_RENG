# Phase 3: Spring Physics Bottom Sheets

## Overview
- **Priority:** P1 (Quick Win)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** A (no dependencies)

Add premium spring physics (damping:15, stiffness:120) to all bottom sheets via `@gorhom/bottom-sheet` v5 `animationConfigs` prop.

## Key Insights
- `@gorhom/bottom-sheet` v5 accepts `animationConfigs` prop for custom spring/timing configs
- Uses Reanimated's `withSpring` under the hood
- Research recommends: `damping: 15, stiffness: 120` for 2026 premium feel
- 12 files use `BottomSheetModal` — best approach: centralize in `BaseBottomSheetLayout` which wraps them all
- Key: `BaseBottomSheetLayout.tsx` already wraps most bottom sheets

## File Ownership (EXCLUSIVE)

### Modified Files
- `src/presentation/layouts/BaseBottomSheetLayout.tsx` — add `animationConfigs` with spring physics
- `src/presentation/screens/preorder/PreOrderBottomSheet.tsx` — ensure uses BaseBottomSheetLayout or add spring config
- `src/presentation/components/order/OrderProductEditBottomSheet.tsx` — add spring config if not using BaseBottomSheetLayout
- `src/presentation/components/order/AddToppingBottomSheet.tsx` — add spring config if not using BaseBottomSheetLayout

## Implementation Steps

### 1. Create spring config constant
In `BaseBottomSheetLayout.tsx`, add:
```tsx
import { useAnimatedProps } from 'react-native-reanimated';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};
```

### 2. Apply to BaseBottomSheetLayout
- Pass `animationConfigs` prop to the inner `BottomSheetModal`:
```tsx
<BottomSheetModal
  // ...existing props
  animationConfigs={SPRING_CONFIG}
>
```

### 3. Verify bottom sheets NOT using BaseBottomSheetLayout
Check each of the 12 files with `BottomSheetModal`:
- If they use `BaseBottomSheetLayout` — automatically get spring physics
- If they use `BottomSheetModal` directly — add `animationConfigs={SPRING_CONFIG}` prop
- Export `SPRING_CONFIG` from a shared location if needed by multiple files

### 4. Handle direct BottomSheetModal users
Files like `PreOrderBottomSheet.tsx`, `OrderProductEditBottomSheet.tsx`, `AddToppingBottomSheet.tsx` may use `BottomSheetModal` directly. For each:
- Import spring config
- Add `animationConfigs` prop

## Todo List
- [x] Add SPRING_CONFIG to BaseBottomSheetLayout
- [x] Apply animationConfigs to BaseBottomSheetLayout's BottomSheetModal
- [x] Audit all 12 BottomSheetModal usages
- [x] Add spring config to direct BottomSheetModal users
- [x] Test: sheets snap with springy bounce, not linear
- [x] Run existing tests: `npm test`

## Success Criteria
- ALL bottom sheets animate with spring physics (visible bounce)
- No regression in sheet snap points or dismiss behavior
- Premium organic feel on open/close/snap
- All 145 tests still pass

## Risk Assessment
- **Low:** `animationConfigs` is a standard gorhom prop, won't break existing behavior
- **Medium:** Need to verify all 12 bottom sheet files; some may need individual treatment
