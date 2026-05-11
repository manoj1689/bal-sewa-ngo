"""
FastAPI application entry point.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.prisma_client import connect_db, disconnect_db
from app.exceptions_handler import register_exception_handlers
from app.middleware.logging import LoggingMiddleware

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle FastAPI lifespan events."""
    # Startup
    logger.info(f"Starting {settings.API_TITLE} v{settings.API_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    await connect_db()
    yield
    # Shutdown
    logger.info("Shutting down application")
    await disconnect_db()


# Create FastAPI instance
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="FastAPI backend for Bal Sewa Ashram Sansthan NGO management system",
    lifespan=lifespan,
)

# Register exception handlers
register_exception_handlers(app)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Import and include routes
from app.routes.api import router as api_router

app.include_router(api_router)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for load balancers."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.API_VERSION,
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {settings.API_TITLE}",
        "version": settings.API_VERSION,
        "docs_url": "/docs",
        "openapi_url": "/openapi.json",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
