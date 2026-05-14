import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { CreateEventRequest, EntityState, Event, UpdateEventRequest } from '@/types';

const initialState: EntityState<Event> = {
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

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/events', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: CreateEventRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/events', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: string; data: UpdateEventRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/events/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/events/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete event'
      );
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEvent = action.payload.data;
        if (!updatedEvent) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedEvent.id);
        if (index !== -1) {
          state.items[index] = updatedEvent;
        }
        if (state.selectedItem?.id === updatedEvent.id) {
          state.selectedItem = updatedEvent;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEventError } = eventsSlice.actions;
export default eventsSlice.reducer;
