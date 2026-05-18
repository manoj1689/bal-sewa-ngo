import { createSlice } from '@reduxjs/toolkit';
import { EventState } from '@/types';
import { fetchEvents, fetchEventDetail, applyForEventThunk } from '../thunks/eventThunks';

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data || action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Event Detail
    builder
      .addCase(fetchEventDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Apply For Event
    builder
      .addCase(applyForEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForEventThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(applyForEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
