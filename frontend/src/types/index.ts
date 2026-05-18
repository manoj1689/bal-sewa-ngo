// Auth Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_picture?: string;
  role: 'donor' | 'volunteer' | 'admin';
  created_at: string;
  updated_at: string;
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

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'inactive';
  created_at: string;
  updated_at: string;
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
  content: string;
  author: string;
  featured_image?: string;
  category: string;
  tags?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  end_time?: string;
  image_url?: string;
  volunteers_needed: number;
  volunteers_registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

// Gallery Types
export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  uploaded_at: string;
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
