// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_picture?: string;
  role: 'donor' | 'volunteer' | 'admin' | 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER';
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface ProfileUpdatePayload {
  name: string;
  email: string;
  phone?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category?: string;
  image_url?: string;
  extra_images?: string[];
  target_amount?: number;
  current_amount?: number;
  goal_amount?: number;
  raised_amount?: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'inactive' | 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Donation Types
export interface Donation {
  id: string;
  user_id: string;
  campaign_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DonationPayload {
  campaign_id: string;
  amount: number;
  payment_method: string;
}

// Volunteer Types
export interface Volunteer {
  id: string;
  user_id: string;
  skills?: string[];
  availability?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplication {
  id: string;
  user_id: string;
  event_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplicationPayload {
  event_id: string;
  skills?: string[];
  availability?: string;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author?: string;
  author_id?: string;
  featured_image?: string;
  extra_images?: string[];
  category: string;
  tags?: string[];
  status?: string;
  views_count?: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  end_date?: string;
  end_time?: string;
  image_url?: string;
  extra_images?: string[];
  max_attendees?: number | null;
  attendees_count?: number;
  volunteers_needed?: number;
  volunteers_registered?: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizer_id?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Gallery Types
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
  uploader_id?: string;
  createdAt: string;
  updatedAt?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  message: string;
  image_url?: string;
  role?: string;
  rating?: number;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
}

export interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface DonationState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface VolunteerState {
  volunteer: Volunteer | null;
  applications: VolunteerApplication[];
  loading: boolean;
  error: string | null;
}

export interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
}

export interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
}

export interface GalleryState {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
}

export interface TestimonialState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

export interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modal: {
    isOpen: boolean;
    type: string | null;
    data?: any;
  };
  notification: {
    isOpen: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  };
}
