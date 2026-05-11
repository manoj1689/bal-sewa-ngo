import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { setToken, removeToken, setUser, removeUser } from '@/lib/auth-storage';
import { AuthState, LoginRequest, LoginResponse } from '@/types';

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      const { access_token } = response.data.data.tokens;
      const user = response.data.data.user;
      setToken(access_token);
      setUser(user);
      return { token: access_token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
    removeUser();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { setAuthToken, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
