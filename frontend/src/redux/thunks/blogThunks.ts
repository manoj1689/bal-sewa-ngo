import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';
import { Blog } from '@/types';

interface FetchBlogsParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (
    params: FetchBlogsParams | undefined,
    { rejectWithValue }
  ) => {
    const queryParams: FetchBlogsParams = {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_BLOG_LIMIT,
      ...params,
    };
    try {
      const response = await api.get(API_ENDPOINTS.BLOGS, { params: queryParams });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blogs.'
      );
    }
  }
);

export const fetchBlogDetail = createAsyncThunk(
  'blog/fetchBlogDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Blog>(API_ENDPOINTS.BLOGS_DETAIL(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blog details.'
      );
    }
  }
);

export const searchBlogs = createAsyncThunk(
  'blog/searchBlogs',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.BLOGS_SEARCH, {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed.'
      );
    }
  }
);
