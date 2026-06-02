"""
Authentication routes.
"""

from datetime import datetime

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import create_access_token, create_refresh_token, verify_token
from app.auth.password import verify_password
from app.auth.schemas import (
    LoginRequest,
    ProfileUpdateRequest,
    RefreshTokenRequest,
    RegisterRequest,
    TokenResponse,
    UserProfile,
)
from app.config.settings import settings
from app.core.constants import UserRole
from app.dependencies import get_current_user
from app.exceptions import ConflictException, ForbiddenException, UnauthorizedException
from app.schemas.base import StandardResponse
from app.schemas.user import UserCreate
from app.services.entities import UserService

router = APIRouter(prefix="/auth", tags=["Auth"])
user_service = UserService()
optional_bearer = HTTPBearer(auto_error=False)


async def _ensure_admin_or_bootstrap(
    credentials: HTTPAuthorizationCredentials | None,
) -> None:
    """Allow first user bootstrap, otherwise require admin auth."""
    user_count = await user_service.repo.count()
    if user_count == 0:
        return

    if credentials is None:
        raise UnauthorizedException("Admin authentication required")

    current_user = await get_current_user(credentials)
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise ForbiddenException("Admin access required")


def _build_token_response(user_id: str) -> TokenResponse:
    """Create a pair of JWT tokens for a user."""
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=StandardResponse)
async def register(
    data: RegisterRequest,
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer),
):
    """Register a new user."""
    existing_user = await user_service.get_user_by_email(data.email)
    if existing_user:
        raise ConflictException("Email already registered")

    user = await user_service.create_user(
        UserCreate(
            email=data.email,
            password=data.password,
            name=data.name,
            phone=data.phone,
        )
    )
    tokens = _build_token_response(user.id)

    return StandardResponse(
        status="success",
        message="User registered successfully",
        data={
            "user": UserProfile.model_validate(user),
            "tokens": tokens.model_dump(),
        },
    )


@router.post("/login", response_model=StandardResponse)
async def login(data: LoginRequest):
    """Authenticate a user and return JWT tokens."""
    user = await user_service.get_user_by_email(data.email)
    if user is None or not verify_password(data.password, user.password_hash):
        raise UnauthorizedException("Invalid email or password")

    if not user.is_active:
        raise ForbiddenException("User account is inactive")

    user = await user_service.repo.update(
        user.id,
        {"last_login": datetime.utcnow()},
    )
    tokens = _build_token_response(user.id)

    return StandardResponse(
        status="success",
        message="Login successful",
        data={
            "user": UserProfile.model_validate(user),
            "tokens": tokens.model_dump(),
        },
    )


@router.post("/refresh", response_model=StandardResponse)
async def refresh_token(data: RefreshTokenRequest):
    """Refresh an access token using a valid refresh token."""
    payload = verify_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise UnauthorizedException("Invalid refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid refresh token: missing subject")

    user = await user_service.get_user(user_id)
    if not user.is_active:
        raise ForbiddenException("User account is inactive")

    tokens = _build_token_response(user.id)
    return StandardResponse(
        status="success",
        message="Token refreshed successfully",
        data=tokens,
    )


@router.get("/profile", response_model=StandardResponse)
async def get_profile(current_user=Depends(get_current_user)):
    """Get the authenticated user's profile."""
    return StandardResponse(
        status="success",
        message="Profile fetched successfully",
        data=UserProfile.model_validate(current_user),
    )


@router.put("/profile", response_model=StandardResponse)
async def update_profile(
    data: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
):
    """Update the authenticated user's own profile."""
    update_data = data.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"] != current_user.email:
        existing_user = await user_service.get_user_by_email(update_data["email"])
        if existing_user:
            raise ConflictException("Email already registered")

    user = await user_service.repo.update(current_user.id, update_data)
    return StandardResponse(
        status="success",
        message="Profile updated successfully",
        data=UserProfile.model_validate(user),
    )


@router.get("/me", response_model=StandardResponse)
async def get_me(current_user=Depends(get_current_user)):
    """Alias for the authenticated user's profile."""
    return StandardResponse(
        status="success",
        message="Profile fetched successfully",
        data=UserProfile.model_validate(current_user),
    )


@router.post("/logout", response_model=StandardResponse)
async def logout(current_user=Depends(get_current_user)):
    """Logout placeholder for stateless JWT auth."""
    return StandardResponse(
        status="success",
        message="Logout successful",
    )
