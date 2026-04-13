import { AxiosError } from 'axios';
import { ConfirmOrderResponseDTO } from '../../application/dto/ConfirmOrderDTO';
import { ConfirmOrderMapper } from '../../application/mappers/ConfirmOrderMapper';
import { ApiError, NetworkError } from '../../core/errors/AppErrors';
import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { ConfirmOrderParams, ConfirmOrderRepository } from '../../domain/repositories/ConfirmOrderRepository';
import { CONFIRM_ORDER_ENDPOINTS } from '../api/confirm-order/ConfirmOrderApiConfig';
import { httpClient } from '../http/HttpClient';

export class ConfirmOrderRepositoryImpl implements ConfirmOrderRepository {
    private static instance: ConfirmOrderRepositoryImpl;

    private constructor() { }

    public static getInstance(): ConfirmOrderRepositoryImpl {
        if (!ConfirmOrderRepositoryImpl.instance) {
            ConfirmOrderRepositoryImpl.instance = new ConfirmOrderRepositoryImpl();
        }
        return ConfirmOrderRepositoryImpl.instance;
    }

    async confirm(params: ConfirmOrderParams): Promise<ConfirmOrder> {
        try {
            const endpoint = CONFIRM_ORDER_ENDPOINTS.CONFIRM(params.preorderId);

            const response = await httpClient.post<ConfirmOrderResponseDTO>(
                endpoint,
                { id: params.preorderId }
            );

            return ConfirmOrderMapper.toEntity(response);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (!error.response) {
                    throw new NetworkError();
                }

                const message = error.response.data?.message || 'Không thể xác nhận đơn hàng';
                throw new ApiError(message);
            }

            throw new ApiError('Đã có lỗi xảy ra khi xác nhận đơn hàng');
        }
    }
}

export const confirmOrderRepository = ConfirmOrderRepositoryImpl.getInstance();
