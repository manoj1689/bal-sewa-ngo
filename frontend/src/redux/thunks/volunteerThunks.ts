import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Volunteer, VolunteerApplication, VolunteerApplicationPayload } from '@/types';

export const fetchMyVolunteerProfile = createAsyncThunk(
  'volunteer/fetchMyVolunteerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Volunteer>(API_ENDPOINTS.VOLUNTEERS_ME);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch volunteer profile.'
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'volunteer/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<VolunteerApplication[]>(
        API_ENDPOINTS.VOLUNTEERS_APPLICATIONS
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applications.'
      );
    }
  }
);

export const applyForEvent = createAsyncThunk(
  'volunteer/applyForEvent',
  async (payload: VolunteerApplicationPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<VolunteerApplication>(
        API_ENDPOINTS.VOLUNTEER_APPLY,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply for event.'
      );
    }
  }
);

export const fetchAllVolunteers = createAsyncThunk(
  'volunteer/fetchAllVolunteers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Volunteer[]>(API_ENDPOINTS.VOLUNTEERS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch volunteers.'
      );
    }
  }
);
