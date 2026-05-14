"""
Donation repository for database operations.
"""

from datetime import datetime, timedelta
from prisma.models import Donation
from app.repositories.base import BaseRepository


class DonationRepository(BaseRepository):
    """Repository for donation operations."""

    def __init__(self):
        super().__init__(Donation)

    async def get_by_campaign(
        self,
        campaign_id: str,
        skip: int = 0,
        limit: int = 10,
    ):
        """Get donations for a specific campaign."""
        return await self.model.prisma().find_many(
            where={"campaign_id": campaign_id},
            skip=skip,
            take=limit,
            order={"createdAt": "desc"},
        )

    async def get_monthly_stats(self):
        """Get donations for current month."""
        now = datetime.utcnow()
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        donations = await self.model.prisma().find_many(
            where={
                "donation_date": {"gte": start},
                "status": "COMPLETED",
            }
        )
        return donations

    async def get_total_by_status(self, status: str):
        """Get total amount by donation status."""
        donations = await self.model.prisma().find_many(
            where={"status": status}
        )
        return sum(d.amount for d in donations)

    async def get_by_email(self, email: str):
        """Get donations by donor email."""
        return await self.model.prisma().find_many(
            where={"donor_email": email},
            order={"donation_date": "desc"},
        )

    async def get_completed_by_campaign(self, campaign_id: str):
        """Get completed donations for a specific campaign."""
        return await self.model.prisma().find_many(
            where={
                "campaign_id": campaign_id,
                "status": "COMPLETED",
            }
        )

    async def get_recent(self, limit: int = 5):
        """Get recent donations."""
        return await self.model.prisma().find_many(
            take=limit,
            order={"donation_date": "desc"},
        )
