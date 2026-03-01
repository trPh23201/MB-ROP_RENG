import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { randomUUID } from 'expo-crypto';
import { Store } from '../../data/mockStores';
import { Product } from '../../domain/entities/Product';
import { CART_DEFAULTS, CartItem, CartItemCustomization } from '../../presentation/screens/order/OrderInterfaces';
import { logoutUser } from './authSlice';

interface OrderCartState {
  selectedStore: Store | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: OrderCartState = {
  selectedStore: null,
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const SIZE_PRICE_ADJUSTMENTS = {
  small: -10000,
  medium: 0,
  large: 10000,
};

const calculateFinalPrice = (item: CartItem): number => {
  const sizeAdjust = SIZE_PRICE_ADJUSTMENTS[item.customizations.size];
  const toppingTotal = item.customizations.toppings.reduce((sum, t) => sum + t.price, 0);
  return (item.product.price + sizeAdjust + toppingTotal) * item.quantity;
};

const isSameCustomizations = (a: CartItemCustomization, b: CartItemCustomization): boolean => {
  if (a.size !== b.size) return false;
  if (a.ice !== b.ice) return false;
  if (a.sweetness !== b.sweetness) return false;
  if (a.toppings.length !== b.toppings.length) return false;

  // Compare toppings by ID (sorted to avoid order issues)
  const aToppingIds = a.toppings.map(t => t.id).sort();
  const bToppingIds = b.toppings.map(t => t.id).sort();
  return aToppingIds.every((id, i) => id === bToppingIds[i]);
};

const findDuplicateItem = (items: CartItem[], productId: string, customizations: CartItemCustomization, excludeItemId?: string): CartItem | undefined => {
  return items.find(item =>
    item.id !== excludeItemId &&
    item.product.id === productId &&
    isSameCustomizations(item.customizations, customizations)
  );
};

const recalculateTotals = (state: OrderCartState): void => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.finalPrice, 0);
};

const orderCartSlice = createSlice({
  name: 'orderCart',
  initialState,
  reducers: {
    setSelectedStore: (state, action: PayloadAction<Store>) => {
      const newStoreId = action.payload.id;
      const oldStoreId = state.selectedStore?.id;

      if (oldStoreId && oldStoreId !== newStoreId) {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      }

      state.selectedStore = action.payload;

      // TODO: Persist selected store to AsyncStorage for app restart
      // Implementation: AsyncStorage.setItem('selected_store', JSON.stringify(action.payload))

      // TODO: Re-fetch menu if new store is outside current lat/lng range
      // Check if new store coordinates differ significantly from current menu fetch
      // If difference > threshold, dispatch fetchHomeMenu with new coordinates
    },

    addToCart: (state, action: PayloadAction<Product>) => {
      const defaultCustomizations = { ...CART_DEFAULTS };

      const existingItem = findDuplicateItem(
        state.items,
        action.payload.id,
        defaultCustomizations
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.finalPrice = calculateFinalPrice(existingItem);
      } else {
        const newItem: CartItem = {
          id: randomUUID(),
          product: action.payload,
          quantity: 1,
          customizations: defaultCustomizations,
          finalPrice: 0,
        };
        newItem.finalPrice = calculateFinalPrice(newItem);
        state.items.push(newItem);
      }

      recalculateTotals(state);
    },

    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const updatedItem = action.payload;
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index === -1) return;

      // Check for duplicate item with same customizations (excluding self)
      const duplicateItem = findDuplicateItem(
        state.items,
        updatedItem.product.id,
        updatedItem.customizations,
        updatedItem.id // Exclude self
      );

      if (duplicateItem) {
        // MERGE: Combine quantities into duplicate item
        duplicateItem.quantity += updatedItem.quantity;
        duplicateItem.finalPrice = calculateFinalPrice(duplicateItem);

        // Remove the original item
        state.items = state.items.filter(item => item.id !== updatedItem.id);
      } else {
        // UPDATE IN PLACE: No duplicate found
        const updated = { ...updatedItem };
        updated.finalPrice = calculateFinalPrice(updated);
        state.items[index] = updated;
      }

      recalculateTotals(state);
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      state.items = state.items.filter((i) => i.id !== action.payload);
      state.totalItems -= item.quantity;
      state.totalPrice -= item.finalPrice;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;

      state.items = state.items.filter((i) => i.product.id !== productId);
      state.totalItems -= item.quantity;
      state.totalPrice -= item.finalPrice;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    resetCart: (state) => {
      state.selectedStore = null;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.selectedStore = null;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    });
  },
});

export const {
  setSelectedStore,
  addToCart,
  updateCartItem,
  removeCartItem,
  removeItem,
  clearCart,
  resetCart,
} = orderCartSlice.actions;

export default orderCartSlice.reducer;