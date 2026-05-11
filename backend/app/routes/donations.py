"""
Donation routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.donation import DonationCreate, DonationResponse, DonationUpdate
from app.services.donation import DonationService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/donations", tags=["Donations"])
donation_service = DonationService()


@router.post("", response_model=StandardResponse)
async def create_donation(data: DonationCreate):
    """Create a new donation."""
    donation = await donation_service.create_donation(data)
    return StandardResponse(
        status="success",
        message="Donation created successfully",
        data=DonationResponse.model_validate(donation),
    )


@router.get("", response_model=StandardResponse)
async def list_donations(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List all donations with pagination."""
    pagination = Pagination(page, limit)
    donations, total = await donation_service.list_donations(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Donations fetched successfully",
        data=[DonationResponse.model_validate(donation) for donation in donations],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/stats/summary", response_model=StandardResponse)
async def get_donation_stats():
    """Get donation statistics."""
    stats = await donation_service.get_donation_stats()
    return StandardResponse(
        status="success",
        message="Statistics fetched successfully",
        data=stats,
    )


@router.get("/{donation_id}", response_model=StandardResponse)
async def get_donation(donation_id: str):
    """Get donation by ID."""
    donation = await donation_service.get_donation(donation_id)
    return StandardResponse(
        status="success",
        message="Donation fetched successfully",
        data=DonationResponse.model_validate(donation),
    )


@router.put("/{donation_id}", response_model=StandardResponse)
async def update_donation(
    donation_id: str,
    data: DonationUpdate,
    current_user=Depends(get_current_admin),
):
    """Update donation (admin only)."""
    donation = await donation_service.update_donation(donation_id, data)
    return StandardResponse(
        status="success",
        message="Donation updated successfully",
        data=DonationResponse.model_validate(donation),
    )


@router.delete("/{donation_id}", response_model=StandardResponse)
async def delete_donation(
    donation_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete donation (admin only)."""
    await donation_service.delete_donation(donation_id)
    return StandardResponse(
        status="success",
        message="Donation deleted successfully",
    )
