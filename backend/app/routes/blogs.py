"""
Blog routes.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.actions import BlogPublishUpdate
from app.schemas.base import StandardResponse
from app.schemas.blog import BlogCreate, BlogResponse, BlogUpdate
from app.services.entities import BlogService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/blogs", tags=["Blogs"])
blog_service = BlogService()


@router.post("", response_model=StandardResponse)
async def create_blog(
    data: BlogCreate,
    current_user=Depends(get_current_admin),
):
    """Create a new blog post (admin only)."""
    blog = await blog_service.create_blog(
        {**data.model_dump(), "author_id": current_user.id}
    )
    return StandardResponse(
        status="success",
        message="Blog post created successfully",
        data=BlogResponse.model_validate(blog),
    )


@router.get("", response_model=StandardResponse)
async def list_blogs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List all blog posts."""
    pagination = Pagination(page, limit)
    blogs, total = await blog_service.list_blogs(pagination.skip, pagination.limit)
    return StandardResponse(
        status="success",
        message="Blog posts fetched successfully",
        data=[BlogResponse.model_validate(blog) for blog in blogs],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/published", response_model=StandardResponse)
async def list_published_blogs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List published blog posts."""
    pagination = Pagination(page, limit)
    blogs = await blog_service.list_published(pagination.skip, pagination.limit)
    return StandardResponse(
        status="success",
        message="Published blog posts fetched successfully",
        data=[BlogResponse.model_validate(blog) for blog in blogs],
    )


@router.get("/{slug}", response_model=StandardResponse)
async def get_blog_by_slug(slug: str):
    """Get blog post by slug."""
    blog = await blog_service.get_blog_by_slug(slug)
    return StandardResponse(
        status="success",
        message="Blog post fetched successfully",
        data=BlogResponse.model_validate(blog),
    )


@router.put("/{blog_id}", response_model=StandardResponse)
async def update_blog(
    blog_id: str,
    data: BlogUpdate,
    current_user=Depends(get_current_admin),
):
    """Update blog post (admin only)."""
    blog = await blog_service.repo.update(
        blog_id,
        data.model_dump(exclude_unset=True),
    )
    return StandardResponse(
        status="success",
        message="Blog post updated successfully",
        data=BlogResponse.model_validate(blog),
    )


@router.patch("/{blog_id}/publish", response_model=StandardResponse)
async def publish_blog(
    blog_id: str,
    data: BlogPublishUpdate,
    current_user=Depends(get_current_admin),
):
    """Publish or archive a blog post (admin only)."""
    update_data = {"status": data.status}
    if data.status.value == "PUBLISHED":
        update_data["published_at"] = datetime.utcnow()
    blog = await blog_service.update_blog(blog_id, update_data)
    return StandardResponse(
        status="success",
        message="Blog publish status updated successfully",
        data=BlogResponse.model_validate(blog),
    )


@router.delete("/{blog_id}", response_model=StandardResponse)
async def delete_blog(
    blog_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete blog post (admin only)."""
    await blog_service.repo.delete(blog_id)
    return StandardResponse(
        status="success",
        message="Blog post deleted successfully",
    )
