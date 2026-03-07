import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthMapper, SerializableUser } from '../../application/mappers/AuthMapper';
import { GetProfileUseCase } from '../../application/usecases/GetProfileUseCase';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/RegisterUseCase';
import { AppError } from '../../core/errors/AppErrors';
import { PendingAuthAction } from '../../domain/services/AuthActionService';
import { authRepository } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { TokenStorage } from '../../infrastructure/storage/tokenStorage';

const registerUseCase = new RegisterUseCase(authRepository);
const loginUseCase = new LoginUseCase(authRepository);
const getProfileUseCase = new GetProfileUseCase();

export const fetchProfile = createAsyncThunk<SerializableUser, string, { rejectValue: string }>(
  'auth/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await getProfileUseCase.execute(userId);
      return AuthMapper.toSerializable(user);
    } catch (error) {
      if (error instanceof AppError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tải thông tin người dùng');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SerializableUser | null;
  phoneNumber: string | null;
  error: string | null;
  pendingAction: PendingAuthAction | null;
  otpSent: boolean;
  otpPhone: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  phoneNumber: null,
  error: null,
  pendingAction: null,
  otpSent: false,
  otpPhone: null,
};

export const registerUser = createAsyncThunk<{ phone: string }, { phone: string }, { rejectValue: string }>('auth/register', async ({ phone }, { rejectWithValue }) => {
  try {
    await registerUseCase.execute(phone);
    return { phone };

  } catch (error) {
    if (error instanceof AppError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Đã có lỗi xảy ra khi gửi OTP');
  }
});

export const loginWithOtp = createAsyncThunk<{ user: SerializableUser; phone: string }, { phone: string; otp: string }, { rejectValue: string }>('auth/login', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const result = await loginUseCase.execute(phone, otp);
    const serializableUser = AuthMapper.toSerializable(result.user);
    return { user: serializableUser, phone };

  } catch (error) {
    if (error instanceof AppError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Đã có lỗi xảy ra khi đăng nhập');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await TokenStorage.clearTokens();
  } catch {
    return rejectWithValue('Đã có lỗi xảy ra khi đăng xuất');
  }
}
);

export const checkAuthStatus = createAsyncThunk<{ isAuthenticated: boolean; userId: string | null }, void, { rejectValue: string }>('auth/checkStatus', async (_, { rejectWithValue }) => {
  try {
    const { accessToken, userId } = await TokenStorage.getTokens();
    return {
      isAuthenticated: !!accessToken,
      userId,
    };
  } catch {
    return rejectWithValue('Không thể kiểm tra trạng thái đăng nhập');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    resetOtpFlow: (state) => {
      state.otpSent = false;
      state.otpPhone = null;
      state.error = null;
    },

    setPendingAction: (state, action: PayloadAction<PendingAuthAction>) => {
      state.pendingAction = action.payload;
    },

    clearPendingAction: (state) => {
      state.pendingAction = null;
    },


  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.otpPhone = action.payload.phone;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Đã có lỗi xảy ra';
      });

    builder
      .addCase(loginWithOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.phoneNumber = action.payload.phone;
        state.otpSent = false;
        state.otpPhone = null;
        state.error = null;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Đã có lỗi xảy ra';
      });

    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Không thể tải thông tin người dùng';
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, () => {
        return { ...initialState };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Đăng xuất thất bại';
      });

    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearError,
  resetOtpFlow,
  setPendingAction,
  clearPendingAction,
} = authSlice.actions;

export const logout = logoutUser;

export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectPhoneNumber = (state: { auth: AuthState }) => state.auth.phoneNumber;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectPendingAction = (state: { auth: AuthState }) => state.auth.pendingAction;
export const selectOtpSent = (state: { auth: AuthState }) => state.auth.otpSent;
export const selectOtpPhone = (state: { auth: AuthState }) => state.auth.otpPhone;
