"""
Donation service for business logic.
"""

from datetime import datetime, timedelta
from app.repositories.donation import DonationRepository
from app.schemas.donation import (
    DonationCreate,
    DonationUpdate,
    DonationStatsResponse,
)
from app.exceptions import NotFoundException


class DonationService:
    """Service for donation operations."""

    def __init__(self):
        self.repository = DonationRepository()

    async def create_donation(self, data: DonationCreate):
        """Create a new donation."""
        donation_data = data.model_dump()
        return await self.repository.create(donation_data)

    async def get_donation(self, donation_id: str):
        """Get donation by ID."""
        donation = await self.repository.get_by_id(donation_id)
        if not donation:
            raise NotFoundException(f"Donation {donation_id} not found")
        return donation

    async def list_donations(self, skip: int = 0, limit: int = 10):
        """List all donations with pagination."""
        donations = await self.repository.get_all(skip=skip, limit=limit)
        total = await self.repository.count()
        return donations, total

    async def update_donation(self, donation_id: str, data: DonationUpdate):
        """Update donation."""
        await self.get_donation(donation_id)
        update_data = data.model_dump(exclude_unset=True)
        return await self.repository.update(donation_id, update_data)

    async def delete_donation(self, donation_id: str):
        """Delete donation."""
        await self.get_donation(donation_id)
        return await self.repository.delete(donation_id)

    async def get_campaign_donations(
        self,
        campaign_id: str,
        skip: int = 0,
        limit: int = 10,
    ):
        """Get donations for a campaign."""
        return await self.repository.get_by_campaign(campaign_id, skip, limit)

    async def get_donation_stats(self) -> DonationStatsResponse:
        """Get donation statistics."""
        # Get all completed donations
        all_donations, total_count = await self.list_donations(skip=0, limit=999999)
        completed = [d for d in all_donations if d.status == "COMPLETED"]
        
        total_amount = sum(d.amount for d in completed)
        average_amount = total_amount / len(completed) if completed else 0
        
        # Get monthly stats
        monthly = await self.repository.get_monthly_stats()
        monthly_amount = sum(d.amount for d in monthly)
        monthly_count = len(monthly)
        
        latest_donation_date = (
            max(d.donation_date for d in completed)
            if completed
            else None
        )
        
        return DonationStatsResponse(
            total_donations=len(completed),
            total_amount=total_amount,
            average_amount=average_amount,
            monthly_donations=monthly_count,
            monthly_amount=monthly_amount,
            latest_donation_date=latest_donation_date,
        )

    async def get_donor_history(self, email: str):
        """Get donation history for a donor."""
        return await self.repository.get_by_email(email)
