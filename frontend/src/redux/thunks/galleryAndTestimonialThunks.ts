import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { GalleryImage, Testimonial } from '@/types';

// Gallery Thunks
export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetchGalleryImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.GALLERY, {
        params: { limit: 100 },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gallery images.'
      );
    }
  }
);

export const fetchGalleryByCategory = createAsyncThunk(
  'gallery/fetchGalleryByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.GALLERY_CATEGORY(category), {
        params: { limit: 100 },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gallery images.'
      );
    }
  }
);

// Testimonial Thunks
export const fetchTestimonials = createAsyncThunk(
  'testimonial/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.TESTIMONIALS);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch testimonials.'
      );
    }
  }
);
