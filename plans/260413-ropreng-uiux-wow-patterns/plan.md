---
title: "RopReng UI/UX WOW Patterns"
description: "Add skeleton loading, haptics, spring physics, shared transitions, cart fly animation, and Lottie celebrations"
status: completed
priority: P1
effort: 12h
branch: master
tags: [ui, ux, animation, presentation-layer]
created: 2026-04-13
---

# RopReng UI/UX WOW Patterns

## Overview

Six presentation-layer enhancements to bring RopReng to Grab/Shopee-level polish. Zero business logic changes. All work scoped to `src/presentation/` and shared hooks/utils.

## Dependency Graph

```
Phase 1: Skeleton Shimmer ──┐
Phase 2: Haptic Feedback ───┤── All independent (Parallel Group A)
Phase 3: Spring Physics ────┘
                              
Phase 4: Shared Element Trans ── depends on Phase 2 (EntryProductCard edits)
Phase 5: Cart Fly Animation ─── depends on Phase 2 (haptic util) + Phase 4 (HomeScreen)
Phase 6: Lottie Order Success ── independent of 4,5

GROUP B: Phase 4 + 6 parallel. Phase 5 AFTER Phase 4.
```

## Parallel Execution Groups

| Group | Phases | Can Start | Est. Time |
|-------|--------|-----------|-----------|
| **A** | 1, 2, 3 | Immediately | 2h each |
| **B** | 4, 6 | After Group A | 2h each (parallel) |
| **C** | 5 | After Phase 4 | 2h |

## Red Team Fixes Applied

1. **C1:** Phase 2 reuses existing `HapticFeedback.ts`, no new haptics.ts created
2. **C2:** Phase 5 creates `src/presentation/hooks/` directory
3. **C3:** `lottie-react-native` must be verified with `npx expo install` before Phase 6
4. **H4:** HomeScreen ownership serialized: Phase 1 (skeleton) → Phase 4 (animated card) → Phase 5 (cart fly)
5. **H5:** EntryProductCard: Phase 2 (haptics only) → Phase 4 (Animated wrap) — serialized
6. **H6:** Verify `moti/skeleton` importability; fallback to `@motify/skeleton` if needed
7. **M7:** Phase 6 creates `src/assets/lottie/` dir; use MIT-licensed Lottie assets
8. **M8:** Phase 3 verifies `animationConfigs` API signature for gorhom v5
9. **M9:** Phase 5 adds `measure()` null fallback for Android clipped views

## File Ownership Matrix

| File | Ph1 | Ph2 | Ph3 | Ph4 | Ph5 | Ph6 |
|------|-----|-----|-----|-----|-----|-----|
| `components/shared/skeleton-shimmer-card.tsx` | OWN | | | | | |
| `components/shared/skeleton-shimmer-list.tsx` | OWN | | | | | |
| `screens/home/HomeScreen.tsx` | EDIT | | | | | |
| `screens/order-history/OrderHistoryScreen.tsx` | EDIT | | | | | |
| `utils/HapticFeedback.ts` (EXISTING) | | EDIT | | | | |
| `components/entry/EntryProductCard.tsx` | | EDIT | | EDIT* | | |
| `components/shared/MiniCartButton.tsx` | | EDIT | | | | |
| `components/order/components/option-selector-row.tsx` | | EDIT | | | | |
| `components/order/components/quantity-control-row.tsx` | | EDIT | | | | |
| `layouts/BaseBottomSheetLayout.tsx` | | | EDIT | | | |
| `screens/preorder/PreOrderBottomSheet.tsx` | | | EDIT | | | |
| `components/order/OrderProductEditBottomSheet.tsx` | | | EDIT | | | |
| `components/order/AddToppingBottomSheet.tsx` | | | EDIT | | | |
| `components/entry/animated-product-card.tsx` (NEW) | | | | OWN | | |
| `screens/preorder/components/product-detail-header.tsx` (NEW) | | | | OWN | | |
| `components/shared/cart-fly-animation.tsx` (NEW) | | | | | OWN | |
| `hooks/useCartFlyAnimation.ts` (NEW) | | | | | OWN | |
| `utils/hooks/useAddToCart.ts` | | | | | EDIT | |
| `components/shared/lottie-order-success.tsx` (NEW) | | | | | | OWN |
| `screens/confirm-order/ConfirmOrderScreen.tsx` | | | | | | EDIT |
| `assets/lottie/order-success.json` (NEW) | | | | | | OWN |

*Phase 4 edits `EntryProductCard` AFTER Phase 2 completes (wraps with Animated).

## Install Before Starting

```bash
npx expo install lottie-react-native
```

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | [Skeleton Shimmer Loading](./phase-01-skeleton-shimmer-loading.md) | completed | skeleton components + screen integration |
| 2 | [Haptic Feedback](./phase-02-haptic-feedback.md) | completed | haptics utility + touch point integration |
| 3 | [Spring Physics Bottom Sheets](./phase-03-spring-physics-bottom-sheets.md) | completed | BaseBottomSheetLayout + all bottom sheets |
| 4 | [Shared Element Transitions](./phase-04-shared-element-transitions.md) | completed | animated product card + detail header |
| 5 | [Cart Fly Animation](./phase-05-cart-fly-animation.md) | completed | bezier curve animation component + hook |
| 6 | [Lottie Order Success](./phase-06-lottie-order-success.md) | completed | Lottie celebration on order confirmed |

## Constraints

- Presentation layer only, zero business logic changes
- All components < 200 LOC
- Must not break 145 existing tests
- Vietnamese typography: adequate lineHeight for diacritics
- No Skia (too heavy for v1)
