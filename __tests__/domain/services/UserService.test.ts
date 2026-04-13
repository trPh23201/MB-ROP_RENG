import { UserService } from '../../../src/domain/services/UserService';
import { User } from '../../../src/domain/entities/User';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    uuid: 'uuid-001',
    phone: '0901234567',
    email: null,
    displayName: 'Test User',
    avatarUrl: null,
    role: 'end_user',
    storeId: null,
    isActive: true,
    loyaltyPoint: 0,
    availablePoint: 0,
    currentLevelId: null,
    nextLevelId: null,
    createdAt: new Date(),
    updatedAt: null,
    ...overrides,
  };
}

describe('UserService.isNewUser', () => {
  it('returns true when displayName is null', () => {
    const user = makeUser({ displayName: null });
    expect(UserService.isNewUser(user)).toBe(true);
  });

  it('returns false when displayName is set', () => {
    const user = makeUser({ displayName: 'Nguyễn Văn A' });
    expect(UserService.isNewUser(user)).toBe(false);
  });
});

describe('UserService.hasStoreAccess', () => {
  it('returns true when storeId is set', () => {
    const user = makeUser({ storeId: 5 });
    expect(UserService.hasStoreAccess(user)).toBe(true);
  });

  it('returns false when storeId is null', () => {
    const user = makeUser({ storeId: null });
    expect(UserService.hasStoreAccess(user)).toBe(false);
  });
});
