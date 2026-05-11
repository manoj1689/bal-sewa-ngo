"""
Testimonial routes.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.actions import TestimonialApprovalUpdate
from app.schemas.base import StandardResponse
from app.schemas.testimonial import TestimonialCreate, TestimonialResponse
from app.services.entities import TestimonialService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])
testimonial_service = TestimonialService()


@router.post("", response_model=StandardResponse)
async def create_testimonial(data: TestimonialCreate):
    """Submit a testimonial."""
    testimonial = await testimonial_service.create_testimonial(data)
    return StandardResponse(
        status="success",
        message="Testimonial submitted successfully",
        data=TestimonialResponse.model_validate(testimonial),
    )


@router.get("", response_model=StandardResponse)
async def list_testimonials(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List approved testimonials."""
    pagination = Pagination(page, limit)
    testimonials = await testimonial_service.list_approved(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Testimonials fetched successfully",
        data=[
            TestimonialResponse.model_validate(testimonial)
            for testimonial in testimonials
        ],
    )


@router.get("/all", response_model=StandardResponse)
async def list_all_testimonials(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(get_current_admin),
):
    """List all testimonials for admin review."""
    pagination = Pagination(page, limit)
    testimonials, total = await testimonial_service.list_testimonials(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="All testimonials fetched successfully",
        data=[
            TestimonialResponse.model_validate(testimonial)
            for testimonial in testimonials
        ],
        pagination=pagination.get_pagination_meta(total),
    )


@router.patch("/{testimonial_id}/approve", response_model=StandardResponse)
async def approve_testimonial(
    testimonial_id: str,
    data: TestimonialApprovalUpdate,
    current_user=Depends(get_current_admin),
):
    """Approve or unapprove a testimonial (admin only)."""
    update_data = {"is_approved": data.is_approved}
    update_data["approve_date"] = datetime.utcnow() if data.is_approved else None
    testimonial = await testimonial_service.update_testimonial(
        testimonial_id,
        update_data,
    )
    return StandardResponse(
        status="success",
        message="Testimonial approval updated successfully",
        data=TestimonialResponse.model_validate(testimonial),
    )


@router.delete("/{testimonial_id}", response_model=StandardResponse)
async def delete_testimonial(
    testimonial_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete testimonial (admin only)."""
    await testimonial_service.repo.delete(testimonial_id)
    return StandardResponse(
        status="success",
        message="Testimonial deleted successfully",
    )
