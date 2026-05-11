"""
User management routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.entities import UserService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/users", tags=["Users"])
user_service = UserService()


@router.post("", response_model=StandardResponse)
async def create_user(
    data: UserCreate,
    current_user=Depends(get_current_admin),
):
    """Create a new user (admin only)."""
    user = await user_service.create_user(data)
    return StandardResponse(
        status="success",
        message="User created successfully",
        data=UserResponse.model_validate(user),
    )


@router.get("", response_model=StandardResponse)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(get_current_admin),
):
    """List all users (admin only)."""
    pagination = Pagination(page, limit)
    users, total = await user_service.list_users(pagination.skip, pagination.limit)
    return StandardResponse(
        status="success",
        message="Users fetched successfully",
        data=[UserResponse.model_validate(user) for user in users],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/{user_id}", response_model=StandardResponse)
async def get_user(user_id: str, current_user=Depends(get_current_admin)):
    """Get user by ID (admin only)."""
    user = await user_service.get_user(user_id)
    return StandardResponse(
        status="success",
        message="User fetched successfully",
        data=UserResponse.model_validate(user),
    )


@router.put("/{user_id}", response_model=StandardResponse)
async def update_user(
    user_id: str,
    data: UserUpdate,
    current_user=Depends(get_current_admin),
):
    """Update user (admin only)."""
    user = await user_service.update_user(user_id, data)
    return StandardResponse(
        status="success",
        message="User updated successfully",
        data=UserResponse.model_validate(user),
    )


@router.delete("/{user_id}", response_model=StandardResponse)
async def delete_user(
    user_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete user (admin only)."""
    await user_service.delete_user(user_id)
    return StandardResponse(
        status="success",
        message="User deleted successfully",
    )
