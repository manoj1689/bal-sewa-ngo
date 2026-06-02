"""
Gallery schemas for validation and response formatting.
"""

from typing import Literal, Optional
from datetime import datetime

from pydantic import BaseModel, Field

GalleryMediaType = Literal["IMAGE", "VIDEO"]
GalleryStatus = Literal["DRAFT", "PUBLISHED"]


class GalleryCreate(BaseModel):
    """Gallery image creation schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    image_url: str
    media_type: GalleryMediaType = "IMAGE"
    category: Optional[str] = Field(None, max_length=100)
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = Field(None, max_length=200)
    order: Optional[int] = Field(0, ge=0)
    status: GalleryStatus = "PUBLISHED"
    bucket_id: Optional[str] = None


class GalleryUpdate(BaseModel):
    """Gallery image update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    media_type: Optional[GalleryMediaType] = None
    category: Optional[str] = Field(None, max_length=100)
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None
    order: Optional[int] = None
    status: Optional[GalleryStatus] = None
    bucket_id: Optional[str] = None


class GalleryResponse(BaseModel):
    """Gallery image response schema."""

    id: str
    title: str
    description: Optional[str] = None
    image_url: str
    media_type: str = "IMAGE"
    category: Optional[str] = None
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None
    order: int
    status: str = "PUBLISHED"
    bucket_id: Optional[str] = None
    uploader_id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class GalleryBucketCreate(BaseModel):
    """Gallery bucket creation schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    thumbnail_url: Optional[str] = None
    status: GalleryStatus = "PUBLISHED"
    order: Optional[int] = Field(0, ge=0)


class GalleryBucketUpdate(BaseModel):
    """Gallery bucket update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    thumbnail_url: Optional[str] = None
    status: Optional[GalleryStatus] = None
    order: Optional[int] = Field(None, ge=0)


class GalleryBucketResponse(BaseModel):
    """Gallery bucket response schema."""

    id: str
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "PUBLISHED"
    order: int
    uploader_id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
