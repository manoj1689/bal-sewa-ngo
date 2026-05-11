import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { Donation, EntityState, CreateDonationRequest } from '@/types';

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
        params: { page, page_size: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch donations');
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
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch donation');
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
      return rejectWithValue(error.response?.data?.detail || 'Failed to create donation');
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
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete donation');
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
        state.items = action.payload.items || action.payload;
        if (action.payload.total) {
          state.pagination.total = action.payload.total;
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
        state.selectedItem = action.payload;
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
        state.items.push(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
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
