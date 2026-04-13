import { ConfirmOrder } from '../../domain/entities/ConfirmOrder';
import { ConfirmOrderParams, ConfirmOrderRepository } from '../../domain/repositories/ConfirmOrderRepository';
import { ValidationError } from '../../core/errors/AppErrors';

/**
 * Use case for confirming a pre-order
 */
export class ConfirmOrderUseCase {
    constructor(private readonly repository: ConfirmOrderRepository) { }

    /**
     * Execute the confirm order use case
     * @param params - Contains preorderId
     * @returns Confirmed order details
     */
    async execute(params: ConfirmOrderParams): Promise<ConfirmOrder> {
        // Validate params
        if (!params.preorderId || params.preorderId <= 0) {
            throw new ValidationError('preorderId', 'ID đơn hàng không hợp lệ');
        }

        return this.repository.confirm(params);
    }
}
