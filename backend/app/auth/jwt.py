"""
JWT token generation, validation, and management.
"""

from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt

from app.config.settings import settings
from app.exceptions import UnauthorizedException


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create JWT access token.

    Args:
        data: Data to encode in token
        expires_delta: Custom expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create JWT refresh token.

    Args:
        data: Data to encode in token

    Returns:
        Encoded JWT refresh token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verify and decode JWT token.

    Args:
        token: JWT token to verify

    Returns:
        Decoded token payload

    Raises:
        UnauthorizedException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError as e:
        raise UnauthorizedException(f"Invalid token: {str(e)}")


def get_token_subject(token: str) -> str:
    """
    Extract subject (user_id) from token.

    Args:
        token: JWT token

    Returns:
        User ID from token

    Raises:
        UnauthorizedException: If token is invalid
    """
    payload = verify_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException("Invalid token: missing subject")
    return user_id
