import { AuthMapper } from '../../../src/application/mappers/AuthMapper';
import { UserResponseDTO } from '../../../src/application/dto/AuthDTO';

function makeUserDTO(overrides: Partial<UserResponseDTO> = {}): UserResponseDTO {
  return {
    id: 1,
    uuid: 'uuid-001',
    phone: '0901234567',
    email: 'test@example.com',
    password_hash: 'hashed',
    display_name: 'Nguyễn Văn A',
    avatar_url: null,
    role: 'end_user',
    store_id: null,
    is_active: 1,
    loyalty_point: 100,
    available_point: 80,
    current_level_id: 1,
    next_level_id: 2,
    otp: '123456',
    qrcode_url: 'https://example.com/qr.png',
    barcode_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    deleted_at: null,
    store: null,
    ...overrides,
  };
}

describe('AuthMapper.toUser', () => {
  it('maps DTO to User entity correctly', () => {
    const dto = makeUserDTO();
    const user = AuthMapper.toUser(dto);

    expect(user.id).toBe(1);
    expect(user.uuid).toBe('uuid-001');
    expect(user.phone).toBe('0901234567');
    expect(user.email).toBe('test@example.com');
    expect(user.displayName).toBe('Nguyễn Văn A');
    expect(user.role).toBe('end_user');
  });

  it('converts is_active 1 to true', () => {
    const user = AuthMapper.toUser(makeUserDTO({ is_active: 1 }));
    expect(user.isActive).toBe(true);
  });

  it('converts is_active 0 to false', () => {
    const user = AuthMapper.toUser(makeUserDTO({ is_active: 0 }));
    expect(user.isActive).toBe(false);
  });

  it('maps snake_case to camelCase fields', () => {
    const user = AuthMapper.toUser(makeUserDTO({ store_id: 42 }));
    expect(user.storeId).toBe(42);
  });

  it('converts created_at string to Date', () => {
    const user = AuthMapper.toUser(makeUserDTO({ created_at: '2024-06-15T10:00:00Z' }));
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt.getFullYear()).toBe(2024);
  });

  it('returns null updatedAt when updated_at is null', () => {
    const user = AuthMapper.toUser(makeUserDTO({ updated_at: null }));
    expect(user.updatedAt).toBeNull();
  });

  it('converts updated_at string to Date when provided', () => {
    const user = AuthMapper.toUser(makeUserDTO({ updated_at: '2024-06-16T10:00:00Z' }));
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('maps loyalty and available points', () => {
    const user = AuthMapper.toUser(makeUserDTO({ loyalty_point: 500, available_point: 300 }));
    expect(user.loyaltyPoint).toBe(500);
    expect(user.availablePoint).toBe(300);
  });

  it('handles null qrcode_url', () => {
    const user = AuthMapper.toUser(makeUserDTO({ qrcode_url: null }));
    expect(user.qrcodeUrl).toBeNull();
  });

  it('maps qrcode_url when provided', () => {
    const user = AuthMapper.toUser(makeUserDTO({ qrcode_url: 'https://example.com/qr' }));
    expect(user.qrcodeUrl).toBe('https://example.com/qr');
  });
});

describe('AuthMapper.toSerializable', () => {
  it('converts User to serializable form with ISO string dates', () => {
    const dto = makeUserDTO({ created_at: '2024-01-01T00:00:00Z' });
    const user = AuthMapper.toUser(dto);
    const serializable = AuthMapper.toSerializable(user);

    expect(typeof serializable.createdAt).toBe('string');
    expect(serializable.createdAt).toContain('2024');
  });

  it('sets isNewUser true when displayName is null', () => {
    const user = AuthMapper.toUser(makeUserDTO({ display_name: null }));
    const serializable = AuthMapper.toSerializable(user);
    expect(serializable.isNewUser).toBe(true);
  });

  it('sets isNewUser false when displayName is present', () => {
    const user = AuthMapper.toUser(makeUserDTO({ display_name: 'Nguyễn Văn A' }));
    const serializable = AuthMapper.toSerializable(user);
    expect(serializable.isNewUser).toBe(false);
  });

  it('updatedAt is null when not set', () => {
    const user = AuthMapper.toUser(makeUserDTO({ updated_at: null }));
    const serializable = AuthMapper.toSerializable(user);
    expect(serializable.updatedAt).toBeNull();
  });
});
