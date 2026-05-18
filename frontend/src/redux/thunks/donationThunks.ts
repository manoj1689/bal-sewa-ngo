import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Donation, DonationPayload } from '@/types';

export const createDonation = createAsyncThunk(
  'donation/createDonation',
  async (payload: DonationPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<Donation>(API_ENDPOINTS.DONATIONS, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create donation.'
      );
    }
  }
);

export const fetchUserDonations = createAsyncThunk(
  'donation/fetchUserDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Donation[]>(API_ENDPOINTS.DONATIONS_USER);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch donations.'
      );
    }
  }
);

export const fetchCampaignDonations = createAsyncThunk(
  'donation/fetchCampaignDonations',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Donation[]>(
        API_ENDPOINTS.DONATIONS_CAMPAIGN(campaignId)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch campaign donations.'
      );
    }
  }
);
