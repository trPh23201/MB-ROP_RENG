import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandMapper } from '../../application/mappers/BrandMapper';
import { GetBrandsUseCase } from '../../application/usecases/GetBrandsUseCase';
import { brandRepository } from '../../infrastructure/repositories/BrandRepositoryImpl';

const getBrandsUseCase = new GetBrandsUseCase(brandRepository);

type SerializableBrand = ReturnType<typeof BrandMapper.toSerializableBrand>;

interface BrandState {
    brands: SerializableBrand[];
    selectedBrandId: number | null;
    loading: boolean;
    error: string | null;
}

const initialState: BrandState = {
    brands: [],
    selectedBrandId: null,
    loading: false,
    error: null,
};

export const fetchBrands = createAsyncThunk('brand/fetch', async () => {
    const result = await getBrandsUseCase.execute();

    return {
        brands: result.brands.map(brand => BrandMapper.toSerializableBrand(brand)),
    };
});

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        selectBrand: (state, action: PayloadAction<number>) => {
            state.selectedBrandId = action.payload;
        },
        clearSelectedBrand: state => {
            state.selectedBrandId = null;
        },
        clearBrandError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBrands.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload.brands;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tải danh sách thương hiệu';
            });
    },
});

export const { selectBrand, clearSelectedBrand, clearBrandError } =
    brandSlice.actions;
export default brandSlice.reducer;

type RootState = { brand: BrandState };

export const selectBrands = (state: RootState) => state.brand.brands;
export const selectSelectedBrandId = (state: RootState) => state.brand.selectedBrandId;
export const selectBrandLoading = (state: RootState) => state.brand.loading;
export const selectBrandError = (state: RootState) => state.brand.error;