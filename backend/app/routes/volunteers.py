"""
Volunteer routes.
"""

from fastapi import APIRouter, Depends, Query

from datetime import datetime

from app.dependencies import get_current_admin, get_current_user
from app.schemas.actions import VolunteerStatusUpdate
from app.schemas.base import StandardResponse
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse, VolunteerUpdate
from app.services.entities import VolunteerService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])
volunteer_service = VolunteerService()


@router.post("", response_model=StandardResponse)
async def register_volunteer(data: VolunteerCreate):
    """Register a new volunteer."""
    volunteer = await volunteer_service.register_volunteer(data)
    return StandardResponse(
        status="success",
        message="Volunteer registered successfully",
        data=VolunteerResponse.model_validate(volunteer),
    )


@router.get("", response_model=StandardResponse)
async def list_volunteers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List all volunteers."""
    pagination = Pagination(page, limit)
    volunteers, total = await volunteer_service.list_volunteers(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Volunteers fetched successfully",
        data=[VolunteerResponse.model_validate(volunteer) for volunteer in volunteers],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/{volunteer_id}", response_model=StandardResponse)
async def get_volunteer(volunteer_id: str):
    """Get volunteer by ID."""
    volunteer = await volunteer_service.get_volunteer(volunteer_id)
    return StandardResponse(
        status="success",
        message="Volunteer fetched successfully",
        data=VolunteerResponse.model_validate(volunteer),
    )


@router.put("/{volunteer_id}", response_model=StandardResponse)
async def update_volunteer(
    volunteer_id: str,
    data: VolunteerUpdate,
    current_user=Depends(get_current_user),
):
    """Update volunteer."""
    volunteer = await volunteer_service.update_volunteer(volunteer_id, data)
    return StandardResponse(
        status="success",
        message="Volunteer updated successfully",
        data=VolunteerResponse.model_validate(volunteer),
    )


@router.patch("/{volunteer_id}/status", response_model=StandardResponse)
async def update_volunteer_status(
    volunteer_id: str,
    data: VolunteerStatusUpdate,
    current_user=Depends(get_current_admin),
):
    """Approve, reject, or deactivate a volunteer (admin only)."""
    update_payload = {"status": data.status}
    if data.status.value == "APPROVED":
        update_payload["is_verified"] = True
        update_payload["verify_date"] = datetime.utcnow()
    else:
        update_payload["is_verified"] = False
        update_payload["verify_date"] = None

    volunteer = await volunteer_service.repo.update(volunteer_id, update_payload)
    return StandardResponse(
        status="success",
        message="Volunteer status updated successfully",
        data=VolunteerResponse.model_validate(volunteer),
    )
