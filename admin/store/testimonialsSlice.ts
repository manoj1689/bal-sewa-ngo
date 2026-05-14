import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import {
  CreateTestimonialRequest,
  EntityState,
  Testimonial,
  UpdateTestimonialRequest,
} from '@/types';

const initialState: EntityState<Testimonial> = {
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

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/testimonials/all', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to fetch testimonials'
      );
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonials/createTestimonial',
  async (data: CreateTestimonialRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/testimonials', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to create testimonial'
      );
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonials/updateTestimonial',
  async ({ id, data }: { id: string; data: UpdateTestimonialRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/testimonials/${id}/approve`, {
        is_approved: data.is_approved,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to update testimonial'
      );
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/testimonials/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to delete testimonial'
      );
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearTestimonialError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTestimonial = action.payload.data;
        if (!updatedTestimonial) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedTestimonial.id);
        if (index !== -1) {
          state.items[index] = updatedTestimonial;
        }
        if (state.selectedItem?.id === updatedTestimonial.id) {
          state.selectedItem = updatedTestimonial;
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTestimonialError } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
