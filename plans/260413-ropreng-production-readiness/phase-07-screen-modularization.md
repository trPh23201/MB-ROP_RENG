# Phase 7: Modular Hóa Màn Hình Lớn

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- Phụ thuộc: Group B (Phase 4-5) phải xong trước

## Overview
- **Priority:** P2 MEDIUM
- **Status:** Complete
- **Effort:** 4h
- **Group:** C (song song với Phase 6)

Tách 6 màn hình vượt 200 LOC thành components nhỏ hơn. Không thay đổi logic, chỉ extract.

## Key Insights

| Màn hình | LOC | Mục tiêu |
|----------|-----|---------|
| AddressManagementScreen | 547 | < 150 + 3 components |
| HomeScreen | 434 | < 150 + 3 components |
| OrderDetailScreen | 409 | < 150 + 2 components |
| OrderProductEditBottomSheet | 376 | < 150 + 2 components |
| OtpVerificationBottomSheet | 341 | < 150 + 2 components |
| ConfirmOrderScreen | 335 | < 150 + 2 components |

## File Ownership (Exclusive)
- **Sửa:**
  - `src/presentation/screens/address/AddressManagementScreen.tsx`
  - `src/presentation/screens/home/HomeScreen.tsx`
  - `src/presentation/screens/order-detail/OrderDetailScreen.tsx`
  - `src/presentation/components/order/OrderProductEditBottomSheet.tsx`
  - `src/presentation/screens/otp-verification/OtpVerificationBottomSheet.tsx`
  - `src/presentation/screens/confirm-order/ConfirmOrderScreen.tsx`
- **Tạo mới:** Extracted components trong cùng thư mục

## Implementation Steps

### 1. AddressManagementScreen (547 → ~150)
Extract:
- `components/AddressSearchPanel.tsx` — search bar + autocomplete list
- `components/AddressMapView.tsx` — MapLibre + marker + camera
- `components/AddressConfirmButton.tsx` — bottom confirm section
- `hooks/useAddressManagement.ts` — tất cả state + logic

### 2. HomeScreen (434 → ~150)
Extract:
- `components/HomeLocationBanner.tsx` — location display + error banner
- `components/HomeProductFeed.tsx` — FlatList + pagination logic
- `hooks/useHomeScreen.ts` — state management + effects

### 3. OrderDetailScreen (409 → ~150)
Extract:
- `components/OrderDetailHeader.tsx` — order info section
- `components/OrderDetailItems.tsx` — product list + totals
- `service/OrderDetailService.ts` — data formatting logic

### 4. OrderProductEditBottomSheet (376 → ~150)
Extract:
- `components/ToppingSelector.tsx` — topping selection UI
- `components/QuantityControl.tsx` — quantity +/- controls

### 5. OtpVerificationBottomSheet (341 → ~150)
Extract:
- `components/OtpInput.tsx` — 6-digit input fields
- `components/OtpTimer.tsx` — countdown + resend button

### 6. ConfirmOrderScreen (335 → ~150)
Extract:
- `components/ConfirmOrderSummary.tsx` — order summary section
- `components/ConfirmOrderPayment.tsx` — payment method selection

## Rules
- **KHÔNG thay đổi logic** — chỉ extract components
- **KHÔNG rename** existing exports
- Tên file kebab-case, dài, mô tả rõ
- Mỗi extracted component < 100 LOC
- Props interface rõ ràng cho mỗi component

## Todo List
- [x] Modular AddressManagementScreen (547 → ~150)
- [x] Modular HomeScreen (434 → ~150)
- [x] Modular OrderDetailScreen (409 → ~150)
- [x] Modular OrderProductEditBottomSheet (376 → ~150)
- [x] Modular OtpVerificationBottomSheet (341 → ~150)
- [x] Modular ConfirmOrderScreen (335 → ~150)
- [x] Verify TypeScript compile
- [x] Verify tất cả navigation vẫn hoạt động
- [x] Verify không có visual regression

## Success Criteria
- Tất cả 6 screen files < 200 LOC
- Extracted components < 100 LOC mỗi file
- `npx tsc --noEmit` pass
- App hoạt động bình thường (navigation, data loading, interactions)

## Risk Assessment
- Extract sai prop → TypeScript sẽ bắt
- Circular imports → cấu trúc thư mục phẳng, avoid cross-imports
- Performance: thêm component = thêm render → dùng React.memo nếu cần
