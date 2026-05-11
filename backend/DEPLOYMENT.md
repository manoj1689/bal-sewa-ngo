# FastAPI Backend Deployment Guide

This guide covers deploying the Bal Sewa Ashram Sansthan NGO FastAPI backend to various platforms.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Render Deployment](#render-deployment)
6. [Production Checklist](#production-checklist)

## Local Development

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Git

### Setup Steps

```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Initialize database
python -m prisma generate
python -m prisma migrate dev --name init

# Run server
uvicorn app.main:app --reload
```

Access API at: http://localhost:8000
Swagger Docs: http://localhost:8000/docs

## Docker Deployment

### Building the Docker Image

```bash
# Build image
docker build -t ngo-api:latest .

# Run container with PostgreSQL
docker-compose up -d

# Stop containers
docker-compose down
```

### Environment Variables for Docker

Set in `docker-compose.yml`:
- DATABASE_URL
- JWT_SECRET_KEY
- JWT_ALGORITHM
- ACCESS_TOKEN_EXPIRE_MINUTES
- CORS_ORIGINS

## Vercel Deployment

### Using Vercel Python Support

**Note:** Vercel has limited Python support. For production, consider Railway or Render.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy
```

**api/index.py** (if using Vercel serverless):

```python
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
import app.main

asgi_app = app.main.app
```

Set environment variables in Vercel dashboard:
- DATABASE_URL
- JWT_SECRET_KEY
- etc.

## Railway Deployment

### Deploy via Railway

Railway is recommended for Python FastAPI applications.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL database
# (via Railway dashboard)

# Deploy
railway up
```

### Configuration

Set environment variables in Railway dashboard:
- DATABASE_URL
- JWT_SECRET_KEY
- JWT_ALGORITHM
- ACCESS_TOKEN_EXPIRE_MINUTES
- CORS_ORIGINS

Create `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Render Deployment

### Deploy via Render

```bash
# Push to GitHub
git push origin main

# Connect repository to Render
# 1. Go to https://render.com
# 2. Create New > Web Service
# 3. Connect GitHub repository
# 4. Build command: pip install -r requirements.txt
# 5. Start command: uvicorn app.main:app --host 0.0.0.0 --port 10000
```

### Render Environment Variables

Set in Render dashboard:
- DATABASE_URL
- JWT_SECRET_KEY
- JWT_ALGORITHM
- ACCESS_TOKEN_EXPIRE_MINUTES
- CORS_ORIGINS
- ENVIRONMENT=production
- LOG_LEVEL=INFO

### Add PostgreSQL Database

1. In Render dashboard, create a new PostgreSQL database
2. Get DATABASE_URL from database settings
3. Add to Web Service environment variables

## AWS Deployment

### Using AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Python 3.11 running on 64bit Amazon Linux 2" ngo-api

# Create environment
eb create ngo-api-env

# Deploy
eb deploy
```

### Using ECS/Fargate

1. Push Docker image to ECR
2. Create ECS cluster
3. Create task definition
4. Create Fargate service

## Production Checklist

### Security

- [ ] Change JWT_SECRET_KEY to a strong random value
- [ ] Set ENVIRONMENT=production
- [ ] Use HTTPS/TLS certificates
- [ ] Enable CORS only for frontend domain
- [ ] Use environment variables, not hardcoded secrets
- [ ] Enable database SSL/TLS
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use prepared statements to prevent SQL injection
- [ ] Implement proper logging without exposing secrets

### Database

- [ ] Run migrations on production database
- [ ] Set up automated backups
- [ ] Enable database replication for high availability
- [ ] Configure connection pooling
- [ ] Monitor database performance
- [ ] Use read replicas for reporting queries

### Monitoring & Logging

- [ ] Set up error tracking (Sentry, DataDog, etc.)
- [ ] Configure application logging
- [ ] Set up performance monitoring (New Relic, Datadog)
- [ ] Monitor API response times
- [ ] Set up alerts for errors and anomalies
- [ ] Configure centralized logging (ELK, CloudWatch)

### API

- [ ] Update CORS_ORIGINS to production frontend URL
- [ ] Configure rate limiting
- [ ] Add API versioning
- [ ] Document API endpoints
- [ ] Set up API key authentication if needed
- [ ] Configure timeout values
- [ ] Test all endpoints

### Infrastructure

- [ ] Set up load balancing
- [ ] Configure auto-scaling
- [ ] Set up CDN for static assets
- [ ] Configure DNS/SSL certificates
- [ ] Set up firewall rules
- [ ] Enable DDoS protection
- [ ] Configure backup and disaster recovery

### Deployment

- [ ] Use CI/CD pipeline
- [ ] Automated testing on pull requests
- [ ] Automated deployment on merge
- [ ] Blue-green deployment strategy
- [ ] Health checks on every instance
- [ ] Gradual rollout with canary deployments
- [ ] Rollback plan ready

## Environment Variables Reference

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application
ENVIRONMENT=production
LOG_LEVEL=INFO
API_TITLE=Bal Sewa Ashram Sansthan NGO API
API_VERSION=1.0.0

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload
FILE_UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:password@host:5432/dbname

# Check DATABASE_URL format
# postgresql://username:password@host:port/database
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 <PID>
```

### Migration Issues

```bash
# Reset database (WARNING: Deletes all data)
python -m prisma migrate reset --force

# Check migration status
python -m prisma migrate status
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt

# Generate Prisma client
python -m prisma generate
```

## Monitoring Endpoints

### Health Check

```bash
curl http://your-api.com/health
```

Response:
```json
{
  "status": "healthy",
  "environment": "production",
  "version": "1.0.0"
}
```

### API Documentation

- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI Schema: `/openapi.json`

## Backup & Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump -h host -U user -d database > backup.sql

# Restore backup
psql -h host -U user -d database < backup.sql
```

### File Upload Backup

```bash
# Backup uploads directory
tar -czf uploads-backup.tar.gz uploads/

# Restore uploads
tar -xzf uploads-backup.tar.gz
```

## Performance Optimization

1. **Database Optimization**
   - Add indexes on frequently queried fields
   - Use connection pooling
   - Optimize slow queries

2. **Caching**
   - Implement Redis caching
   - Cache API responses
   - Cache database queries

3. **Load Balancing**
   - Use load balancer (Nginx, HAProxy)
   - Horizontal scaling
   - Round-robin distribution

4. **Compression**
   - Enable GZIP compression
   - Minify JSON responses
   - Optimize file uploads

## Support

For deployment issues or questions:
1. Check the main README.md
2. Review logs: `docker logs ngo_api`
3. Check database connection: `psql` command
4. Review environment variables
5. Create an issue in the repository

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
