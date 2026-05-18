import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { User, LoginPayload, RegisterPayload, AuthResponse } from '@/types';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
      const { access_token, user } = response.data;

      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token: access_token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, data);
      const { access_token, user } = response.data;

      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token: access_token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.AUTH_ME);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data.'
      );
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
