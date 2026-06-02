// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_PROFILE: '/auth/profile',
  AUTH_LOGOUT: '/auth/logout',

  // Campaigns
  CAMPAIGNS: '/campaigns',
  CAMPAIGNS_DETAIL: (id: string) => `/campaigns/${id}`,
  CAMPAIGNS_SEARCH: '/campaigns/search',

  // Donations
  DONATIONS: '/donations',
  DONATIONS_USER: '/donations/user',
  DONATIONS_CAMPAIGN: (id: string) => `/donations/campaign/${id}`,

  // Volunteers
  VOLUNTEERS: '/volunteers',
  VOLUNTEERS_ME: '/volunteers/me',
  VOLUNTEERS_APPLICATIONS: '/volunteers/applications',
  VOLUNTEER_APPLY: '/volunteers/apply',

  // Blogs
  BLOGS: '/blogs',
  BLOGS_DETAIL: (id: string) => `/blogs/${id}`,
  BLOGS_SEARCH: '/blogs/search',

  // Events
  EVENTS: '/events',
  EVENTS_DETAIL: (id: string) => `/events/${id}`,
  EVENT_APPLY: (id: string) => `/events/${id}/apply`,

  // Gallery
  GALLERY: '/gallery',
  GALLERY_CATEGORY: (category: string) => `/gallery/category/${category}`,

  // Testimonials
  TESTIMONIALS: '/testimonials',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  DEFAULT_BLOG_LIMIT: 10,
};

// Campaign Categories
export const CAMPAIGN_CATEGORIES = [
  'Education',
  'Healthcare',
  'Food & Nutrition',
  'Emergency Relief',
  'Infrastructure',
  'Other',
];

// Event Statuses
export const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed'];

// Donation Methods
export const DONATION_METHODS = ['credit_card', 'debit_card', 'upi', 'bank_transfer', 'wallet'];
