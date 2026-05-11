"""
Campaign schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field

from app.core.constants import CampaignStatus


class CampaignCreate(BaseModel):
    """Campaign creation schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    goal_amount: float = Field(..., gt=0, description="Target fundraising amount")
    image_url: Optional[str] = None
    status: Optional[CampaignStatus] = Field(CampaignStatus.DRAFT)
    start_date: datetime
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = False
    seo_title: Optional[str] = Field(None, max_length=200)
    seo_description: Optional[str] = Field(None, max_length=500)


class CampaignUpdate(BaseModel):
    """Campaign update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    goal_amount: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    status: Optional[CampaignStatus] = None
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class CampaignResponse(BaseModel):
    """Campaign response schema."""

    id: str
    title: str
    description: str
    goal_amount: float
    raised_amount: float
    image_url: Optional[str] = None
    status: str
    start_date: datetime
    end_date: Optional[datetime] = None
    is_featured: bool
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class CampaignStatsResponse(BaseModel):
    """Campaign statistics response."""

    id: str
    title: str
    goal_amount: float
    raised_amount: float
    progress_percentage: float
    donor_count: int
    days_remaining: Optional[int] = None
