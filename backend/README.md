# Bal Sewa Ashram Sansthan NGO Backend API

A production-ready FastAPI backend for managing NGO operations including donations, campaigns, volunteers, blogs, events, and more.

## Features

- **User Management**: Role-based access control (SUPER_ADMIN, ADMIN, EDITOR, VOLUNTEER_MANAGER)
- **Donations**: Track and manage donations with status tracking
- **Campaigns**: Create and manage fundraising campaigns
- **Volunteers**: Register and manage volunteers
- **Blog CMS**: Create and publish blog posts with SEO metadata
- **Events**: Manage events and their details
- **Gallery**: Upload and manage images
- **Documents**: File management system
- **Testimonials**: Collect and manage testimonials
- **Contact Messages**: Capture contact form submissions
- **Dashboard Analytics**: Get insights on donations, campaigns, and volunteers

## Technology Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Async**: Python async/await with uvicorn
- **Containerization**: Docker & Docker Compose

## Project Structure

```
backend/
├── app/
│   ├── auth/              # Authentication & JWT
│   ├── config/            # Configuration settings
│   ├── core/              # Constants and enumerations
│   ├── database/          # Database connections
│   ├── middleware/        # CORS, logging, auth middleware
│   ├── repositories/      # Data access layer
│   ├── routes/            # API endpoints
│   ├── schemas/           # Pydantic models/schemas
│   ├── services/          # Business logic layer
│   ├── utils/             # Utility functions
│   └── main.py            # FastAPI application
├── prisma/
│   └── schema.prisma      # Database schema
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Multi-container setup
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Setup Instructions

### 1. Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Docker & Docker Compose (optional, for containerized setup)

### 2. Local Setup (Without Docker)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

```bash
# Generate Prisma client
python -m prisma generate

# Create and run migrations
python -m prisma migrate dev --name init

# (Optional) Seed database with sample data
python -m prisma db seed
```

### 4. Run the Application

```bash
# Start the FastAPI server
uvicorn app.main:app --reload

# The API will be available at: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
```

### 5. Docker Setup (Alternative)

```bash
# From the root project directory
cd backend

# Build and run containers
docker-compose up --build

# The API will be available at: http://localhost:8000
# PostgreSQL will be available at: localhost:5432

# Stop containers
docker-compose down
```

## Environment Variables

See `.env.example` for all required variables:

```
DATABASE_URL                    # PostgreSQL connection string
JWT_SECRET_KEY                  # Secret key for JWT signing
JWT_ALGORITHM                   # JWT algorithm (default: HS256)
ACCESS_TOKEN_EXPIRE_MINUTES     # Token expiration time
ENVIRONMENT                     # dev/staging/production
LOG_LEVEL                       # Logging level
CORS_ORIGINS                    # Comma-separated allowed origins
FILE_UPLOAD_DIR                 # Directory for file uploads
ADMIN_EMAIL                     # Default admin email
ADMIN_PASSWORD                  # Default admin password
```

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user (admin only)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get current user profile

### Users
- `GET /api/v1/users` - List all users (paginated)
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Donations
- `POST /api/v1/donations` - Create donation
- `GET /api/v1/donations` - List donations
- `GET /api/v1/donations/{id}` - Get donation by ID
- `GET /api/v1/donations/stats/summary` - Get donation statistics

### Campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign by ID
- `PUT /api/v1/campaigns/{id}` - Update campaign
- `DELETE /api/v1/campaigns/{id}` - Delete campaign

### Volunteers
- `POST /api/v1/volunteers` - Register volunteer
- `GET /api/v1/volunteers` - List volunteers
- `GET /api/v1/volunteers/{id}` - Get volunteer by ID
- `PUT /api/v1/volunteers/{id}` - Update volunteer status

### Blogs
- `POST /api/v1/blogs` - Create blog post
- `GET /api/v1/blogs` - List blog posts
- `GET /api/v1/blogs/{slug}` - Get blog by slug
- `PUT /api/v1/blogs/{id}` - Update blog post
- `DELETE /api/v1/blogs/{id}` - Delete blog post

### Events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events` - List events
- `GET /api/v1/events/{id}` - Get event by ID
- `PUT /api/v1/events/{id}` - Update event
- `DELETE /api/v1/events/{id}` - Delete event

### Gallery
- `POST /api/v1/gallery` - Upload image
- `GET /api/v1/gallery` - List gallery images
- `DELETE /api/v1/gallery/{id}` - Delete image

### Documents
- `POST /api/v1/documents` - Upload document
- `GET /api/v1/documents` - List documents
- `DELETE /api/v1/documents/{id}` - Delete document

### Testimonials
- `POST /api/v1/testimonials` - Create testimonial
- `GET /api/v1/testimonials` - List testimonials
- `DELETE /api/v1/testimonials/{id}` - Delete testimonial

### Contact Messages
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - List contact messages (admin only)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/recent-donations` - Get recent donations
- `GET /api/v1/dashboard/campaign-stats` - Get campaign statistics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: POST to `/api/v1/auth/login` with credentials to get access token
2. **Include Token**: Add `Authorization: Bearer <token>` header to protected requests
3. **Token Refresh**: Use `/api/v1/auth/refresh` to get new access token before expiration

## Database Schema

Database is defined in `prisma/schema.prisma` with the following entities:

- **User**: System users with role-based access
- **Donation**: Donation records with status tracking
- **Campaign**: Fundraising campaigns
- **Volunteer**: Volunteer registrations
- **Blog**: Blog posts with SEO metadata
- **Event**: Events and announcements
- **Gallery**: Images for gallery
- **Document**: Uploaded documents
- **Testimonial**: User testimonials
- **ContactMessage**: Contact form submissions

All entities include:
- `id`: UUID primary key
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run specific test
pytest tests/test_auth.py::test_login
```

## Development

### Code Style

```bash
# Format code with Black
black app/

# Lint with flake8
flake8 app/
```

### Database Migrations

```bash
# Create a new migration
python -m prisma migrate dev --name add_new_field

# View migration status
python -m prisma migrate status

# Reset database (⚠️ deletes all data)
python -m prisma migrate reset
```

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Use strong JWT_SECRET_KEY
- [ ] Configure DATABASE_URL with production database
- [ ] Set ENVIRONMENT=production
- [ ] Configure CORS_ORIGINS for frontend domain
- [ ] Use HTTPS for API endpoints
- [ ] Set up proper logging and monitoring
- [ ] Configure backup strategy for database
- [ ] Set up SSL certificates
- [ ] Use environment-specific .env file

### Docker Deployment

```bash
# Build Docker image
docker build -t ngo-api:latest .

# Run container
docker run -p 8000:8000 --env-file .env ngo-api:latest

# Or use Docker Compose
docker-compose up -d
```

### Vercel/Cloud Deployment

The application can be deployed to various cloud platforms:

1. **Vercel** (with Python support)
2. **Railway**
3. **Render**
4. **Heroku**
5. **AWS ECS/Fargate**

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000
# On macOS/Linux
lsof -ti:8000 | xargs kill -9
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U ngo_user -d ngo_db

# Check DATABASE_URL format
# postgresql://user:password@host:port/dbname
```

### Migration Issues

```bash
# Reset database (⚠️ WARNING: Deletes all data)
python -m prisma migrate reset --force

# View schema
python -m prisma db push
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is part of Bal Sewa Ashram Sansthan NGO.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
