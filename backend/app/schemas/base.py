"""
Base response schemas for all API responses.
"""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PaginationMeta(BaseModel):
    """Pagination metadata."""

    total: int
    skip: int
    limit: int
    has_more: bool


class StandardResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""

    status: str  # "success", "error"
    message: str
    data: Optional[T] = None
    pagination: Optional[PaginationMeta] = None
    error_code: Optional[str] = None


class ErrorDetail(BaseModel):
    """Error response detail."""

    field: str
    message: str


class ValidationErrorResponse(BaseModel):
    """Validation error response."""

    status: str = "error"
    message: str = "Validation failed"
    error_code: str = "VALIDATION_ERROR"
    details: list[ErrorDetail]
