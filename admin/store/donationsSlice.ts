import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { Donation, EntityState, CreateDonationRequest, UpdateDonationRequest } from '@/types';

const initialState: EntityState<Donation> = {
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

export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/donations', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch donations'
      );
    }
  }
);

export const fetchDonationById = createAsyncThunk(
  'donations/fetchDonationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/donations/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch donation'
      );
    }
  }
);

export const createDonation = createAsyncThunk(
  'donations/createDonation',
  async (data: CreateDonationRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/donations', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create donation'
      );
    }
  }
);

export const updateDonation = createAsyncThunk(
  'donations/updateDonation',
  async ({ id, data }: { id: string; data: UpdateDonationRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/donations/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update donation'
      );
    }
  }
);

export const deleteDonation = createAsyncThunk(
  'donations/deleteDonation',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/donations/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete donation'
      );
    }
  }
);

const donationsSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    clearDonationError: (state) => {
      state.error = null;
    },
    selectDonation: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDonationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDonationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload.data;
      })
      .addCase(fetchDonationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDonation.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDonation = action.payload.data;
        if (!updatedDonation) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedDonation.id);
        if (index !== -1) {
          state.items[index] = updatedDonation;
        }
        if (state.selectedItem?.id === updatedDonation.id) {
          state.selectedItem = updatedDonation;
        }
      })
      .addCase(updateDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDonationError, selectDonation } = donationsSlice.actions;
export default donationsSlice.reducer;
