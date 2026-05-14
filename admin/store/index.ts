import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import donationsReducer from './donationsSlice';
import campaignsReducer from './campaignsSlice';
import volunteersReducer from './volunteersSlice';
import blogsReducer from './blogsSlice';
import eventsReducer from './eventsSlice';
import galleryReducer from './gallerySlice';
import documentsReducer from './documentsSlice';
import testimonialsReducer from './testimonialsSlice';
import contactReducer from './contactSlice';
import uploadsReducer from './uploadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    donations: donationsReducer,
    campaigns: campaignsReducer,
    volunteers: volunteersReducer,
    blogs: blogsReducer,
    events: eventsReducer,
    gallery: galleryReducer,
    documents: documentsReducer,
    testimonials: testimonialsReducer,
    contact: contactReducer,
    uploads: uploadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
