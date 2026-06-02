import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import apiClient from '@/lib/api-client';
import {
  CreateGalleryBucketRequest,
  CreateGalleryImageRequest,
  GalleryBucket,
  GalleryImage,
  UpdateGalleryBucketRequest,
  UpdateGalleryImageRequest,
} from '@/types';

type ApiErrorResponse = {
  detail?: string;
  message?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as AxiosError<ApiErrorResponse>;
  return apiError.response?.data?.detail || apiError.response?.data?.message || fallback;
}

type GalleryState = {
  items: GalleryImage[];
  buckets: GalleryBucket[];
  selectedItem: GalleryImage | null;
  loading: boolean;
  bucketsLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

const initialState: GalleryState = {
  items: [],
  buckets: [],
  selectedItem: null,
  loading: false,
  bucketsLoading: false,
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
    { page = 1, pageSize = 100 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/gallery/admin', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch gallery images'));
    }
  }
);

export const fetchGalleryBuckets = createAsyncThunk(
  'gallery/fetchGalleryBuckets',
  async (
    { page = 1, pageSize = 100 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/gallery/buckets', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch gallery buckets'));
    }
  }
);

export const createGalleryBucket = createAsyncThunk(
  'gallery/createGalleryBucket',
  async (data: CreateGalleryBucketRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/gallery/buckets', data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create gallery bucket'));
    }
  }
);

export const updateGalleryBucket = createAsyncThunk(
  'gallery/updateGalleryBucket',
  async ({ id, data }: { id: string; data: UpdateGalleryBucketRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/gallery/buckets/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update gallery bucket'));
    }
  }
);

export const deleteGalleryBucket = createAsyncThunk(
  'gallery/deleteGalleryBucket',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/gallery/buckets/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete gallery bucket'));
    }
  }
);

export const fetchGalleryBucketMedia = createAsyncThunk(
  'gallery/fetchGalleryBucketMedia',
  async (
    { bucketId, page = 1, pageSize = 100 }: { bucketId: string; page?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/gallery/buckets/${bucketId}/media`, {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch gallery bucket media'));
    }
  }
);

export const createGalleryImage = createAsyncThunk(
  'gallery/createGalleryImage',
  async (data: CreateGalleryImageRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/gallery', data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create gallery image'));
    }
  }
);

export const deleteGalleryImage = createAsyncThunk(
  'gallery/deleteGalleryImage',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/gallery/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete gallery image'));
    }
  }
);

export const updateGalleryImage = createAsyncThunk(
  'gallery/updateGalleryImage',
  async ({ id, data }: { id: string; data: UpdateGalleryImageRequest }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/gallery/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update gallery media'));
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
      .addCase(fetchGalleryBuckets.pending, (state) => {
        state.bucketsLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleryBuckets.fulfilled, (state, action) => {
        state.bucketsLoading = false;
        state.buckets = action.payload.data || [];
      })
      .addCase(fetchGalleryBuckets.rejected, (state, action) => {
        state.bucketsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGalleryBucketMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryBucketMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchGalleryBucketMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGalleryBucket.pending, (state) => {
        state.bucketsLoading = true;
        state.error = null;
      })
      .addCase(createGalleryBucket.fulfilled, (state, action) => {
        state.bucketsLoading = false;
        if (action.payload.data) {
          state.buckets.unshift(action.payload.data);
        }
      })
      .addCase(createGalleryBucket.rejected, (state, action) => {
        state.bucketsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGalleryBucket.pending, (state) => {
        state.bucketsLoading = true;
        state.error = null;
      })
      .addCase(updateGalleryBucket.fulfilled, (state, action) => {
        state.bucketsLoading = false;
        if (action.payload.data) {
          state.buckets = state.buckets.map((bucket) =>
            bucket.id === action.payload.data.id ? action.payload.data : bucket
          );
        }
      })
      .addCase(updateGalleryBucket.rejected, (state, action) => {
        state.bucketsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGalleryBucket.pending, (state) => {
        state.bucketsLoading = true;
        state.error = null;
      })
      .addCase(deleteGalleryBucket.fulfilled, (state, action) => {
        state.bucketsLoading = false;
        state.buckets = state.buckets.filter((bucket) => bucket.id !== action.payload);
      })
      .addCase(deleteGalleryBucket.rejected, (state, action) => {
        state.bucketsLoading = false;
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
      .addCase(updateGalleryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalleryImage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items = state.items.map((item) =>
            item.id === action.payload.data.id ? action.payload.data : item
          );
        }
      })
      .addCase(updateGalleryImage.rejected, (state, action) => {
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
