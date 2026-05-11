"""
Donation schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.core.constants import DonationStatus


class DonationCreate(BaseModel):
    """Donation creation schema."""

    amount: float = Field(..., gt=0, description="Donation amount")
    currency: Optional[str] = Field("INR", description="Currency code")
    donor_name: str = Field(..., min_length=1, max_length=100)
    donor_email: EmailStr
    donor_phone: Optional[str] = Field(None, max_length=20)
    payment_method: Optional[str] = Field(None, description="CARD, BANK_TRANSFER, etc")
    transaction_id: Optional[str] = None
    message: Optional[str] = Field(None, max_length=500)
    campaign_id: Optional[str] = None


class DonationUpdate(BaseModel):
    """Donation update schema."""

    status: Optional[DonationStatus] = None
    receipt_url: Optional[str] = None
    message: Optional[str] = None


class DonationResponse(BaseModel):
    """Donation response schema."""

    id: str
    amount: float
    currency: str
    donor_name: str
    donor_email: str
    donor_phone: Optional[str] = None
    donation_date: datetime
    status: str
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    receipt_url: Optional[str] = None
    message: Optional[str] = None
    campaign_id: Optional[str] = None
    user_id: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class DonationStatsResponse(BaseModel):
    """Donation statistics response."""

    total_donations: int
    total_amount: float
    average_amount: float
    monthly_donations: int
    monthly_amount: float
    latest_donation_date: Optional[datetime] = None
