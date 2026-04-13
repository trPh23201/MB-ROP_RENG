import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetHomeMenuUseCase } from "../../application/usecases/GetHomeMenuUseCase";
import { GetVouchersUseCase } from "../../application/usecases/GetVouchersUseCase";
import { Product } from "../../domain/entities/Product";
import { Store } from "../../domain/entities/Store";
import { Voucher } from "../../domain/entities/Voucher";
import { homeRepository } from "../../infrastructure/repositories/HomeRepositoryImpl";

const getHomeMenuUseCase = new GetHomeMenuUseCase(homeRepository);
const getVouchersUseCase = new GetVouchersUseCase(homeRepository);

interface HomeState {
  storeId: number | null;
  store: Store | null;
  menuId: number | null;
  products: Product[];
  productsLoading: boolean;
  productsLoadingMore: boolean;
  productsError: string | null;
  currentPage: number;
  hasMore: boolean;
  vouchers: Voucher[];
  vouchersLoading: boolean;
  vouchersError: string | null;
  toppings: Product[];
}

interface FetchParams {
  lat: number;
  lng: number;
  limit?: number;
  page?: number;
}

export const fetchHomeMenu = createAsyncThunk("home/fetchMenu", async (params: FetchParams, { rejectWithValue }) => {
  try {
    const result = await getHomeMenuUseCase.execute(params);
    return {
      storeId: result.storeId,
      store: result.store,
      menuId: result.menuId,
      products: result.products,
      toppings: result.toppings,
      page: params.page ?? 0,
      hasMore: result.products.length === (params.limit ?? 10),
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Không thể tải menu");
  }
});

export const fetchHomeMenuMore = createAsyncThunk(
  "home/fetchMenuMore",
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const result = await getHomeMenuUseCase.execute(params);
      return {
        products: result.products,
        page: params.page ?? 0,
        hasMore: result.products.length === (params.limit ?? 10),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Không thể tải thêm");
    }
  },
);

export const fetchVouchers = createAsyncThunk(
  "home/fetchVouchers",
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const result = await getVouchersUseCase.execute(params);
      return result.vouchers;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Không thể tải voucher");
    }
  },
);

export const fetchMenuByStore = createAsyncThunk("home/fetchMenuByStore", async (storeId: number, { rejectWithValue }) => {
    try {
      const result = await homeRepository.getMenuByStore(storeId);
      return {
        storeId: result.storeId,
        menuId: result.menuId,
        products: result.products,
        toppings: result.toppings,
      };
    } catch (error) {
      // Error captured by Sentry
      return rejectWithValue(error instanceof Error ? error.message : "Không thể tải menu cửa hàng");
    }
  },
);

const initialState: HomeState = {
  storeId: null,
  store: null,
  menuId: null,
  products: [],
  productsLoading: false,
  productsLoadingMore: false,
  productsError: null,
  currentPage: 0,
  hasMore: true,
  vouchers: [],
  vouchersLoading: false,
  vouchersError: null,
  toppings: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeError: (state) => {
      state.productsError = null;
      state.vouchersError = null;
    },
    resetHomeData: (state) => {
      state.products = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.productsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeMenu.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchHomeMenu.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.storeId = action.payload.storeId;
        state.store = action.payload.store;
        state.menuId = action.payload.menuId;
        state.products = action.payload.products;
        state.toppings = action.payload.toppings;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomeMenu.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });

    builder
      .addCase(fetchHomeMenuMore.pending, (state) => {
        state.productsLoadingMore = true;
      })
      .addCase(fetchHomeMenuMore.fulfilled, (state, action) => {
        state.productsLoadingMore = false;
        const existingIds = new Set(state.products.map((p) => p.id));
        const newProducts = action.payload.products.filter((p) => !existingIds.has(p.id));
        state.products = [...state.products, ...newProducts];
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomeMenuMore.rejected, (state, action) => {
        state.productsLoadingMore = false;
        state.productsError = action.payload as string;
      });

    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.vouchersLoading = true;
        state.vouchersError = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.vouchersLoading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.vouchersLoading = false;
        state.vouchersError = action.payload as string;
      });

    builder
      .addCase(fetchMenuByStore.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchMenuByStore.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.storeId = action.payload.storeId;
        state.menuId = action.payload.menuId;
        state.products = action.payload.products;
        state.toppings = action.payload.toppings;
        state.currentPage = 0;
        state.hasMore = false;
      })
      .addCase(fetchMenuByStore.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });
  },
});

export const { clearHomeError, resetHomeData } = homeSlice.actions;
export default homeSlice.reducer;

export const selectStore = (state: { home: HomeState }) => state.home.store;
export const selectProducts = (state: { home: HomeState }) => state.home.products;
export const selectProductsLoading = (state: { home: HomeState }) => state.home.productsLoading;
export const selectProductsLoadingMore = (state: { home: HomeState }) => state.home.productsLoadingMore;
export const selectProductsError = (state: { home: HomeState }) => state.home.productsError;
export const selectCurrentPage = (state: { home: HomeState }) => state.home.currentPage;
export const selectHasMoreProducts = (state: { home: HomeState }) => state.home.hasMore;
export const selectVouchers = (state: { home: HomeState }) => state.home.vouchers;
export const selectVouchersLoading = (state: { home: HomeState }) => state.home.vouchersLoading;
export const selectStoreId = (state: { home: HomeState }) => state.home.storeId;
export const selectToppings = (state: { home: HomeState }) => state.home.toppings;
