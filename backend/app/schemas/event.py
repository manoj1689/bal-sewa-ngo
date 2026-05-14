"""
Event schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field

from app.core.constants import EventStatus


class EventCreate(BaseModel):
    """Event creation schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    event_date: datetime
    end_date: Optional[datetime] = None
    location: str = Field(..., min_length=1, max_length=200)
    image_url: Optional[str] = None
    extra_images: list[str] = Field(default_factory=list)
    status: Optional[EventStatus] = Field(EventStatus.UPCOMING)
    max_attendees: Optional[int] = Field(None, gt=0)
    seo_title: Optional[str] = Field(None, max_length=200)
    seo_description: Optional[str] = Field(None, max_length=500)


class EventUpdate(BaseModel):
    """Event update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    extra_images: Optional[list[str]] = None
    status: Optional[EventStatus] = None
    max_attendees: Optional[int] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class EventResponse(BaseModel):
    """Event response schema."""

    id: str
    title: str
    description: str
    event_date: datetime
    end_date: Optional[datetime] = None
    location: str
    image_url: Optional[str] = None
    extra_images: list[str] = Field(default_factory=list)
    status: str
    max_attendees: Optional[int] = None
    attendees_count: int
    organizer_id: str
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
