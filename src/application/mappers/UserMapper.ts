import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/AuthDTO';

export class UserMapper {
    static toUser(dto: UserResponseDTO): User {
        return {
            id: dto.id,
            uuid: dto.uuid,
            phone: dto.phone,
            email: dto.email,
            displayName: dto.display_name,
            avatarUrl: dto.avatar_url,
            role: dto.role as any,
            storeId: dto.store_id,
            isActive: dto.is_active === 1,
            loyaltyPoint: dto.loyalty_point,
            availablePoint: dto.available_point,
            currentLevelId: dto.current_level_id,
            nextLevelId: dto.next_level_id,
            otp: dto.otp,
            qrcodeUrl: dto.qrcode_url ?? null,
            barcodeUrl: dto.barcode_url ?? null,
            store: dto.store,
            createdAt: new Date(dto.created_at),
            updatedAt: dto.updated_at ? new Date(dto.updated_at) : null,
        };
    }
}