"""
Pagination utilities for list endpoints.
"""

from typing import Optional

from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.schemas.base import PaginationMeta


class Pagination:
    """Pagination helper class."""

    def __init__(
        self,
        page: int = 1,
        limit: int = DEFAULT_PAGE_SIZE,
    ):
        """
        Initialize pagination.

        Args:
            page: Page number (1-indexed)
            limit: Items per page

        Raises:
            ValueError: If page or limit is invalid
        """
        if page < 1:
            raise ValueError("Page must be >= 1")
        if limit < 1:
            raise ValueError("Limit must be >= 1")
        if limit > MAX_PAGE_SIZE:
            limit = MAX_PAGE_SIZE

        self.page = page
        self.limit = limit
        self.skip = (page - 1) * limit

    @staticmethod
    def from_query_params(
        page: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> "Pagination":
        """
        Create pagination from query parameters.

        Args:
            page: Page number
            limit: Items per page

        Returns:
            Pagination instance
        """
        page = page or 1
        limit = limit or DEFAULT_PAGE_SIZE
        return Pagination(page=page, limit=limit)

    def get_pagination_meta(self, total: int) -> PaginationMeta:
        """
        Get pagination metadata.

        Args:
            total: Total number of items

        Returns:
            PaginationMeta instance
        """
        return PaginationMeta(
            total=total,
            skip=self.skip,
            limit=self.limit,
            has_more=(self.skip + self.limit) < total,
        )
