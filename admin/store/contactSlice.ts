import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { ContactMessage, EntityState, UpdateContactMessageRequest } from '@/types';

const initialState: EntityState<ContactMessage> = {
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

export const fetchContactMessages = createAsyncThunk(
  'contact/fetchContactMessages',
  async (
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/contact', {
        params: { page, limit: pageSize },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to fetch contact messages'
      );
    }
  }
);

export const updateContactMessage = createAsyncThunk(
  'contact/updateContactMessage',
  async ({ id, data }: { id: string; data: UpdateContactMessageRequest }, { rejectWithValue }) => {
    try {
      const response = data.response
        ? await apiClient.post(`/contact/${id}/reply`, { response: data.response })
        : await apiClient.patch(`/contact/${id}/read`, { is_read: data.is_read });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to update contact message'
      );
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.pageSize = action.payload.pagination.limit;
        }
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMessage = action.payload.data;
        if (!updatedMessage) {
          return;
        }
        const index = state.items.findIndex((item) => item.id === updatedMessage.id);
        if (index !== -1) {
          state.items[index] = updatedMessage;
        }
        if (state.selectedItem?.id === updatedMessage.id) {
          state.selectedItem = updatedMessage;
        }
      })
      .addCase(updateContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
