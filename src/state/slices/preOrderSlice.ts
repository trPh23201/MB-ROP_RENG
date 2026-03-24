import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreOrderMapper } from '../../application/mappers/PreOrderMapper';
import { CreatePreOrderUseCase } from '../../application/usecases/CreatePreOrderUseCase';
import { CreatePreOrderParams } from '../../domain/repositories/PreOrderRepository';
import { OrderType } from '../../domain/shared';
import { preOrderRepository } from '../../infrastructure/repositories/PreOrderRepositoryImpl';

const createPreOrderUseCase = new CreatePreOrderUseCase(preOrderRepository);
type SerializablePreOrder = ReturnType<typeof PreOrderMapper.toSerializable>;

interface PreOrderState {
  isLoading: boolean;
  error: string | null;
  lastOrder: SerializablePreOrder | null;
  orderType: OrderType;
  selectedVouchers: { code: string }[];
}

const initialState: PreOrderState = {
  isLoading: false,
  error: null,
  lastOrder: null,
  orderType: OrderType.TAKEAWAY,
  selectedVouchers: [],
};

export const createPreOrder = createAsyncThunk<SerializablePreOrder, CreatePreOrderParams, { rejectValue: string }>('preOrder/create',
  async (params: CreatePreOrderParams, { rejectWithValue }) => {
    try {
      const result = await createPreOrderUseCase.execute(params);
      return PreOrderMapper.toSerializable(result);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã có lỗi xảy ra khi tạo đơn hàng');
    }
  }
);

const preOrderSlice = createSlice({
  name: 'preOrder',
  initialState,
  reducers: {
    clearPreOrderError: (state) => {
      state.error = null;
    },
    setOrderType: (state, action: PayloadAction<OrderType>) => {
      state.orderType = action.payload;
    },
    setSelectedVouchers: (state, action: PayloadAction<{ code: string }[]>) => {
      state.selectedVouchers = action.payload;
    },
    resetPreOrder: (state) => {
      state.lastOrder = null;
      state.selectedVouchers = [];
      state.error = null;
      state.orderType = OrderType.TAKEAWAY;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPreOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPreOrder.fulfilled, (state, action: PayloadAction<SerializablePreOrder>) => {
        state.isLoading = false;
        state.lastOrder = action.payload;
      })
      .addCase(createPreOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đã có lỗi xảy ra';
      });
  },
});

export const { clearPreOrderError, setOrderType, setSelectedVouchers, resetPreOrder } = preOrderSlice.actions;
export default preOrderSlice.reducer;

export const selectIsLoading = (state: { preOrder: PreOrderState }) => state.preOrder.isLoading;
export const selectError = (state: { preOrder: PreOrderState }) => state.preOrder.error;
export const selectLastOrder = (state: { preOrder: PreOrderState }) => state.preOrder.lastOrder;
export const selectPreOrderType = (state: { preOrder: PreOrderState }) => state.preOrder.orderType;
export const selectSelectedVouchers = (state: { preOrder: PreOrderState }) => state.preOrder.selectedVouchers;