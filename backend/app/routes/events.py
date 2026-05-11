"""
Event routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.actions import EventStatusUpdate
from app.schemas.base import StandardResponse
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services.entities import EventService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/events", tags=["Events"])
event_service = EventService()


@router.post("", response_model=StandardResponse)
async def create_event(
    data: EventCreate,
    current_user=Depends(get_current_admin),
):
    """Create a new event (admin only)."""
    event = await event_service.create_event(
        {**data.model_dump(), "organizer_id": current_user.id}
    )
    return StandardResponse(
        status="success",
        message="Event created successfully",
        data=EventResponse.model_validate(event),
    )


@router.get("", response_model=StandardResponse)
async def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List all events."""
    pagination = Pagination(page, limit)
    events, total = await event_service.list_events(pagination.skip, pagination.limit)
    return StandardResponse(
        status="success",
        message="Events fetched successfully",
        data=[EventResponse.model_validate(event) for event in events],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/upcoming", response_model=StandardResponse)
async def list_upcoming_events():
    """List upcoming events."""
    events = await event_service.list_upcoming()
    return StandardResponse(
        status="success",
        message="Upcoming events fetched successfully",
        data=[EventResponse.model_validate(event) for event in events],
    )


@router.get("/{event_id}", response_model=StandardResponse)
async def get_event(event_id: str):
    """Get event by ID."""
    event = await event_service.get_event(event_id)
    return StandardResponse(
        status="success",
        message="Event fetched successfully",
        data=EventResponse.model_validate(event),
    )


@router.put("/{event_id}", response_model=StandardResponse)
async def update_event(
    event_id: str,
    data: EventUpdate,
    current_user=Depends(get_current_admin),
):
    """Update event (admin only)."""
    event = await event_service.repo.update(
        event_id,
        data.model_dump(exclude_unset=True),
    )
    return StandardResponse(
        status="success",
        message="Event updated successfully",
        data=EventResponse.model_validate(event),
    )


@router.patch("/{event_id}/status", response_model=StandardResponse)
async def update_event_status(
    event_id: str,
    data: EventStatusUpdate,
    current_user=Depends(get_current_admin),
):
    """Update event status (admin only)."""
    event = await event_service.update_event(event_id, {"status": data.status})
    return StandardResponse(
        status="success",
        message="Event status updated successfully",
        data=EventResponse.model_validate(event),
    )


@router.delete("/{event_id}", response_model=StandardResponse)
async def delete_event(
    event_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete event (admin only)."""
    await event_service.repo.delete(event_id)
    return StandardResponse(
        status="success",
        message="Event deleted successfully",
    )
