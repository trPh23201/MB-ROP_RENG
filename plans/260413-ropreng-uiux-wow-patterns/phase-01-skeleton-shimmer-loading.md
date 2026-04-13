# Phase 1: Skeleton Shimmer Loading

## Overview
- **Priority:** P1 (Quick Win)
- **Status:** completed
- **Effort:** 2h
- **Parallel Group:** A (no dependencies)

Replace `ActivityIndicator` spinners with shimmer skeleton cards using `moti/skeleton` (already installed).

## Key Insights
- HomeScreen uses `ActivityIndicator` during `isInitialLoading` (line 113)
- OrderHistoryScreen uses `ActivityIndicator` during `loading` state
- Product cards are 2-column grid, each `(width - 48) / 2` wide
- `moti/skeleton` provides `Skeleton` component with `colorMode` and `show` props

## File Ownership (EXCLUSIVE)

### New Files
- `src/presentation/components/shared/skeleton-shimmer-card.tsx` — single skeleton card matching EntryProductCard dimensions
- `src/presentation/components/shared/skeleton-shimmer-list.tsx` — renders grid of skeleton cards (6-8 items)

### Modified Files
- `src/presentation/screens/home/HomeScreen.tsx` — replace ActivityIndicator block with SkeletonShimmerList
- `src/presentation/screens/order-history/OrderHistoryScreen.tsx` — replace loading ActivityIndicator

## Implementation Steps

### 1. Create `skeleton-shimmer-card.tsx`
```tsx
// Uses MotiSkeletonGroup + Skeleton from 'moti/skeleton'
// Match EntryProductCard layout: image area (aspectRatio 1) + text lines
// Accept colorMode prop from BrandColorContext
// Props: { width: number; colorMode?: 'light' | 'dark' }
```
- Image placeholder: rounded rect matching `ENTRY_LAYOUT.PRODUCT_CARD_BORDER_RADIUS`
- Two text line placeholders (name + price)
- Use brand `p1` as background color

### 2. Create `skeleton-shimmer-list.tsx`
```tsx
// Renders 6 SkeletonShimmerCard in 2-column grid
// Match HomeScreen's FlatList columnWrapperStyle
// Props: { count?: number }
```

### 3. Update HomeScreen.tsx
- Import `SkeletonShimmerList`
- Replace the `isInitialLoading` block (lines 113-118) that shows `ActivityIndicator` + loading text
- Render `<SkeletonShimmerList />` instead

### 4. Update OrderHistoryScreen.tsx
- Import `SkeletonShimmerList` (or a simpler single-column skeleton)
- Replace `loading` state ActivityIndicator with skeleton rows

## Todo List
- [x] Create skeleton-shimmer-card.tsx with moti/skeleton
- [x] Create skeleton-shimmer-list.tsx grid wrapper
- [x] Replace HomeScreen ActivityIndicator with skeleton
- [x] Replace OrderHistoryScreen ActivityIndicator with skeleton
- [x] Verify skeleton dimensions match real cards
- [x] Run existing tests: `npm test`

## Success Criteria
- No ActivityIndicator visible during initial load on Home or OrderHistory
- Shimmer animation runs smoothly (60fps)
- Skeleton card dimensions match actual product card dimensions
- All 145 tests still pass
- Each new file < 200 LOC

## Risk Assessment
- **Low:** moti/skeleton is already installed, well-documented API
- **Medium:** Skeleton color must adapt to BrandColorContext dynamic theme
