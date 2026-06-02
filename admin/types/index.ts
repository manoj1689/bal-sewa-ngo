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
  donor_phone?: string;
  amount: number;
  currency: string;
  message?: string;
  transaction_id?: string;
  payment_method?: string;
  receipt_url?: string;
  campaign_id?: string;
  user_id?: string;
  donation_date: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDonationRequest {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency: string;
  message?: string;
  transaction_id?: string;
  payment_method?: string;
  campaign_id?: string;
}

export interface UpdateDonationRequest {
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  receipt_url?: string;
  message?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  start_date: string;
  end_date?: string;
  image_url?: string;
  extra_images: string[];
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  goal_amount: number;
  start_date: string;
  end_date?: string;
  image_url?: string;
  extra_images?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  goal_amount?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  end_date?: string;
  image_url?: string;
  extra_images?: string[];
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
}

// Volunteer Types
export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  date_of_birth?: string;
  skills?: string;
  availability?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  motivation?: string;
  experience?: string;
  is_verified: boolean;
  verify_date?: string;
  user_id?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVolunteerRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  date_of_birth?: string;
  skills?: string;
  availability?: string;
  motivation?: string;
  experience?: string;
}

export interface UpdateVolunteerRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  skills?: string;
  availability?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  extra_images: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  author_id: string;
  published_at?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBlogRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  extra_images?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  extra_images?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  image_url?: string;
  extra_images: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  max_attendees?: number;
  attendees_count: number;
  organizer_id: string;
  seo_title?: string;
  seo_description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  image_url?: string;
  extra_images?: string[];
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  max_attendees?: number;
  seo_title?: string;
  seo_description?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  event_date?: string;
  end_date?: string;
  location?: string;
  image_url?: string;
  extra_images?: string[];
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  max_attendees?: number;
  seo_title?: string;
  seo_description?: string;
}

// Gallery Types
export interface GalleryBucket {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  order: number;
  uploader_id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGalleryBucketRequest {
  title: string;
  description?: string;
  thumbnail_url?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  order?: number;
}

export interface UpdateGalleryBucketRequest {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  order?: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  media_type?: 'IMAGE' | 'VIDEO';
  category?: string;
  thumbnail_url?: string;
  description?: string;
  alt_text?: string;
  order: number;
  status?: 'DRAFT' | 'PUBLISHED';
  bucket_id?: string;
  uploader_id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGalleryImageRequest {
  title: string;
  image_url: string;
  media_type?: 'IMAGE' | 'VIDEO';
  category?: string;
  thumbnail_url?: string;
  description?: string;
  alt_text?: string;
  order?: number;
  status?: 'DRAFT' | 'PUBLISHED';
  bucket_id?: string;
}

export interface UpdateGalleryImageRequest {
  title?: string;
  image_url?: string;
  media_type?: 'IMAGE' | 'VIDEO';
  category?: string;
  thumbnail_url?: string;
  description?: string;
  alt_text?: string;
  order?: number;
  status?: 'DRAFT' | 'PUBLISHED';
  bucket_id?: string;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_category?: string;
  uploader_id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_category?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  document_category?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  author_name: string;
  author_role?: string;
  content: string;
  rating?: number;
  image_url?: string;
  extra_images: string[];
  is_approved: boolean;
  approve_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialRequest {
  author_name: string;
  author_role?: string;
  content: string;
  rating?: number;
  image_url?: string;
  extra_images?: string[];
}

export interface UpdateTestimonialRequest {
  author_name?: string;
  author_role?: string;
  content?: string;
  rating?: number;
  image_url?: string;
  extra_images?: string[];
  is_approved?: boolean;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  read_date?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactMessageRequest {
  is_read?: boolean;
  response?: string;
}

export interface UploadedAsset {
  file_name: string;
  original_name: string;
  file_url: string;
  file_size: number;
  content_type: string;
  extension: string;
  category: string;
  storage: string;
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
