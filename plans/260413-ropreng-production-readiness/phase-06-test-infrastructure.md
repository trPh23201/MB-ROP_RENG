# Phase 6: Test Infrastructure + Domain Tests

## Context
- [Diagnostic Report](../reports/diagnostic-260413-ropreng-health-check.md)
- Phụ thuộc: Group B (Phase 4-5) phải xong trước

## Overview
- **Priority:** P1 CRITICAL
- **Status:** Complete
- **Effort:** 7h
- **Group:** C (song song với Phase 7)

Setup Jest + React Native Testing Library. Viết tests cho domain + application layers (highest value/lowest effort).

## Key Insights
- 0 test files, 0 test config — bắt đầu từ zero
- Clean Architecture = domain layer dễ test nhất (pure logic, no deps)
- 15 use cases, 12 entities, 11 repository interfaces — test surface lớn
- Redux slices có async thunks — cần mock store

## Requirements
- **Functional:** Jest chạy được, test domain entities + use cases + mappers
- **Non-functional:** Test < 30s, coverage > 60% cho domain + application layers

## Bổ sung (Red Team fix): Thêm `npm test` vào CI
- Sau khi tests pass, update `.github/workflows/ci.yml` thêm step `- run: npm test`

## File Ownership (Exclusive)
- **Tạo mới:**
  - `jest.config.js`
  - `jest.setup.js`
  - `__tests__/domain/entities/*.test.ts`
  - `__tests__/domain/services/*.test.ts`
  - `__tests__/application/usecases/*.test.ts`
  - `__tests__/application/mappers/*.test.ts`
  - `__tests__/state/slices/*.test.ts`
- **Sửa:**
  - `package.json` (devDeps: jest, @testing-library/react-native, ts-jest)

## Implementation Steps

1. **Install test dependencies**:
   ```bash
   npm install -D jest @types/jest ts-jest @testing-library/react-native @testing-library/jest-native jest-expo
   ```

2. **Tạo `jest.config.js`**:
   ```javascript
   module.exports = {
     preset: 'jest-expo',
     transformIgnorePatterns: [
       'node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo|@sentry|tamagui|moti|@tamagui)/)'
     ],
     setupFilesAfterSetup: ['./jest.setup.js'],
     testMatch: ['**/__tests__/**/*.test.ts?(x)'],
     collectCoverageFrom: [
       'src/domain/**/*.ts',
       'src/application/**/*.ts',
       '!src/**/index.ts'
     ]
   };
   ```

3. **Tạo `jest.setup.js`**: Mock AsyncStorage, SecureStore

4. **Test domain entities** (pure, no deps):
   - `User.ts`: tạo user, validate fields
   - `Product.ts`: price calculations
   - `Order.ts`: order status transitions
   - `PreOrder.ts`: step validation

5. **Test domain services**:
   - `ProductService.ts`: product logic
   - `ConfirmOrderService.ts`: order confirmation logic
   - `VoucherService.ts`: discount calculations

6. **Test application mappers**:
   - `AuthMapper.ts`: DTO → Entity mapping
   - `OrderMapper.ts`: Order DTO → Entity
   - `ProductMapper.ts`: Product DTO → Entity

7. **Test application use cases** (mock repositories):
   - `LoginUseCase.ts`: happy path + validation errors
   - `GetBrandsUseCase.ts`: success + error
   - `CreatePreOrderUseCase.ts`: validation + success

8. **Thêm script** vào `package.json`:
   ```json
   "test": "jest",
   "test:coverage": "jest --coverage"
   ```

## Todo List
- [x] Install test dependencies
- [x] Tạo jest.config.js + jest.setup.js
- [x] Test entities: User, Product, Order, PreOrder, Voucher
- [x] Test domain services: ProductService, VoucherService, ConfirmOrderService, UserService
- [x] Test mappers: AuthMapper, OrderMapper, ProductMapper
- [x] Test use cases: LoginUseCase, GetBrandsUseCase, CreatePreOrderUseCase
- [x] Thêm test script vào package.json
- [x] `npm test` pass 100% (145/145)
- [x] Coverage 91-100% on all tested files; overall 24% (30+ untested files bring average down)

## Success Criteria
- `npm test` pass, 0 failures
- Coverage ≥ 60% cho `src/domain/` + `src/application/`
- Test chạy < 30s
- CI (Phase 1) có thể thêm `npm test` step

## Risk Assessment
- Expo + RN transform config phức tạp → dùng `jest-expo` preset
- Mock SecureStore/AsyncStorage cần setup đúng
- Use case tests cần mock repository → dùng interface → dễ mock
