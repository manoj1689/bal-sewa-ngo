"""
Small action schemas for moderation and admin endpoints.
"""

from pydantic import BaseModel, Field

from app.core.constants import BlogStatus, CampaignStatus, EventStatus, VolunteerStatus


class VolunteerStatusUpdate(BaseModel):
    """Volunteer status update schema."""

    status: VolunteerStatus


class TestimonialApprovalUpdate(BaseModel):
    """Testimonial approval schema."""

    is_approved: bool


class ContactReadUpdate(BaseModel):
    """Contact read-state update schema."""

    is_read: bool


class ContactReplyUpdate(BaseModel):
    """Contact reply schema."""

    response: str = Field(..., min_length=1, max_length=2000)


class CampaignFeatureUpdate(BaseModel):
    """Campaign feature toggle schema."""

    is_featured: bool


class CampaignStatusUpdate(BaseModel):
    """Campaign status update schema."""

    status: CampaignStatus


class BlogPublishUpdate(BaseModel):
    """Blog publish/archive status update schema."""

    status: BlogStatus


class EventStatusUpdate(BaseModel):
    """Event status update schema."""

    status: EventStatus
