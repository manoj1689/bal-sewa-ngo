"""
User schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.core.constants import UserRole


class UserCreate(BaseModel):
    """User creation schema."""

    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="User password")
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    phone: Optional[str] = Field(None, max_length=20, description="Phone number")
    role: Optional[UserRole] = Field(
        UserRole.VOLUNTEER_MANAGER,
        description="User role",
    )


class UserUpdate(BaseModel):
    """User update schema."""

    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    """User response schema."""

    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
