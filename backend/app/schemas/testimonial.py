"""
Testimonial schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class TestimonialCreate(BaseModel):
    """Testimonial creation schema."""

    author_name: str = Field(..., min_length=1, max_length=100)
    author_role: Optional[str] = Field(None, max_length=100)
    content: str = Field(..., min_length=1, max_length=1000)
    image_url: Optional[str] = None
    extra_images: list[str] = Field(default_factory=list)
    rating: Optional[int] = Field(None, ge=1, le=5)


class TestimonialUpdate(BaseModel):
    """Testimonial update schema."""

    author_name: Optional[str] = Field(None, min_length=1, max_length=100)
    author_role: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    extra_images: Optional[list[str]] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_approved: Optional[bool] = None


class TestimonialResponse(BaseModel):
    """Testimonial response schema."""

    id: str
    author_name: str
    author_role: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    extra_images: list[str] = Field(default_factory=list)
    is_approved: bool
    approve_date: Optional[datetime] = None
    rating: Optional[int] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
