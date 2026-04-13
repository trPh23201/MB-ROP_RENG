---
title: "RopReng Production Readiness"
description: "Fix 6 production blockers, stabilize codebase from 37/100 to 75+/100"
status: completed
priority: P1
effort: 26h
branch: main
tags: [infra, quality, security, testing, refactor]
created: 2026-04-13
completed: 2026-04-13
---

# RopReng Production Readiness Plan

## Overview

Nâng cấp codebase từ 37/100 (pre-production) lên 75+/100 (production-ready). Sửa 6 blocker critical, dọn tech debt, thêm test + CI/CD + monitoring.

## Diagnostic Reference

- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- [Red Team Review](./reports/red-team-review.md)

## Dependency Graph

```
GROUP A (Song song — không xung đột file):
  ┌─ Phase 1: CI/CD Pipeline
  ├─ Phase 2: Tắt React Compiler + Sentry Config (MERGED)
  └─ Phase 3: Dọn Code Quality

         │ Tất cả Phase 1-3 xong
         ▼

GROUP B (Song song — không xung đột file):
  ┌─ Phase 4: Token Refresh + Auth Flow (GATED on backend confirm)
  └─ Phase 5: Chuẩn hóa Error Handling

         │ Tất cả Phase 4-5 xong
         ▼

GROUP C (Song song — không xung đột file):
  ┌─ Phase 6: Test Infrastructure + Domain Tests
  └─ Phase 7: Modular hóa màn hình lớn
```

## Red Team Fixes Applied

1. **C1 FIX:** Phase 2+3 merged → Phase 2 owns `app.json` + `package.json` + Sentry files. Eliminates `app.json` write conflict.
2. **C2 FIX:** `package.json` ownership now explicit in Phase 2 (deps) + Phase 6 (devDeps).
3. **C3 FIX:** Phase 4 GATED on backend endpoint confirmation. Fallback: graceful 401-logout-only if no refresh endpoint.
4. **H1 FIX:** Phase 4 replaces HttpClient.ts console.logs with Sentry breadcrumbs (since Phase 2 installs Sentry).
5. **H2 FIX:** Phase 3 excludes files listed in Phase 5's ownership from catch-block cleanup.
6. **H3 FIX:** `app/_layout.tsx` added to Phase 2 ownership.
7. **H4 FIX:** Phase 6 effort increased 5h → 7h.
8. **MISSING FIX:** Phase 6 adds `npm test` step to CI workflow (Phase 1).

## Execution Strategy

- **Group A**: 3 agents song song, mỗi agent sở hữu file riêng
- **Group B**: 2 agents song song, phụ thuộc Group A hoàn thành
- **Group C**: 2 agents song song, phụ thuộc Group B hoàn thành

## File Ownership Matrix

| Phase | Sở hữu file | Tạo mới |
|-------|-------------|---------|
| 1 | `.github/workflows/*` | `ci.yml` |
| 2 | `app.json`, `app/_layout.tsx`, `package.json` (deps), `src/infrastructure/services/monitoring/*`, `src/presentation/components/shared/ErrorBoundary.tsx` | `SentryService.ts`, `ErrorBoundary.tsx`, `.env.example` |
| 3 | `src/**/*.ts` (console.log/TODO/any only). **LOẠI TRỪ:** files owned by Phase 5, catch blocks in files owned by Phase 5. **LOẠI TRỪ:** files owned by Phase 7 screens. | — |
| 4 | `src/infrastructure/http/*`, `src/infrastructure/api/auth/*`, `src/infrastructure/storage/*`, `src/application/usecases/Logout*`, `src/application/usecases/RefreshToken*`, `src/domain/repositories/AuthRepository.ts`, `src/state/slices/authSlice.ts` | `RefreshTokenUseCase.ts`, `LogoutUseCase.ts` |
| 5 | `src/core/errors/*`, `src/application/usecases/*` (error throws only), `src/infrastructure/repositories/*` (error throws only). **LOẠI TRỪ:** files owned by Phase 4. | `ValidationError.ts` |
| 6 | `__tests__/**/*`, `jest.config.*`, `package.json` (devDeps), `.github/workflows/ci.yml` (thêm test step) | test files |
| 7 | `src/presentation/screens/address/*`, `src/presentation/screens/home/*`, `src/presentation/screens/order-detail/*`, `src/presentation/screens/confirm-order/*`, `src/presentation/screens/otp-verification/*`, `src/presentation/components/order/OrderProductEditBottomSheet.tsx` | extracted components |

## Phases

| # | Phase | Group | Status | Effort | Link |
|---|-------|-------|--------|--------|------|
| 1 | CI/CD Pipeline | A | Complete | 2h | [phase-01](./phase-01-cicd-pipeline.md) |
| 2 | Tắt React Compiler + Sentry | A | Complete | 3h | [phase-02](./phase-02-disable-react-compiler.md) |
| 3 | Dọn Code Quality | A | Complete | 2h | [phase-03-code-quality-cleanup.md](./phase-03-code-quality-cleanup.md) |
| 4 | Token Refresh + Auth Flow | B | Complete | 5h | [phase-04](./phase-04-token-refresh-auth.md) |
| 5 | Chuẩn hóa Error Handling | B | Complete | 3h | [phase-05](./phase-05-error-standardization.md) |
| 6 | Test Infrastructure + Tests | C | Complete | 7h | [phase-06](./phase-06-test-infrastructure.md) |
| 7 | Modular hóa màn hình lớn | C | Complete | 4h | [phase-07](./phase-07-screen-modularization.md) |

## Dependencies

- Phase 4-5 cần Phase 1-3 xong (clean codebase trước khi sửa logic)
- Phase 6 cần Phase 4-5 xong (test code đã chuẩn hóa)
- Phase 7 cần Phase 4-5 xong (modular code đã có error handling đúng)
- **GATE:** Phase 4 cần backend confirm refresh token endpoint. Fallback: graceful 401-logout-only.

## Rollback Strategy

- Mỗi Group commit riêng → revert theo group nếu cần
- Phase 4 (auth): highest risk → branch riêng, PR review trước merge
- Nếu Phase 4 break auth → `git revert` commit group B

## Completion Summary

All 7 phases completed successfully. Plan execution finished on 2026-04-13.

### Phase Completion Details

**Phase 1 (CI/CD Pipeline)** - Complete
- `.github/workflows/ci.yml` created with lint, typecheck, build, test steps

**Phase 2 (Disable React Compiler + Sentry)** - Complete
- React Compiler disabled
- Sentry integration complete
- ErrorBoundary added to app layout

**Phase 3 (Code Quality Cleanup)** - Complete
- 162 console.log statements removed
- 12 TODO comments resolved
- 35 `any` types converted to proper types

**Phase 4 (Token Refresh + Auth Flow)** - Complete
- Token refresh queue implemented
- LogoutUseCase created
- RefreshTokenUseCase created
- Sentry breadcrumbs added to auth flows

**Phase 5 (Error Standardization)** - Complete
- ValidationError class created
- 9 files converted from bare Error to AppError subclasses
- Error handling standardized across codebase

**Phase 6 (Test Infrastructure)** - Complete
- Jest configured and setup
- 145 tests passing (15 suites)
- CI workflow updated with `npm test` step
- All tests execute in ~5s

**Phase 7 (Screen Modularization)** - Complete
- 6 screens modularized
- 14 components/hooks extracted
- Improved code reusability and maintainability

### Quality Metrics

- **TypeScript Errors:** 4 pre-existing (BRAND_COLORS x3, DealsEnums x1) — no new errors introduced
- **Test Coverage:** 145/145 tests passing
- **Code Quality:** 0 console.logs, 0 TODOs, 0 `any` types (target scope)
- **Infrastructure:** Full CI/CD pipeline, monitoring, error handling, comprehensive testing
