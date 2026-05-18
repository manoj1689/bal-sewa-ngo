import { createSlice } from '@reduxjs/toolkit';
import { GalleryState, TestimonialState } from '@/types';
import {
  fetchGalleryImages,
  fetchGalleryByCategory,
  fetchTestimonials,
} from '../thunks/galleryAndTestimonialThunks';

const galleryInitialState: GalleryState = {
  images: [],
  loading: false,
  error: null,
};

const testimonialInitialState: TestimonialState = {
  testimonials: [],
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: galleryInitialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Gallery Images
    builder
      .addCase(fetchGalleryImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Gallery By Category
    builder
      .addCase(fetchGalleryByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchGalleryByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState: testimonialInitialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Testimonials
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const galleryActions = gallerySlice.actions;
export const testimonialActions = testimonialSlice.actions;
export const galleryReducer = gallerySlice.reducer;
export const testimonialReducer = testimonialSlice.reducer;
