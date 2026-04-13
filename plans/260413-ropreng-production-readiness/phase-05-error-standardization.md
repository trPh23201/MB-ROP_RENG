# Phase 5: Chuẩn Hóa Error Handling

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- Phụ thuộc: Group A (Phase 1-3) phải xong trước

## Overview
- **Priority:** P2 HIGH
- **Status:** Complete
- **Effort:** 3h
- **Group:** B (song song với Phase 4)

Thay thế tất cả bare `Error()` throws bằng AppError subclasses. Thêm ValidationError. Chuẩn hóa error flow.

## Key Insights
- `AppErrors.ts` đã có: NetworkError, ApiError, AuthError, OtpInvalidError, LocationPermissionError, SessionExpiredError
- Nhưng ~50% use cases ném bare `Error('message')` thay vì AppError
- Repositories mix NetworkError + bare Error trong cùng file
- Thiếu `ValidationError` cho input validation (phone, OTP, address)

## File Ownership (Exclusive)
- **Sửa:**
  - `src/core/errors/AppErrors.ts` (thêm ValidationError)
  - `src/application/usecases/LoginUseCase.ts`
  - `src/application/usecases/RegisterUseCase.ts`
  - `src/application/usecases/GetStoresByProductUseCase.ts`
  - `src/application/usecases/CreatePreOrderUseCase.ts`
  - `src/application/usecases/ConfirmOrderUseCase.ts`
  - `src/application/usecases/UpdateProfileUseCase.ts`
  - `src/infrastructure/repositories/StoreRepositoryImpl.ts`
  - `src/infrastructure/repositories/HomeRepositoryImpl.ts`
  - `src/infrastructure/repositories/PreOrderRepositoryImpl.ts`
  - `src/infrastructure/repositories/ConfirmOrderRepositoryImpl.ts`
  - `src/infrastructure/repositories/OrderRepositoryImpl.ts`
  - `src/infrastructure/repositories/GoongGeocodingRepository.ts`
- **KHÔNG chạm:** AuthInterceptor, AuthRepository (Phase 5 sở hữu)

## Implementation Steps

1. **Thêm ValidationError** vào `AppErrors.ts`:
   ```typescript
   export class ValidationError extends AppError {
     constructor(
       public readonly field: string,
       message: string
     ) {
       super(message, 'VALIDATION_ERROR');
     }
   }
   ```

2. **Replace bare Error trong Use Cases**:
   - `LoginUseCase`: `throw new Error('Số điện thoại không hợp lệ')` → `throw new ValidationError('phone', '...')`
   - `RegisterUseCase`: tương tự
   - `GetStoresByProductUseCase`: `throw new Error('Vị trí không hợp lệ')` → `throw new ValidationError('location', '...')`
   - Pattern: validation fails → `ValidationError`, API fails → `ApiError`, network fails → `NetworkError`

3. **Replace bare Error trong Repositories**:
   - Tất cả `throw new Error('...')` trong repo impl → `throw new ApiError(code, message)` hoặc `throw new NetworkError(message)`

4. **Verify error catching**: Đảm bảo presentation layer catch đúng type:
   ```typescript
   if (error instanceof ValidationError) { /* show field error */ }
   else if (error instanceof NetworkError) { /* show retry */ }
   else if (error instanceof ApiError) { /* show API message */ }
   ```

## Todo List
- [x] Thêm ValidationError vào AppErrors.ts
- [x] Replace bare Error trong LoginUseCase
- [x] Replace bare Error trong RegisterUseCase
- [x] Replace bare Error trong GetStoresByProductUseCase
- [x] Replace bare Error trong CreatePreOrderUseCase (no bare Error found — clean)
- [x] Replace bare Error trong ConfirmOrderUseCase
- [x] Replace bare Error trong UpdateProfileUseCase
- [x] Replace bare Error trong tất cả RepositoryImpl files (PreOrder, ConfirmOrder, Order)
- [x] Verify TypeScript compile
- [x] Verify error catching trong presentation layer vẫn hoạt động

## Success Criteria
- `grep -r "throw new Error(" src/ | wc -l` = 0
- Tất cả throws dùng AppError subclass
- TypeScript compile thành công
- Error UI không thay đổi (cùng message, khác type)

## Risk Assessment
- Presentation layer catch `Error` generic → cần verify không break
- Middleware/interceptor catch specific type → cần audit catch blocks
