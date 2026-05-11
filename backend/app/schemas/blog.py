"""
Blog post schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field

from app.core.constants import BlogStatus


class BlogCreate(BaseModel):
    """Blog post creation schema."""

    title: str = Field(..., min_length=1, max_length=300)
    slug: Optional[str] = Field(None, description="Auto-generated if not provided")
    content: str = Field(..., min_length=1, description="Rich text/HTML content")
    excerpt: Optional[str] = Field(None, max_length=500)
    featured_image: Optional[str] = None
    status: Optional[BlogStatus] = Field(BlogStatus.DRAFT)
    seo_title: Optional[str] = Field(None, max_length=200)
    seo_description: Optional[str] = Field(None, max_length=500)
    seo_keywords: Optional[str] = Field(None, max_length=200)


class BlogUpdate(BaseModel):
    """Blog post update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=300)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[BlogStatus] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None


class BlogResponse(BaseModel):
    """Blog post response schema."""

    id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    status: str
    views_count: int
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    author_id: str
    published_at: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class BlogListResponse(BaseModel):
    """Blog list item response."""

    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    status: str
    views_count: int
    author_id: str
    published_at: Optional[datetime] = None
    createdAt: datetime

    class Config:
        from_attributes = True
