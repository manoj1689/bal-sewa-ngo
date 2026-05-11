"""
Gallery schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class GalleryCreate(BaseModel):
    """Gallery image creation schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    image_url: str
    alt_text: Optional[str] = Field(None, max_length=200)
    order: Optional[int] = Field(0, ge=0)


class GalleryUpdate(BaseModel):
    """Gallery image update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    order: Optional[int] = None


class GalleryResponse(BaseModel):
    """Gallery image response schema."""

    id: str
    title: str
    description: Optional[str] = None
    image_url: str
    alt_text: Optional[str] = None
    order: int
    uploader_id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
