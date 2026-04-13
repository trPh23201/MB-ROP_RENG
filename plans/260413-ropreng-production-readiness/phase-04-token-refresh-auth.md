# Phase 4: Token Refresh + Auth Flow Hoàn Chỉnh

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- Phụ thuộc: Group A (Phase 1-3) phải xong trước
- **GATE:** Cần confirm backend có endpoint `/auth/refresh-token`. Nếu không → implement graceful 401-logout-only (skip refresh queue)

## Overview
- **Priority:** P1 CRITICAL
- **Status:** Complete
- **Effort:** 5h
- **Group:** B (song song với Phase 6)

Implement token refresh flow, logout endpoint, hoàn thiện auth lifecycle.

## Key Insights
- `AuthInterceptor.ts` bắt 401 nhưng chỉ xóa token → user bị logout
- Không có refresh token endpoint trong `AuthApiConfig.ts`
- `TokenStorage` đã có `getToken/setToken/clear` — foundation tốt
- `UpdateProfileUseCase` ném "API chưa được hỗ trợ"
- Backend API cần confirm: có endpoint refresh token không? (câu hỏi mở)

## Requirements
- **Functional:**
  - 401 → tự động refresh token → retry request gốc
  - Nếu refresh fail → logout + redirect login
  - Logout endpoint: xóa token server-side + client-side
  - UpdateProfile hoạt động (nếu backend hỗ trợ)
- **Non-functional:**
  - Refresh flow < 2s
  - Không có race condition khi nhiều request 401 cùng lúc

## File Ownership (Exclusive)
- **Sửa:**
  - `src/infrastructure/http/interceptors/AuthInterceptor.ts`
  - `src/infrastructure/http/HttpClient.ts`
  - `src/infrastructure/api/auth/AuthApiConfig.ts`
  - `src/infrastructure/storage/tokenStorage.ts`
  - `src/infrastructure/repositories/AuthRepositoryImpl.ts`
  - `src/domain/repositories/AuthRepository.ts`
  - `src/application/usecases/index.ts`
  - `src/state/slices/authSlice.ts`
- **Tạo mới:**
  - `src/application/usecases/RefreshTokenUseCase.ts`
  - `src/application/usecases/LogoutUseCase.ts`

## Architecture

```
401 Response
    │
    ▼
AuthInterceptor
    │
    ├─ isRefreshing = false?
    │   ├─ Set isRefreshing = true
    │   ├─ Call refresh token API
    │   ├─ Update stored tokens
    │   ├─ Retry original request
    │   └─ Set isRefreshing = false
    │
    └─ isRefreshing = true?
        └─ Queue request → resolve after refresh completes
```

## Implementation Steps

1. **Thêm refresh token endpoints** vào `AuthApiConfig.ts`:
   ```typescript
   REFRESH: '/auth/refresh-token',
   LOGOUT: '/auth/logout',
   ```

2. **Mở rộng `TokenStorage`**:
   ```typescript
   getRefreshToken(): Promise<string | null>
   setRefreshToken(token: string): Promise<void>
   clearAll(): Promise<void>  // clear cả access + refresh
   ```

3. **Mở rộng `AuthRepository` interface**:
   ```typescript
   refreshToken(refreshToken: string): Promise<AuthTokens>
   logout(token: string): Promise<void>
   ```

4. **Implement `AuthRepositoryImpl`**: Thêm `refreshToken()` + `logout()`

5. **Tạo `RefreshTokenUseCase.ts`**:
   - Gọi repository.refreshToken()
   - Lưu tokens mới vào TokenStorage

6. **Tạo `LogoutUseCase.ts`**:
   - Gọi repository.logout() (server-side)
   - Xóa tokens (client-side)
   - Clear Redux auth state

7. **Refactor `AuthInterceptor.ts`**:
   - Thêm refresh queue pattern (tránh race condition)
   - 401 → check có refresh token → refresh → retry
   - Refresh fail → logout flow

8. **Update `authSlice.ts`**: Thêm logout thunk, refresh thunk

## Todo List
- [x] Thêm REFRESH + LOGOUT endpoints vào AuthApiConfig
- [x] Mở rộng TokenStorage cho refresh token
- [x] Mở rộng AuthRepository interface
- [x] Implement refreshToken + logout trong AuthRepositoryImpl
- [x] Tạo RefreshTokenUseCase
- [x] Tạo LogoutUseCase
- [x] Refactor AuthInterceptor với refresh queue
- [x] Update authSlice với logout + refresh thunks
- [x] Test: 401 → auto refresh → retry thành công
- [x] Test: refresh fail → redirect login

## Success Criteria
- Token hết hạn → tự động refresh → user không bị logout
- Nhiều request 401 cùng lúc → chỉ 1 refresh call
- Refresh fail → clean logout → redirect login screen
- Logout button hoạt động (MoreScreen)

## Risk Assessment
- **CAO:** Backend có thể không có refresh token endpoint → cần confirm với team backend
- Race condition trên refresh queue → dùng Promise queue pattern
- Token rotation: refresh token cũng hết hạn → cần handle double-expiry

## Security
- Refresh token lưu trong SecureStore (đã có)
- Logout phải xóa cả server-side session
- Không cache tokens trong memory sau logout
