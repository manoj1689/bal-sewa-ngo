"""
FastAPI dependency injection functions.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import get_token_subject
from app.core.constants import UserRole
from app.database.prisma_client import get_prisma
from app.exceptions import ForbiddenException, UnauthorizedException

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Get current authenticated user from JWT token.

    Args:
        credentials: HTTP Bearer credentials

    Returns:
        User object

    Raises:
        UnauthorizedException: If token is invalid or user not found
    """
    token = credentials.credentials

    try:
        user_id = get_token_subject(token)
    except UnauthorizedException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    prisma = get_prisma()
    user = await prisma.user.find_unique(where={"id": user_id})

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_admin(
    current_user=Depends(get_current_user),
):
    """
    Get current admin user (ADMIN or SUPER_ADMIN).

    Args:
        current_user: Current authenticated user

    Returns:
        User object if admin

    Raises:
        ForbiddenException: If user is not admin
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_current_super_admin(
    current_user=Depends(get_current_user),
):
    """
    Get current super admin user.

    Args:
        current_user: Current authenticated user

    Returns:
        User object if super admin

    Raises:
        ForbiddenException: If user is not super admin
    """
    if current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required",
        )
    return current_user


async def get_current_editor(
    current_user=Depends(get_current_user),
):
    """
    Get current editor user (EDITOR, ADMIN, or SUPER_ADMIN).

    Args:
        current_user: Current authenticated user

    Returns:
        User object if editor or above

    Raises:
        ForbiddenException: If user is not editor
    """
    if current_user.role not in [
        UserRole.EDITOR,
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Editor access required",
        )
    return current_user
