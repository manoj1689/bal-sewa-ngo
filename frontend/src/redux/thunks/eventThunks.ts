import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';
import { Event } from '@/types';

interface FetchEventsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (
    params: FetchEventsParams | undefined,
    { rejectWithValue }
  ) => {
    const queryParams: FetchEventsParams = {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      ...params,
    };
    try {
      const response = await api.get(API_ENDPOINTS.EVENTS, { params: queryParams });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events.'
      );
    }
  }
);

export const fetchEventDetail = createAsyncThunk(
  'event/fetchEventDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.EVENTS_DETAIL(id));
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch event details.'
      );
    }
  }
);

export const applyForEventThunk = createAsyncThunk(
  'event/applyForEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.EVENT_APPLY(eventId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply for event.'
      );
    }
  }
);
