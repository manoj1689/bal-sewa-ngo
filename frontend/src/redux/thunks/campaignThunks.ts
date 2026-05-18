import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';
import { Campaign } from '@/types';

interface FetchCampaignsParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}

export const fetchCampaigns = createAsyncThunk(
  'campaign/fetchCampaigns',
  async (
    params: FetchCampaignsParams | undefined,
    { rejectWithValue }
  ) => {
    const queryParams: FetchCampaignsParams = {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      ...params,
    };
    try {
      const response = await api.get(API_ENDPOINTS.CAMPAIGNS, { params: queryParams });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch campaigns.'
      );
    }
  }
);

export const fetchCampaignDetail = createAsyncThunk(
  'campaign/fetchCampaignDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Campaign>(API_ENDPOINTS.CAMPAIGNS_DETAIL(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch campaign details.'
      );
    }
  }
);

export const searchCampaigns = createAsyncThunk(
  'campaign/searchCampaigns',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.CAMPAIGNS_SEARCH, {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed.'
      );
    }
  }
);
