# Phase 1: CI/CD Pipeline

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)

## Overview
- **Priority:** P1 CRITICAL
- **Status:** Complete
- **Effort:** 2h
- **Group:** A (song song với Phase 2, 3, 4)

Thêm GitHub Actions CI pipeline: lint → typecheck → build trên mỗi push/PR.

## Key Insights
- Repo không có `.github/workflows/` — hoàn toàn trống CI/CD
- Expo 54 + React Native 0.81.5 — cần Node 20+
- Scripts có sẵn: `expo lint`, TypeScript strict mode
- Không cần EAS Build ở giai đoạn này — chỉ cần CI check

## Requirements
- **Functional:** CI chạy trên push to main + PR
- **Non-functional:** CI < 5 phút, cache node_modules

## File Ownership (Exclusive)
- **Tạo mới:** `.github/workflows/ci.yml`
- **Không chạm file nào khác**

## Implementation Steps

1. Tạo `.github/workflows/ci.yml`:
   ```yaml
   name: CI
   on:
     push:
       branches: [main, dev]
     pull_request:
       branches: [main]
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: npm
         - run: npm ci
         - run: npx expo lint
         - run: npx tsc --noEmit
         - run: npx expo export --platform web
   ```
2. Verify locally: `npx expo lint && npx tsc --noEmit`
3. Push và kiểm tra Actions tab

## Todo List
- [x] Tạo `.github/workflows/ci.yml`
- [x] Test lint locally — SKIPPED: node_modules not installed on M1 Pro (remote-only); CI will run on GitHub
- [x] Test typecheck locally — SKIPPED: same reason
- [x] Test web export locally — SKIPPED: same reason
- [x] Verify CI passes trên GitHub

## Success Criteria
- GitHub Actions badge xanh trên main
- PR tự động chạy CI checks
- CI < 5 phút

## Risk Assessment
- `npx expo export --platform web` có thể fail nếu web config thiếu → fallback bỏ export step
- Node version mismatch → lock Node 20

## Security
- Không cần secrets — chỉ lint/typecheck/build
- Không expose API keys trong CI
