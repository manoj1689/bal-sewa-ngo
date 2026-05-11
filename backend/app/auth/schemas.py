"""
Pydantic schemas for authentication.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password")


class RegisterRequest(BaseModel):
    """User registration request schema."""

    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="User password")
    name: str = Field(..., min_length=2, description="User full name")


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""

    refresh_token: str = Field(..., description="Refresh token")


class UserProfile(BaseModel):
    """User profile response schema."""

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
