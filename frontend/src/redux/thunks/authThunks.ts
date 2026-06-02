import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { User, LoginPayload, RegisterPayload, ProfileUpdatePayload, AuthResponse } from '@/types';

type ApiAuthResponse = {
  data?: {
    user: User;
    tokens: {
      access_token: string;
    };
  };
};

function getAuthErrorMessage(error: any, fallback: string) {
  const responseData = error.response?.data;
  const firstValidationMessage = responseData?.details?.[0]?.message;
  return firstValidationMessage || responseData?.message || fallback;
}

function normalizeAuthResponse(responseData: AuthResponse | ApiAuthResponse) {
  if ('data' in responseData && responseData.data?.tokens) {
    return {
      accessToken: responseData.data.tokens.access_token,
      user: responseData.data.user,
    };
  }

  const legacyResponse = responseData as AuthResponse;
  return {
    accessToken: legacyResponse.access_token,
    user: legacyResponse.user,
  };
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse | ApiAuthResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
      const { accessToken, user } = normalizeAuthResponse(response.data);

      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token: accessToken, user };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error, 'Login failed. Please try again.'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const registerPayload = {
        email: data.email,
        password: data.password,
        name: `${data.first_name} ${data.last_name}`.trim(),
        phone: data.phone || undefined,
      };
      const response = await api.post<AuthResponse | ApiAuthResponse>(API_ENDPOINTS.AUTH_REGISTER, registerPayload);
      const { accessToken, user } = normalizeAuthResponse(response.data);

      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token: accessToken, user };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error, 'Registration failed. Please try again.'));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(API_ENDPOINTS.AUTH_ME);
      return (response.data.data || response.data) as User;
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error, 'Failed to fetch user data.'));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: ProfileUpdatePayload, { rejectWithValue }) => {
    try {
      const response = await api.put<any>(API_ENDPOINTS.AUTH_PROFILE, {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
      });
      const user = (response.data.data || response.data) as User;

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error, 'Failed to update profile.'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post(API_ENDPOINTS.AUTH_LOGOUT);
      
      // Remove token and user from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed.'
      );
    }
  }
);
