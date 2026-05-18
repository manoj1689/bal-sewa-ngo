import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import campaignReducer from './slices/campaignSlice';
import donationReducer from './slices/donationSlice';
import volunteerReducer from './slices/volunteerSlice';
import blogReducer from './slices/blogSlice';
import eventReducer from './slices/eventSlice';
import { galleryReducer, testimonialReducer } from './slices/galleryAndTestimonialSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    donation: donationReducer,
    volunteer: volunteerReducer,
    blog: blogReducer,
    event: eventReducer,
    gallery: galleryReducer,
    testimonial: testimonialReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
