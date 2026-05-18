import { createSlice } from '@reduxjs/toolkit';
import { VolunteerState } from '@/types';
import {
  fetchMyVolunteerProfile,
  fetchMyApplications,
  applyForEvent,
  fetchAllVolunteers,
} from '../thunks/volunteerThunks';

const initialState: VolunteerState = {
  volunteer: null,
  applications: [],
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch My Volunteer Profile
    builder
      .addCase(fetchMyVolunteerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVolunteerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteer = action.payload;
      })
      .addCase(fetchMyVolunteerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch My Applications
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Apply For Event
    builder
      .addCase(applyForEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(applyForEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch All Volunteers
    builder
      .addCase(fetchAllVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = volunteerSlice.actions;
export default volunteerSlice.reducer;
