# Phase 6: Lottie Order Success

## Overview
- **Priority:** P2 (Medium Effort)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** B (independent, can run parallel with Phase 4)

Show a Lottie celebration animation when order is confirmed successfully.

## Key Insights
- `ConfirmOrderScreen.tsx` handles order submission and shows submitting overlay
- Current flow: user taps submit → `setIsSubmitting(true)` → `submitOrder` thunk → success/error
- Need: after successful submit, show full-screen Lottie celebration (2-3s) before navigating away
- `lottie-react-native` needs installation: `npx expo install lottie-react-native`
- Use a marketplace Lottie animation (confetti/celebration theme) — store as JSON asset

## File Ownership (EXCLUSIVE)

### New Files
- `src/presentation/components/shared/lottie-order-success.tsx` — full-screen overlay with Lottie animation
- `src/assets/lottie/order-success.json` — Lottie animation JSON file (celebration/confetti)

### Modified Files
- `src/presentation/screens/confirm-order/ConfirmOrderScreen.tsx` — show LottieOrderSuccess after successful order

## Pre-requisite

```bash
npx expo install lottie-react-native
```

## Implementation Steps

### 1. Source Lottie Animation
- Download a celebration/confetti animation from LottieFiles.com
- Save as `src/assets/lottie/order-success.json`
- Keep file size < 100KB
- Prefer: confetti burst, checkmark with particles, or success explosion

### 2. Create `lottie-order-success.tsx`
```tsx
// Full-screen absolute overlay
// Props: { visible: boolean; onAnimationFinish: () => void }
// 
// Behavior:
// 1. When visible=true: fade in overlay (semi-transparent bg)
// 2. Play Lottie animation (autoPlay, loop=false)
// 3. Show "Dat hang thanh cong!" text with FadeInUp
// 4. After animation completes (onAnimationFinish): auto-dismiss
// 5. Fire haptics.success() when animation starts
//
// Uses: LottieView from lottie-react-native
// Animation duration: ~2.5s
```

### 3. Update ConfirmOrderScreen.tsx
- Import `LottieOrderSuccess`
- Add state: `const [showSuccess, setShowSuccess] = useState(false)`
- In submit success handler: `setShowSuccess(true)` instead of immediate navigation
- `onAnimationFinish`: navigate to home/order history + clear state
- Render `<LottieOrderSuccess visible={showSuccess} onAnimationFinish={handleSuccessComplete} />`

### 4. Wire haptic feedback
- Import `haptics` from Phase 2's utility
- Call `haptics.success()` when order succeeds and animation starts

## Todo List
- [x] Install lottie-react-native
- [x] Source and save Lottie animation JSON
- [x] Create lottie-order-success.tsx component
- [x] Integrate into ConfirmOrderScreen
- [x] Add haptic success feedback
- [x] Test animation plays once and auto-dismisses
- [x] Test navigation after animation completes
- [x] Run existing tests: `npm test`

## Success Criteria
- Celebration animation plays after successful order submission
- Animation is smooth (60fps), plays once, auto-dismisses
- Vietnamese text "Dat hang thanh cong!" displayed with proper diacritics
- Haptic success notification fires
- Navigation to home/order history after animation
- All 145 tests still pass
- lottie-order-success.tsx < 100 LOC

## Risk Assessment
- **Low:** lottie-react-native is Expo-compatible, well-maintained
- **Medium:** Need to source appropriate Lottie animation asset (license check)
- **Note:** If Lottie install fails for Expo 54, fallback to Moti-based confetti animation using `MotiView` with staggered entering animations
