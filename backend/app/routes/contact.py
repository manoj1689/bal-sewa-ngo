"""
Contact message routes.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.actions import ContactReadUpdate, ContactReplyUpdate
from app.schemas.base import StandardResponse
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse
from app.services.entities import ContactService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/contact", tags=["Contact"])
contact_service = ContactService()


@router.post("", response_model=StandardResponse)
async def submit_contact(data: ContactMessageCreate):
    """Submit a contact message."""
    message = await contact_service.create_message(data)
    return StandardResponse(
        status="success",
        message="Message submitted successfully",
        data=ContactMessageResponse.model_validate(message),
    )


@router.get("", response_model=StandardResponse)
async def list_contact_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(get_current_admin),
):
    """List contact messages (admin only)."""
    pagination = Pagination(page, limit)
    messages, total = await contact_service.list_messages(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Contact messages fetched successfully",
        data=[ContactMessageResponse.model_validate(message) for message in messages],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/unread", response_model=StandardResponse)
async def get_unread_messages(current_user=Depends(get_current_admin)):
    """Get unread contact messages (admin only)."""
    messages = await contact_service.list_unread()
    return StandardResponse(
        status="success",
        message="Unread messages fetched successfully",
        data=[ContactMessageResponse.model_validate(message) for message in messages],
    )


@router.patch("/{message_id}/read", response_model=StandardResponse)
async def mark_message_read(
    message_id: str,
    data: ContactReadUpdate,
    current_user=Depends(get_current_admin),
):
    """Mark a contact message as read or unread (admin only)."""
    update_data = {"is_read": data.is_read}
    update_data["read_date"] = datetime.utcnow() if data.is_read else None
    message = await contact_service.update_message(message_id, update_data)
    return StandardResponse(
        status="success",
        message="Contact message read status updated successfully",
        data=ContactMessageResponse.model_validate(message),
    )


@router.post("/{message_id}/reply", response_model=StandardResponse)
async def reply_to_message(
    message_id: str,
    data: ContactReplyUpdate,
    current_user=Depends(get_current_admin),
):
    """Store an admin reply for a contact message."""
    message = await contact_service.update_message(
        message_id,
        {
            "response": data.response,
            "is_read": True,
            "read_date": datetime.utcnow(),
        },
    )
    return StandardResponse(
        status="success",
        message="Reply saved successfully",
        data=ContactMessageResponse.model_validate(message),
    )
