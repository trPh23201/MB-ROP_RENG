# Phase 2: Tắt React Compiler + Sentry Integration

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- **Merged từ cũ Phase 2 + Phase 3** (Red Team fix C1: tránh `app.json` write conflict)

## Overview
- **Priority:** P1 CRITICAL
- **Status:** Complete
- **Effort:** 3h
- **Group:** A (song song với Phase 1, 3)

Tắt React Compiler experimental + tích hợp Sentry error tracking. Cùng phase vì cùng sửa `app.json`.

## File Ownership (Exclusive)
- **Sửa:** `app.json`, `app/_layout.tsx`, `package.json` (dependencies)
- **Tạo mới:**
  - `src/infrastructure/services/monitoring/SentryService.ts`
  - `src/infrastructure/services/monitoring/index.ts`
  - `src/presentation/components/shared/ErrorBoundary.tsx`
  - `.env.example`

## Implementation Steps

### Part A: Tắt React Compiler (15 min)
1. Mở `app.json` → xóa `"reactCompiler": true` trong `experiments`
2. Giữ `"typedRoutes": true`

### Part B: Sentry Integration (2.5h)
3. Install: `npx expo install @sentry/react-native`
4. Tạo `src/infrastructure/services/monitoring/SentryService.ts`:
   ```typescript
   import * as Sentry from '@sentry/react-native';
   
   export const initSentry = () => {
     Sentry.init({
       dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
       tracesSampleRate: 0.2,
       environment: __DEV__ ? 'development' : 'production',
       enabled: !__DEV__,
     });
   };
   
   export const captureError = (error: Error, context?: Record<string, unknown>) => {
     Sentry.captureException(error, { extra: context });
   };
   ```
5. Tạo `ErrorBoundary.tsx` wrap `Sentry.ErrorBoundary`
6. Cập nhật `app.json` — thêm Sentry plugin:
   ```json
   ["@sentry/react-native/expo", {
     "organization": "ropreng",
     "project": "ropreng-mobile"
   }]
   ```
7. Wrap `app/_layout.tsx` với `Sentry.wrap()`
8. Tạo `.env.example` với `EXPO_PUBLIC_SENTRY_DSN=` placeholder

### Verify
9. `npx expo start --clear` — app khởi động bình thường
10. Verify Sentry init log trong dev console

## Todo List
- [x] Xóa `reactCompiler: true` trong `app.json`
- [x] Install `@sentry/react-native`
- [x] Tạo SentryService.ts
- [x] Tạo monitoring/index.ts barrel export
- [x] Tạo ErrorBoundary.tsx
- [x] Thêm Sentry plugin vào `app.json`
- [x] Wrap root `_layout.tsx` với Sentry
- [x] Tạo `.env.example`
- [x] Verify app khởi động bình thường

## Success Criteria
- `app.json` không còn `reactCompiler`
- Sentry SDK init thành công
- ErrorBoundary catch unhandled React errors
- App chạy bình thường trên simulator

## Risk Assessment
- Sentry DSN cần account → tạo free tier trên sentry.io
- `Sentry.wrap()` có thể conflict với Tamagui provider → test kỹ wrap order
