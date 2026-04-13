export type UserRole = 'end_user' | 'admin' | 'store_staff';

export interface User {
  readonly id: number;
  readonly uuid: string;
  readonly phone: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly role: UserRole;
  readonly storeId: number | null;
  readonly isActive: boolean;
  readonly loyaltyPoint: number;
  readonly availablePoint: number;
  readonly currentLevelId: number | null;
  readonly nextLevelId: number | null;
  readonly otp?: string;
  readonly qrcodeUrl?: string | null;
  readonly barcodeUrl?: string | null;
  readonly store?: unknown | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
}