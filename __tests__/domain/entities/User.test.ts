import { User, UserRole } from '../../../src/domain/entities/User';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    uuid: 'uuid-001',
    phone: '0901234567',
    email: 'test@example.com',
    displayName: 'Test User',
    avatarUrl: null,
    role: 'end_user',
    storeId: null,
    isActive: true,
    loyaltyPoint: 100,
    availablePoint: 80,
    currentLevelId: 1,
    nextLevelId: 2,
    otp: undefined,
    qrcodeUrl: null,
    barcodeUrl: null,
    store: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
    ...overrides,
  };
}

describe('User entity', () => {
  it('creates a valid user object with all required fields', () => {
    const user = makeUser();
    expect(user.id).toBe(1);
    expect(user.uuid).toBe('uuid-001');
    expect(user.phone).toBe('0901234567');
    expect(user.role).toBe('end_user');
  });

  it('accepts admin role', () => {
    const user = makeUser({ role: 'admin' });
    expect(user.role).toBe('admin');
  });

  it('accepts store_staff role', () => {
    const user = makeUser({ role: 'store_staff', storeId: 42 });
    expect(user.role).toBe('store_staff');
    expect(user.storeId).toBe(42);
  });

  it('allows null email', () => {
    const user = makeUser({ email: null });
    expect(user.email).toBeNull();
  });

  it('allows null displayName for new users', () => {
    const user = makeUser({ displayName: null });
    expect(user.displayName).toBeNull();
  });

  it('allows null updatedAt', () => {
    const user = makeUser({ updatedAt: null });
    expect(user.updatedAt).toBeNull();
  });

  it('stores loyalty points correctly', () => {
    const user = makeUser({ loyaltyPoint: 500, availablePoint: 300 });
    expect(user.loyaltyPoint).toBe(500);
    expect(user.availablePoint).toBe(300);
  });

  it('handles isActive flag', () => {
    const active = makeUser({ isActive: true });
    const inactive = makeUser({ isActive: false });
    expect(active.isActive).toBe(true);
    expect(inactive.isActive).toBe(false);
  });

  it('stores createdAt as Date', () => {
    const user = makeUser({ createdAt: new Date('2024-06-15') });
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt.getFullYear()).toBe(2024);
  });
});
