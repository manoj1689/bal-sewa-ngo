# Bal Sewa Ashram NGO Frontend

A comprehensive frontend application for Bal Sewa Ashram Sansthan (Child Welfare Organization) built with modern web technologies.

## Overview

This is a full-featured NGO website with:
- **Public Pages**: Home, Campaigns, Events, Blog, Gallery
- **User Authentication**: Login/Register with JWT
- **Donation System**: Support campaigns with multiple payment methods
- **Volunteer Management**: Apply for events and manage applications
- **Volunteer Dashboard**: Track donations, event applications, and profile
- **Light/Dark Theme**: Seamless theme switching with persistent storage
- **State Management**: Redux Toolkit with async thunks for all API calls
- **Responsive Design**: Mobile-first design for all screen sizes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit with async Thunks
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: Shadcn/ui
- **Theme**: next-themes for light/dark mode
- **HTTP Client**: Axios with interceptors
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx                # Root layout with Redux & Theme providers
│   ├── page.tsx                  # Home page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── campaigns/                # Campaigns listing & details
│   ├── events/                   # Events listing & details
│   ├── blogs/                    # Blog listing & details
│   ├── gallery/                  # Photo gallery
│   ├── dashboard/                # Protected volunteer dashboard
│   ├── globals.css               # Global styles with theme tokens
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── common/                   # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   └── features/                 # Feature-specific components
│       └── auth/
├── lib/
│   ├── api.ts                    # Axios instance with interceptors
│   ├── constants.ts              # API endpoints & constants
│   └── utils.ts                  # Utility functions
├── redux/
│   ├── store.ts                  # Redux store configuration
│   ├── slices/                   # Redux slices
│   │   ├── authSlice.ts
│   │   ├── campaignSlice.ts
│   │   ├── donationSlice.ts
│   │   ├── volunteerSlice.ts
│   │   ├── blogSlice.ts
│   │   ├── eventSlice.ts
│   │   ├── galleryAndTestimonialSlice.ts
│   │   └── uiSlice.ts
│   └── thunks/                   # Async thunks for API calls
│       ├── authThunks.ts
│       ├── campaignThunks.ts
│       ├── donationThunks.ts
│       ├── volunteerThunks.ts
│       ├── blogThunks.ts
│       ├── eventThunks.ts
│       └── galleryAndTestimonialThunks.ts
├── hooks/
│   └── useAppHooks.ts           # Custom React hooks
├── types/
│   └── index.ts                  # TypeScript interfaces & types
└── styles/
    └── (CSS files)
```

## Features

### 1. Public Pages
- **Home**: Hero section with impact statistics, feature cards, and CTAs
- **Campaigns**: Browse active campaigns with progress tracking
- **Campaign Details**: Donate to specific campaigns with multiple payment methods
- **Events**: View upcoming events and volunteer opportunities
- **Event Details**: Register to volunteer for events
- **Blog**: Read inspiring stories and updates
- **Gallery**: Browse photo gallery with lightbox

### 2. Authentication
- User registration with email, name, phone
- JWT-based login/logout
- Protected routes for authenticated users
- Automatic token refresh and error handling

### 3. Donation System
- View campaigns and their progress
- Donate with custom amounts or quick presets
- Multiple payment methods (Card, UPI, Bank Transfer, etc.)
- Track donation history in dashboard

### 4. Volunteer Management
- Apply for events as a volunteer
- Track volunteer applications (pending, approved, rejected)
- View volunteer profile and status
- See registered events in dashboard

### 5. Volunteer Dashboard
- View personal statistics (donations, events, status)
- Access donation history
- Track event applications
- User profile management

### 6. Theme System
- Light and dark modes
- Theme toggle in navbar
- Persistent theme preference
- Smooth transitions

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Replace with your backend API URL.

## Installation & Setup

### Prerequisites
- Node.js 18+ or higher
- pnpm (recommended) or npm/yarn

### Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoint
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```
   
   The app will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## Key Implementation Details

### Redux Store
- All API calls use Redux Thunks for async operations
- Centralized state management for campaigns, donations, events, volunteers, blogs, gallery, and testimonials
- User state persisted in localStorage
- Error handling and loading states

### API Integration
- Axios instance with request/response interceptors
- Automatic JWT token addition to headers
- 401 error handling with automatic logout and redirect to login
- Centralized error messages

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Token added to all API requests
4. Protected routes redirect to login if not authenticated
5. Auto-logout on token expiration

### Theme System
- Uses next-themes for seamless light/dark mode
- CSS custom properties (variables) for colors
- Persistent storage of theme preference
- Smooth transitions between themes

## API Integration

The app expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/{id}` - Get campaign details
- `GET /api/campaigns/search?q=...` - Search campaigns

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations/user` - Get user donations
- `GET /api/donations/campaign/{id}` - Get campaign donations

### Volunteers
- `GET /api/volunteers/me` - Get user volunteer profile
- `GET /api/volunteers/applications` - Get user applications
- `POST /api/volunteers/apply` - Apply for event
- `GET /api/volunteers` - Get all volunteers

### Blogs
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/{id}` - Get blog details
- `GET /api/blogs/search?q=...` - Search blogs

### Events
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event details
- `POST /api/events/{id}/apply` - Apply for event

### Gallery & Testimonials
- `GET /api/gallery` - Get all gallery images
- `GET /api/gallery/category/{category}` - Get images by category
- `GET /api/testimonials` - Get all testimonials

## Components

### Common Components
- **Navbar**: Navigation with theme toggle and auth links
- **Footer**: Footer with links and contact info
- **ThemeToggle**: Light/dark mode switcher

### Layout Components
- **DashboardLayout**: Sidebar layout for protected dashboard

### Feature Components
- **LoginForm**: User login form
- **RegisterForm**: User registration form
- **CampaignCard**: Campaign listing card
- **EventCard**: Event listing card

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built accessible components
- **Custom Themes**: Light and dark mode with custom color scheme
- **Responsive**: Mobile-first approach with breakpoints

### Color Scheme
- **Primary**: Warm earth tone (brown) #6B4423
- **Secondary**: Light warm tone (tan) #D4A574
- **Accent**: Darker brown #4A2F1F
- **Background**: Light cream for light mode, dark brown for dark mode
- **Foreground**: Dark brown for light mode, light cream for dark mode

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- Redux for state caching
- Lazy loading of components
- Responsive images

## Security Features

- JWT token-based authentication
- HttpOnly cookies support (if configured in backend)
- CSRF protection (from Next.js)
- Input validation on forms
- Secure API communication with Axios interceptors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Email verification for registration
- Password reset functionality
- Two-factor authentication
- Admin dashboard for managing content
- Real-time notifications
- Advanced search and filtering
- Testimonials slider
- Newsletter subscription
- Payment gateway integration
- Event calendar view
- Blog commenting system

## Troubleshooting

### Module not found errors
- Ensure tsconfig.json paths are correctly set
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`

### API connection issues
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running
- Check CORS configuration in backend

### Theme not persisting
- Check browser localStorage is enabled
- Verify next-themes provider in layout

### Build errors
- Clear cache: `pnpm install && rm -rf .next`
- Check for TypeScript errors: `pnpm type-check`

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is proprietary software for Bal Sewa Ashram Sansthan.

## Support

For issues and questions:
- Email: support@balsewa.org
- Phone: +91 98765 43210

---

Built with care for the children we serve. ❤️
