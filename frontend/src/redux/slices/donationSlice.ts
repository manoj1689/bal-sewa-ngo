import { createSlice } from '@reduxjs/toolkit';
import { DonationState } from '@/types';
import { createDonation, fetchUserDonations, fetchCampaignDonations } from '../thunks/donationThunks';

const initialState: DonationState = {
  donations: [],
  loading: false,
  error: null,
  successMessage: null,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Donation
    builder
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.push(action.payload);
        state.successMessage = 'Donation successful!';
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User Donations
    builder
      .addCase(fetchUserDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchUserDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Campaign Donations
    builder
      .addCase(fetchCampaignDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchCampaignDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess } = donationSlice.actions;
export default donationSlice.reducer;
