import { createSlice } from '@reduxjs/toolkit';
import { CampaignState } from '@/types';
import { fetchCampaigns, fetchCampaignDetail, searchCampaigns } from '../thunks/campaignThunks';

const initialState: CampaignState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Campaign Detail
    builder
      .addCase(fetchCampaignDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Campaigns
    builder
      .addCase(searchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data || action.payload;
      })
      .addCase(searchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = campaignSlice.actions;
export default campaignSlice.reducer;
