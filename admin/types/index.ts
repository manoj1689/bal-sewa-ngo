// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    tokens: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    };
  };
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  role?: string;
  phone?: string;
  last_login?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER';
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  phone?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER';
  is_active?: boolean;
}

// Donation Types
export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  message?: string;
  transaction_id: string;
  payment_method: string;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
  updated_at?: string;
}

export interface CreateDonationRequest {
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  message?: string;
  transaction_id: string;
  payment_method: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  status: "active" | "completed" | "paused" | "cancelled";
  start_date: string;
  end_date?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  goal_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  image_url?: string;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  goal_amount?: number;
  status?: "active" | "completed" | "paused" | "cancelled";
  end_date?: string;
  image_url?: string;
}

// Volunteer Types
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at?: string;
}

export interface CreateVolunteerRequest {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
}

export interface UpdateVolunteerRequest {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string;
  availability?: string;
  status?: "active" | "inactive" | "pending";
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  author?: string;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  author?: string;
  published?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  author?: string;
  published?: boolean;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location?: string;
  image_url?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  updated_at?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location?: string;
  image_url?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  image_url?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

// Gallery Types
export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateGalleryImageRequest {
  title: string;
  image_url: string;
  description?: string;
}

export interface UpdateGalleryImageRequest {
  title?: string;
  image_url?: string;
  description?: string;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  file_url: string;
  document_type: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateDocumentRequest {
  title: string;
  file_url: string;
  document_type: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  file_url?: string;
  document_type?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  author_name: string;
  content: string;
  rating?: number;
  image_url?: string;
  approved: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateTestimonialRequest {
  author_name: string;
  content: string;
  rating?: number;
  image_url?: string;
  approved?: boolean;
}

export interface UpdateTestimonialRequest {
  author_name?: string;
  content?: string;
  rating?: number;
  image_url?: string;
  approved?: boolean;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
  created_at: string;
  updated_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Entity Management State Types
export interface EntityState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
