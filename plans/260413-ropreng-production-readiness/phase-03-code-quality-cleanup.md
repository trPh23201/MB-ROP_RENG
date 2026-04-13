# Phase 3: Dọn Code Quality

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)

## Overview
- **Priority:** P2 HIGH
- **Status:** Completed
- **Effort:** 2h
- **Group:** A (song song với Phase 1, 2)

Dọn 162 console.log, 12 TODO/FIXME, 35 `any` types. Chuẩn bị codebase sạch cho Phase 4-7.

## Key Insights
- 162 `console.log/warn/error` rải khắp src/
- 12 `TODO/FIXME` — một số là feature gaps thật (cần convert thành GitHub Issues)
- 35 `: any` — vi phạm strict TypeScript
- 0 `@ts-ignore` — tốt, giữ nguyên

## File Ownership (Exclusive)
- **Sửa:** Tất cả file trong `src/**/*.ts` và `src/**/*.tsx`
- **Chỉ thay đổi:** xóa console.log, fix TODO, replace `any` types
- **KHÔNG thay đổi logic, KHÔNG refactor, KHÔNG sửa error handling (Phase 5 làm)**
- **LOẠI TRỪ (Phase 4 sở hữu):** `AuthInterceptor.ts`, `HttpClient.ts`, `AuthApiConfig.ts`, `tokenStorage.ts`, `AuthRepositoryImpl.ts`, `AuthRepository.ts`, `authSlice.ts`
- **LOẠI TRỪ (Phase 7 sở hữu):** 6 oversized screen files (AddressManagement, HomeScreen, OrderDetail, ConfirmOrder, OtpVerification, OrderProductEditBottomSheet)
- **LOẠI TRỪ:** catch blocks trong files thuộc Phase 5 ownership

## Implementation Steps

1. **Xóa console.log** (ưu tiên cao nhất):
   - `grep -rn "console\." src/ --include="*.ts" --include="*.tsx"`
   - Xóa tất cả `console.log`, `console.warn`, `console.error`
   - Thay thế console.error trong catch blocks bằng comment `// Sentry captures this` (Phase 3 sẽ handle)
   - KHÔNG xóa console trong `HttpClient.ts` (logging layer riêng — Phase 3 sẽ replace bằng Sentry breadcrumbs)

2. **Giải quyết TODO/FIXME**:
   - `grep -rn "TODO\|FIXME" src/`
   - Với mỗi TODO:
     - Nếu là feature gap → ghi nhận trong report, xóa comment
     - Nếu là bug cần fix → giữ lại, đánh dấu cho Phase phù hợp
   - Đặc biệt: `AuthInterceptor.ts` TODO refresh token → giữ lại (Phase 5)

3. **Fix `any` types**:
   - `grep -rn ": any" src/ --include="*.ts" --include="*.tsx"`
   - Replace với proper types:
     - API response → `unknown` + type guard
     - Event handlers → proper React Native event types
     - Redux dispatch → `AppDispatch`
     - Mapper params → DTO/Entity types
   - Nếu không xác định type → `unknown` tốt hơn `any`

## Todo List
- [x] Xóa tất cả console.log/warn/error (trừ HttpClient.ts)
- [x] Giải quyết 12 TODO/FIXME comments
- [x] Fix 35 `any` types → proper types hoặc `unknown`
- [x] Verify `npx tsc --noEmit` vẫn pass (4 pre-existing errors in non-owned files)
- [x] Verify `npx expo lint` vẫn pass

## Success Criteria
- `grep -r "console\." src/ | wc -l` = 0 (trừ HttpClient.ts)
- `grep -r "TODO\|FIXME" src/ | wc -l` ≤ 2 (chỉ giữ Phase 5 TODO)
- `grep -r ": any" src/ | wc -l` = 0
- TypeScript compile thành công

## Risk Assessment
- Xóa console.log trong error handlers có thể mất context → Phase 3 Sentry sẽ bù
- Fix `any` types có thể gây type error cascade → fix từng file, compile check sau mỗi batch
