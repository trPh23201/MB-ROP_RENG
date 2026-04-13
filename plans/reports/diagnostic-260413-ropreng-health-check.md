# RopReng Diagnostic Report

**Date:** 2026-04-13
**Repo:** trPh23201/MB-ROP_RENG
**Type:** Expo React Native e-commerce/ordering app (Vietnam market)
**Codebase:** ~22K LOC, 335 files in src/, 18 in app/

---

## Executive Summary

**Overall Health: 4/10 (Pre-Production)**

Architecture is SOLID (Clean Architecture, proper layering). But operational readiness is CRITICAL-LOW. 6 production blockers found.

---

## Scoring Matrix

| Layer | Score | Status |
|-------|-------|--------|
| Architecture (Clean Arch) | 8/10 | Strong separation, proper DI |
| Type Safety | 7/10 | 35 `any` types, 0 `@ts-ignore` |
| Error Handling | 4/10 | Inconsistent: AppError exists but unused in half the codebase |
| API Layer | 3/10 | Missing: logout, refresh token, update profile |
| Testing | 0/10 | Zero test files |
| CI/CD | 0/10 | No GitHub Actions |
| Monitoring | 0/10 | No Sentry, no analytics |
| Security | 5/10 | SecureStore used, but no token refresh, no input sanitization |
| Performance | 5/10 | No image caching, memory leak risks in 4 screens |
| Code Quality | 5/10 | 162 console.log, 12 TODO/FIXME, 35 `any` |

**Total: 37/100**

---

## 6 Production Blockers (CRITICAL)

### 1. No Token Refresh Flow
- AuthInterceptor has `// TODO: Implement refresh token`
- 401 = instant logout, no retry
- **Impact:** Users logged out every token expiry

### 2. Incomplete API Endpoints
- No LOGOUT endpoint
- No REFRESH TOKEN endpoint
- UpdateProfileUseCase throws "API chưa được hỗ trợ"
- **Impact:** Core features broken

### 3. Zero Tests
- No test files, no test config, no Jest/Vitest
- **Impact:** No regression safety net

### 4. No CI/CD Pipeline
- No GitHub Actions
- No automated lint/typecheck/build
- **Impact:** Broken commits go undetected

### 5. No Error Tracking
- No Sentry/Bugsnag
- 162 console.log scattered (production noise)
- **Impact:** Blind to production crashes

### 6. React Compiler Experimental
- `"reactCompiler": true` in app.json experiments
- Not stable for production
- **Impact:** Potential runtime bugs from experimental optimization

---

## 12 High-Severity Issues

| # | Issue | Location | LOC Affected |
|---|-------|----------|-------------|
| 1 | AddressManagementScreen 547 LOC (>200 limit) | screens/address/ | 547 |
| 2 | HomeScreen 434 LOC | screens/home/ | 434 |
| 3 | OrderDetailScreen 409 LOC | screens/order-detail/ | 409 |
| 4 | OrderProductEditBottomSheet 376 LOC | components/order/ | 376 |
| 5 | OtpVerificationBottomSheet 341 LOC | screens/otp-verification/ | 341 |
| 6 | ConfirmOrderScreen 335 LOC | screens/confirm-order/ | 335 |
| 7 | Error handling inconsistent: bare Error() vs AppError | use cases, repos | ~30 files |
| 8 | Missing AbortController in most screens | HomeScreen, StoresScreen, etc | ~8 screens |
| 9 | 3 sources of truth: Redux + useState + refs | AddressManagement, ConfirmOrder | 2 screens |
| 10 | No i18n: Vietnamese hardcoded everywhere | all screens | ~16 screens |
| 11 | Mock data in production data/ folder | data/*.ts | 5 files |
| 12 | Cart logic split: orderCartSlice + OrderService | state/ + presentation/ | 2 layers |

---

## Architecture Strengths (Keep These)

- Clean Architecture: domain → application → infrastructure → presentation
- Repository pattern with interfaces + implementations
- DTOs isolate API contracts from domain entities
- Mappers for clean data transformation
- Redux Toolkit + persist for state management
- SecureStore for token storage
- Background service registry pattern
- BaseLayout abstraction for screens
- Popup/Toast service pattern

---

## Unresolved Questions

1. Backend API documentation? (needed to complete missing endpoints)
2. Who owns the Goong API key? (geo-coding dependency)
3. Target platforms? (App Store / Play Store submission timeline)
4. Backend supports refresh tokens? (critical for token flow)
5. Team size & velocity? (affects phase planning)
