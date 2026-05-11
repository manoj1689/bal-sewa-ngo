"""
Volunteer schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.core.constants import VolunteerStatus


class VolunteerCreate(BaseModel):
    """Volunteer registration schema."""

    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    address: Optional[str] = Field(None, max_length=200)
    city: Optional[str] = Field(None, max_length=50)
    state: Optional[str] = Field(None, max_length=50)
    postal_code: Optional[str] = Field(None, max_length=10)
    date_of_birth: Optional[datetime] = None
    skills: Optional[str] = Field(None, description="Comma-separated skills")
    availability: Optional[str] = Field(None, description="JSON or time slots")
    motivation: Optional[str] = Field(None, max_length=500)
    experience: Optional[str] = Field(None, max_length=500)


class VolunteerUpdate(BaseModel):
    """Volunteer update schema."""

    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    status: Optional[VolunteerStatus] = None


class VolunteerResponse(BaseModel):
    """Volunteer response schema."""

    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    status: str
    motivation: Optional[str] = None
    experience: Optional[str] = None
    is_verified: bool
    verify_date: Optional[datetime] = None
    user_id: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
