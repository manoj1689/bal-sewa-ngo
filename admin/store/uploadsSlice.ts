import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import type { UploadedAsset } from '@/types';

type UploadPayload = {
  file: File;
};

type UploadState = {
  loading: boolean;
  error: string | null;
  lastUploaded: UploadedAsset | null;
};

const initialState: UploadState = {
  loading: false,
  error: null,
  lastUploaded: null,
};

async function uploadAsset(
  endpoint: string,
  { file }: UploadPayload,
  rejectWithValue: (value: string) => unknown
) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || error.response?.data?.message || 'Failed to upload file'
    );
  }
}

export const uploadImage = createAsyncThunk(
  'uploads/uploadImage',
  async (payload: UploadPayload, { rejectWithValue }) =>
    uploadAsset('/uploads/image', payload, rejectWithValue)
);

export const uploadVideo = createAsyncThunk(
  'uploads/uploadVideo',
  async (payload: UploadPayload, { rejectWithValue }) =>
    uploadAsset('/uploads/video', payload, rejectWithValue)
);

export const uploadDocumentFile = createAsyncThunk(
  'uploads/uploadDocumentFile',
  async (payload: UploadPayload, { rejectWithValue }) =>
    uploadAsset('/uploads/document', payload, rejectWithValue)
);

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.error = null;
    },
    clearLastUploaded: (state) => {
      state.lastUploaded = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUploaded = action.payload.data || null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUploaded = action.payload.data || null;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadDocumentFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumentFile.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUploaded = action.payload.data || null;
      })
      .addCase(uploadDocumentFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadError, clearLastUploaded } = uploadsSlice.actions;
export default uploadsSlice.reducer;
