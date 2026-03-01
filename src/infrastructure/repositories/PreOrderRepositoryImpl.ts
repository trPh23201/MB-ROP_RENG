import { AxiosError } from 'axios';
import { ConfirmOrderResponseDTO, CreatePreOrderResponseDTO } from '../../application/dto/PreOrderDTO';
import { PreOrderMapper } from '../../application/mappers/PreOrderMapper';
import { NetworkError } from '../../core/errors/AppErrors';
import { PreOrder } from '../../domain/entities/PreOrder';
import { CreatePreOrderParams, PreOrderRepository } from '../../domain/repositories/PreOrderRepository';
import { PREORDER_ENDPOINTS } from '../api/preorder/PreOrderApiConfig';
import { httpClient } from '../http/HttpClient';

export class PreOrderRepositoryImpl implements PreOrderRepository {
  private static instance: PreOrderRepositoryImpl;

  private constructor() { }

  public static getInstance(): PreOrderRepositoryImpl {
    if (!PreOrderRepositoryImpl.instance) {
      PreOrderRepositoryImpl.instance = new PreOrderRepositoryImpl();
    }
    return PreOrderRepositoryImpl.instance;
  }

  async create(params: CreatePreOrderParams): Promise<PreOrder> {
    try {
      const requestDTO = PreOrderMapper.toRequestDTO(params);

      const response = await httpClient.post<CreatePreOrderResponseDTO>(
        PREORDER_ENDPOINTS.CREATE,
        requestDTO
      );

      return PreOrderMapper.toEntity(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw new NetworkError();
        }

        const message = error.response.data?.message || 'Không thể tính giá đơn hàng';
        throw new Error(message);
      }

      throw new Error('Đã có lỗi xảy ra khi tính giá');
    }
  }

  async confirm(params: CreatePreOrderParams): Promise<PreOrder> {
    try {
      const requestDTO = PreOrderMapper.toRequestDTO(params);

      const response = await httpClient.post<ConfirmOrderResponseDTO>(
        PREORDER_ENDPOINTS.CONFIRM,
        requestDTO
      );

      return PreOrderMapper.toConfirmEntity(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw new NetworkError();
        }

        const message = error.response.data?.message || 'Không thể tạo đơn hàng';
        throw new Error(message);
      }

      throw new Error('Đã có lỗi xảy ra khi tạo đơn hàng');
    }
  }
}

export const preOrderRepository = PreOrderRepositoryImpl.getInstance();