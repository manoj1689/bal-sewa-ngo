"""
Gallery routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.gallery import GalleryCreate, GalleryResponse
from app.services.entities import GalleryService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/gallery", tags=["Gallery"])
gallery_service = GalleryService()


@router.post("", response_model=StandardResponse)
async def create_gallery_image(
    data: GalleryCreate,
    current_user=Depends(get_current_admin),
):
    """Upload gallery image (admin only)."""
    image = await gallery_service.create_image(
        {**data.model_dump(), "uploader_id": current_user.id}
    )
    return StandardResponse(
        status="success",
        message="Image uploaded successfully",
        data=GalleryResponse.model_validate(image),
    )


@router.get("", response_model=StandardResponse)
async def list_gallery(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List gallery images."""
    pagination = Pagination(page, limit)
    images, total = await gallery_service.list_gallery(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Gallery images fetched successfully",
        data=[GalleryResponse.model_validate(image) for image in images],
        pagination=pagination.get_pagination_meta(total),
    )


@router.delete("/{image_id}", response_model=StandardResponse)
async def delete_gallery_image(
    image_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete gallery image (admin only)."""
    await gallery_service.repo.delete(image_id)
    return StandardResponse(
        status="success",
        message="Image deleted successfully",
    )
