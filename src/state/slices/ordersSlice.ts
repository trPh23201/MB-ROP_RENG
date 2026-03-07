import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../domain/entities/Order';

interface OrdersState {
  historyOrders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  historyOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setHistoryOrders(state, action: PayloadAction<Order[]>) {
      state.historyOrders = action.payload;
    },
    appendHistoryOrders(state, action: PayloadAction<Order[]>) {
      const existingIds = new Set(state.historyOrders.map(o => o.id));
      const newOrders = action.payload.filter(o => !existingIds.has(o.id));
      state.historyOrders = [...state.historyOrders, ...newOrders];
    },
    setCurrentOrder(state, action: PayloadAction<Order | null>) {
      state.currentOrder = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearOrders(state) {
      state.historyOrders = [];
      state.currentOrder = null;
      state.error = null;
    },
  },
});

export const {
  setHistoryOrders,
  appendHistoryOrders,
  setCurrentOrder,
  setLoading,
  setError,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;