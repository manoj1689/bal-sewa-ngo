"""
Dashboard routes.
"""

from datetime import datetime

from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.services.donation import DonationService
from app.services.entities import (
    BlogService,
    CampaignService,
    ContactService,
    VolunteerService,
)
from app.schemas.campaign import CampaignStatsResponse
from app.schemas.contact import ContactMessageResponse
from app.schemas.donation import DonationResponse
from app.schemas.volunteer import VolunteerResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
donation_service = DonationService()
volunteer_service = VolunteerService()
campaign_service = CampaignService()
blog_service = BlogService()
contact_service = ContactService()


@router.get("/stats", response_model=StandardResponse)
async def get_dashboard_stats(current_user=Depends(get_current_admin)):
    """Get dashboard statistics (admin only)."""
    stats = await donation_service.get_donation_stats()
    return StandardResponse(
        status="success",
        message="Dashboard statistics fetched successfully",
        data={
            "donations": stats.model_dump(),
            "total_volunteers": await volunteer_service.repo.count(),
            "total_campaigns": await campaign_service.repo.count(),
            "total_blogs": await blog_service.repo.count(),
        },
    )


@router.get("/recent-donations", response_model=StandardResponse)
async def get_recent_donations(current_user=Depends(get_current_admin)):
    """Get recent donations for the dashboard."""
    donations = await donation_service.repository.get_recent(limit=5)
    return StandardResponse(
        status="success",
        message="Recent donations fetched successfully",
        data=[DonationResponse.model_validate(donation) for donation in donations],
    )


@router.get("/recent-volunteers", response_model=StandardResponse)
async def get_recent_volunteers(current_user=Depends(get_current_admin)):
    """Get recent volunteers for the dashboard."""
    volunteers = await volunteer_service.repo.get_all(
        limit=5,
        order_by="createdAt",
        order_direction="desc",
    )
    return StandardResponse(
        status="success",
        message="Recent volunteers fetched successfully",
        data=[VolunteerResponse.model_validate(volunteer) for volunteer in volunteers],
    )


@router.get("/recent-contact-messages", response_model=StandardResponse)
async def get_recent_contact_messages(current_user=Depends(get_current_admin)):
    """Get recent contact messages for the dashboard."""
    messages = await contact_service.repo.get_all(
        limit=5,
        order_by="createdAt",
        order_direction="desc",
    )
    return StandardResponse(
        status="success",
        message="Recent contact messages fetched successfully",
        data=[ContactMessageResponse.model_validate(message) for message in messages],
    )


@router.get("/campaign-stats", response_model=StandardResponse)
async def get_campaign_stats(current_user=Depends(get_current_admin)):
    """Get campaign progress statistics for the dashboard."""
    campaigns, _ = await campaign_service.list_campaigns(skip=0, limit=100)
    campaign_stats = []

    for campaign in campaigns:
        donations = await donation_service.get_campaign_donations(
            campaign.id,
            skip=0,
            limit=999999,
        )
        donor_count = len(donations)
        progress_percentage = (
            (campaign.raised_amount / campaign.goal_amount) * 100
            if campaign.goal_amount
            else 0
        )
        days_remaining = None
        if campaign.end_date is not None:
            delta = campaign.end_date.date() - datetime.utcnow().date()
            days_remaining = max(delta.days, 0)

        campaign_stats.append(
            CampaignStatsResponse(
                id=campaign.id,
                title=campaign.title,
                goal_amount=campaign.goal_amount,
                raised_amount=campaign.raised_amount,
                progress_percentage=progress_percentage,
                donor_count=donor_count,
                days_remaining=days_remaining,
            )
        )

    return StandardResponse(
        status="success",
        message="Campaign statistics fetched successfully",
        data=campaign_stats,
    )
