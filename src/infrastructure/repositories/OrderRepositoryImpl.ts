import { OrderDTO, OrderHistoryResponseDTO } from '../../application/dto/OrderDTO';
import { OrderMapper } from '../../application/mappers/OrderMapper';
import { ApiError } from '../../core/errors/AppErrors';
import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { ORDER_HISTORY_API } from '../api/order-history/OrderHistoryApiConfig';
import { httpClient } from '../http/HttpClient';

export class OrderRepositoryImpl implements OrderRepository {
  async getOrderHistory(userUuid: string, page: number, limit: number, statuses?: string[]): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const params: Record<string, string | number> = { page, limit };

    if (statuses && statuses.length > 0) {
      params.status = statuses.join(',');
    }

    const url = ORDER_HISTORY_API.GET_HISTORY(userUuid);
    const response = await httpClient.get<OrderHistoryResponseDTO>(url, { params });

    return {
      orders: response.orders.map((dto) => OrderMapper.toDomain(dto)),
      total: response.total,
      totalPages: response.total_pages,
      page: response.page,
      limit: response.limit,
    };
  }

  async getOrderDetail(orderId: number): Promise<Order> {
    const url = ORDER_HISTORY_API.GET_DETAIL(orderId);
    const response = await httpClient.get<{ success: boolean; order: OrderDTO }>(url);
    return OrderMapper.toDomain(response.order);
  }

  async confirmOrder(payload: ConfirmOrder): Promise<Order> {
    // This method is currently not fully implemented - using placeholder for now
    // The ConfirmOrder entity represents a confirmed order response, not request data
    throw new ApiError('confirmOrder is not implemented - use ConfirmOrderRepository instead');
  }
}