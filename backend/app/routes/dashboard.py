"""
Dashboard routes.
"""

from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.services.donation import DonationService
from app.services.entities import (
    BlogService,
    CampaignService,
    ContactService,
    EventService,
    UserService,
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
event_service = EventService()
user_service = UserService()


def _last_n_months(count: int) -> list[tuple[int, int]]:
    """Return year/month pairs for the last N months including current month."""
    current = datetime.utcnow()
    months: list[tuple[int, int]] = []
    year = current.year
    month = current.month

    for _ in range(count):
        months.append((year, month))
        month -= 1
        if month == 0:
            month = 12
            year -= 1

    months.reverse()
    return months


@router.get("/stats", response_model=StandardResponse)
async def get_dashboard_stats(current_user=Depends(get_current_admin)):
    """Get dashboard statistics (admin only)."""
    stats = await donation_service.get_donation_stats()
    return StandardResponse(
        status="success",
        message="Dashboard statistics fetched successfully",
        data={
            "donations": stats.model_dump(),
            "total_users": await user_service.repo.count(),
            "total_volunteers": await volunteer_service.repo.count(),
            "total_campaigns": await campaign_service.repo.count(),
            "active_campaigns": await campaign_service.repo.count(where={"status": "ACTIVE"}),
            "total_blogs": await blog_service.repo.count(),
            "upcoming_events": await event_service.repo.count(where={"status": "UPCOMING"}),
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


@router.get("/charts/donations", response_model=StandardResponse)
async def get_donation_chart_data(current_user=Depends(get_current_admin)):
    """Get monthly donation trend for the dashboard."""
    donations, _ = await donation_service.list_donations(skip=0, limit=999999)
    monthly_totals: dict[tuple[int, int], dict[str, float | int]] = defaultdict(
        lambda: {"amount": 0.0, "count": 0}
    )

    for donation in donations:
        if donation.status != "COMPLETED":
            continue
        key = (donation.donation_date.year, donation.donation_date.month)
        monthly_totals[key]["amount"] += donation.amount
        monthly_totals[key]["count"] += 1

    chart_data = []
    for year, month in _last_n_months(6):
        data = monthly_totals[(year, month)]
        chart_data.append(
            {
                "label": datetime(year, month, 1).strftime("%b %Y"),
                "amount": round(float(data["amount"]), 2),
                "count": int(data["count"]),
            }
        )

    return StandardResponse(
        status="success",
        message="Donation chart data fetched successfully",
        data=chart_data,
    )


@router.get("/charts/donation-status", response_model=StandardResponse)
async def get_donation_status_chart_data(current_user=Depends(get_current_admin)):
    """Get donation status breakdown for the dashboard."""
    donations, _ = await donation_service.list_donations(skip=0, limit=999999)
    status_totals: dict[str, dict[str, float | int]] = defaultdict(
        lambda: {"count": 0, "amount": 0.0}
    )

    for donation in donations:
        status_totals[donation.status]["count"] += 1
        status_totals[donation.status]["amount"] += donation.amount

    chart_data = [
        {
            "status": status,
            "count": int(values["count"]),
            "amount": round(float(values["amount"]), 2),
        }
        for status, values in status_totals.items()
    ]

    return StandardResponse(
        status="success",
        message="Donation status chart data fetched successfully",
        data=chart_data,
    )


@router.get("/charts/top-campaigns", response_model=StandardResponse)
async def get_top_campaigns_chart_data(current_user=Depends(get_current_admin)):
    """Get top campaigns by raised amount for the dashboard."""
    campaigns, _ = await campaign_service.list_campaigns(skip=0, limit=100)
    top_campaigns = sorted(
        campaigns,
        key=lambda campaign: campaign.raised_amount,
        reverse=True,
    )[:5]

    chart_data = [
        {
            "id": campaign.id,
            "title": campaign.title,
            "raised_amount": campaign.raised_amount,
            "goal_amount": campaign.goal_amount,
        }
        for campaign in top_campaigns
    ]

    return StandardResponse(
        status="success",
        message="Top campaigns chart data fetched successfully",
        data=chart_data,
    )
