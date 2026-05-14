import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { Volunteer, EntityState, CreateVolunteerRequest, UpdateVolunteerRequest } from '@/types';

const initialState: EntityState<Volunteer> = {
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

export const fetchVolunteers = createAsyncThunk(
  'volunteers/fetchVolunteers',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/volunteers', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch volunteers'
      );
    }
  }
);

export const createVolunteer = createAsyncThunk(
  'volunteers/createVolunteer',
  async (data: CreateVolunteerRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/volunteers', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create volunteer'
      );
    }
  }
);

export const updateVolunteer = createAsyncThunk(
  'volunteers/updateVolunteer',
  async ({ id, data }: { id: string; data: UpdateVolunteerRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/volunteers/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to update volunteer'
      );
    }
  }
);

export const deleteVolunteer = createAsyncThunk(
  'volunteers/deleteVolunteer',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/volunteers/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete volunteer'
      );
    }
  }
);

const volunteersSlice = createSlice({
  name: 'volunteers',
  initialState,
  reducers: {
    clearVolunteerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVolunteer = action.payload.data;
        if (!updatedVolunteer) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedVolunteer.id);
        if (index !== -1) {
          state.items[index] = updatedVolunteer;
        }
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVolunteerError } = volunteersSlice.actions;
export default volunteersSlice.reducer;
