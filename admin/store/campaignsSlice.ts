import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { Campaign, EntityState, CreateCampaignRequest, UpdateCampaignRequest } from '@/types';

const initialState: EntityState<Campaign> = {
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

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/campaigns', {
        params: { page, page_size: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch campaigns');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (data: CreateCampaignRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/campaigns', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create campaign');
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, data }: { id: string; data: UpdateCampaignRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/campaigns/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update campaign');
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/campaigns/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete campaign');
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearCampaignError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || action.payload;
        if (action.payload.total) {
          state.pagination.total = action.payload.total;
        }
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCampaignError } = campaignsSlice.actions;
export default campaignsSlice.reducer;
