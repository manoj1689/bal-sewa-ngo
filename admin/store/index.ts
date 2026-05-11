import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import donationsReducer from './donationsSlice';
import campaignsReducer from './campaignsSlice';
import volunteersReducer from './volunteersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    donations: donationsReducer,
    campaigns: campaignsReducer,
    volunteers: volunteersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
