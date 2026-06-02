"""
Gallery routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.gallery import (
    GalleryBucketCreate,
    GalleryBucketResponse,
    GalleryBucketUpdate,
    GalleryCreate,
    GalleryResponse,
    GalleryUpdate,
)
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
    category: str | None = Query(None),
    media_type: str | None = Query(None),
):
    """List published gallery media for the public site."""
    pagination = Pagination(page, limit)
    where = {"status": "PUBLISHED"}
    if category:
        where["category"] = category
    if media_type:
        where["media_type"] = media_type.upper()

    images, total = await gallery_service.list_gallery(
        pagination.skip,
        pagination.limit,
        where,
    )
    return StandardResponse(
        status="success",
        message="Gallery media fetched successfully",
        data=[GalleryResponse.model_validate(image) for image in images],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/admin", response_model=StandardResponse)
async def list_gallery_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: str | None = Query(None),
    media_type: str | None = Query(None),
    status: str | None = Query(None),
    current_user=Depends(get_current_admin),
):
    """List all gallery media for admins."""
    pagination = Pagination(page, limit)
    where = {}
    if category:
        where["category"] = category
    if media_type:
        where["media_type"] = media_type.upper()
    if status:
        where["status"] = status.upper()

    images, total = await gallery_service.list_gallery(
        pagination.skip,
        pagination.limit,
        where or None,
    )
    return StandardResponse(
        status="success",
        message="Gallery media fetched successfully",
        data=[GalleryResponse.model_validate(image) for image in images],
        pagination=pagination.get_pagination_meta(total),
    )


@router.post("/buckets", response_model=StandardResponse)
async def create_gallery_bucket(
    data: GalleryBucketCreate,
    current_user=Depends(get_current_admin),
):
    """Create a gallery bucket/folder (admin only)."""
    bucket = await gallery_service.create_bucket(
        {**data.model_dump(), "uploader_id": current_user.id}
    )
    return StandardResponse(
        status="success",
        message="Gallery bucket created successfully",
        data=GalleryBucketResponse.model_validate(bucket),
    )


@router.get("/buckets", response_model=StandardResponse)
async def list_gallery_buckets(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: str | None = Query(None),
    current_user=Depends(get_current_admin),
):
    """List gallery buckets/folders for admins."""
    pagination = Pagination(page, limit)
    where = {"status": status.upper()} if status else None
    buckets, total = await gallery_service.list_buckets(
        pagination.skip,
        pagination.limit,
        where,
    )
    return StandardResponse(
        status="success",
        message="Gallery buckets fetched successfully",
        data=[GalleryBucketResponse.model_validate(bucket) for bucket in buckets],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/buckets/{bucket_id}/media", response_model=StandardResponse)
async def list_gallery_bucket_media(
    bucket_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(get_current_admin),
):
    """List media inside one gallery bucket for admins."""
    await gallery_service.get_bucket(bucket_id)
    pagination = Pagination(page, limit)
    images, total = await gallery_service.list_gallery(
        pagination.skip,
        pagination.limit,
        {"bucket_id": bucket_id},
    )
    return StandardResponse(
        status="success",
        message="Gallery bucket media fetched successfully",
        data=[GalleryResponse.model_validate(image) for image in images],
        pagination=pagination.get_pagination_meta(total),
    )


@router.put("/buckets/{bucket_id}", response_model=StandardResponse)
async def update_gallery_bucket(
    bucket_id: str,
    data: GalleryBucketUpdate,
    current_user=Depends(get_current_admin),
):
    """Update a gallery bucket/folder (admin only)."""
    bucket = await gallery_service.update_bucket(
        bucket_id,
        data.model_dump(exclude_unset=True),
    )
    return StandardResponse(
        status="success",
        message="Gallery bucket updated successfully",
        data=GalleryBucketResponse.model_validate(bucket),
    )


@router.delete("/buckets/{bucket_id}", response_model=StandardResponse)
async def delete_gallery_bucket(
    bucket_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete a gallery bucket/folder (admin only)."""
    await gallery_service.delete_bucket(bucket_id)
    return StandardResponse(
        status="success",
        message="Gallery bucket deleted successfully",
    )


@router.get("/category/{category}", response_model=StandardResponse)
async def list_gallery_by_category(
    category: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    media_type: str | None = Query(None),
):
    """List published gallery media by category for the public site."""
    pagination = Pagination(page, limit)
    where = {"status": "PUBLISHED", "category": category}
    if media_type:
        where["media_type"] = media_type.upper()

    images, total = await gallery_service.list_gallery(
        pagination.skip,
        pagination.limit,
        where,
    )
    return StandardResponse(
        status="success",
        message="Gallery media fetched successfully",
        data=[GalleryResponse.model_validate(image) for image in images],
        pagination=pagination.get_pagination_meta(total),
    )


@router.put("/{image_id}", response_model=StandardResponse)
async def update_gallery_image(
    image_id: str,
    data: GalleryUpdate,
    current_user=Depends(get_current_admin),
):
    """Update gallery media metadata (admin only)."""
    image = await gallery_service.update_image(
        image_id,
        data.model_dump(exclude_unset=True),
    )
    return StandardResponse(
        status="success",
        message="Gallery media updated successfully",
        data=GalleryResponse.model_validate(image),
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
