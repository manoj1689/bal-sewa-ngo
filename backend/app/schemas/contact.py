"""
Contact message schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    """Contact message creation schema."""

    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)


class ContactMessageUpdate(BaseModel):
    """Contact message update schema."""

    response: Optional[str] = Field(None, max_length=2000)
    is_read: Optional[bool] = None


class ContactMessageResponse(BaseModel):
    """Contact message response schema."""

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    is_read: bool
    read_date: Optional[datetime] = None
    response: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
