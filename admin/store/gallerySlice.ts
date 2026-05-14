import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { CreateGalleryImageRequest, EntityState, GalleryImage } from '@/types';

const initialState: EntityState<GalleryImage> = {
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

export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetchGalleryImages',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/gallery', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch gallery images'
      );
    }
  }
);

export const createGalleryImage = createAsyncThunk(
  'gallery/createGalleryImage',
  async (data: CreateGalleryImageRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/gallery', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to create gallery image'
      );
    }
  }
);

export const deleteGalleryImage = createAsyncThunk(
  'gallery/deleteGalleryImage',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/gallery/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to delete gallery image'
      );
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearGalleryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGalleryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGalleryImage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(createGalleryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGalleryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGalleryError } = gallerySlice.actions;
export default gallerySlice.reducer;
