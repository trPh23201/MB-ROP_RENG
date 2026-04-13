import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loyaltyRepository } from '../../infrastructure/repositories/LoyaltyRepositoryImpl';
import { MembershipTierData } from '../../presentation/screens/deals/DealsInterfaces';



interface LoyaltyState {
  tiers: MembershipTierData[];
  selectedTierData: MembershipTierData | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  tiers: [],
  selectedTierData: null,
  loading: false,
  error: null,
};

export const fetchLoyaltyTiers = createAsyncThunk('loyalty/fetchTiers', async (_, { rejectWithValue }) => {
  try {
    const response = await loyaltyRepository.getLoyaltyTiers();
    const mappedTiers: MembershipTierData[] = response.loyalties.map((tier) => ({
      id: tier.id,
      tier_name: tier.tier_name,
      color: tier.color || '#CCCCCC',
      benefits: tier.benefits.map((b) => ({
        id: b.id,
        icon: b.icon,
        description: b.description,
      })),
    }));
    return mappedTiers;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch loyalty tiers');
  }
});

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setSelectedTierData(state, action: PayloadAction<MembershipTierData | null>) {
      state.selectedTierData = action.payload;
    },
    clearSelectedTierData(state) {
      state.selectedTierData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyTiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyTiers.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = action.payload;
      })
      .addCase(fetchLoyaltyTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

type RootState = { loyalty: LoyaltyState };

export const selectLoyaltyTiers = (state: RootState) => state.loyalty.tiers;
export const selectSelectedTierData = (state: RootState) => state.loyalty.selectedTierData;

export const { setSelectedTierData, clearSelectedTierData } = loyaltySlice.actions;
export default loyaltySlice.reducer;
