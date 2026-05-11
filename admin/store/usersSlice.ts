import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { User, EntityState, CreateUserRequest, UpdateUserRequest } from '@/types';

const initialState: EntityState<User> = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/users', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    selectUser: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.push(action.payload.data);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        if (!updatedUser) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedUser.id);
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
        if (state.selectedItem?.id === updatedUser.id) {
          state.selectedItem = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, selectUser } = usersSlice.actions;
export default usersSlice.reducer;
