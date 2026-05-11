"""
Base service class with common business logic.
"""

import logging
from typing import Any, Generic, List, Optional, TypeVar

from app.repositories.base import BaseRepository

T = TypeVar("T")
CreateSchema = TypeVar("CreateSchema")
UpdateSchema = TypeVar("UpdateSchema")

logger = logging.getLogger(__name__)


class BaseService(Generic[T, CreateSchema, UpdateSchema]):
    """Base service class for business logic."""

    def __init__(self, repository: BaseRepository):
        """
        Initialize service.

        Args:
            repository: Repository instance
        """
        self.repository = repository

    async def get_by_id(self, id: str) -> Optional[T]:
        """
        Get record by ID.

        Args:
            id: Record ID

        Returns:
            Record or None
        """
        try:
            return await self.repository.get_by_id(id)
        except Exception as e:
            logger.error(f"Error getting record by ID: {str(e)}")
            raise

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[List[T], int]:
        """
        Get all records with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum records to return

        Returns:
            Tuple of (records list, total count)
        """
        try:
            records = await self.repository.get_all(skip=skip, limit=limit)
            total = await self.repository.count()
            return records, total
        except Exception as e:
            logger.error(f"Error getting all records: {str(e)}")
            raise

    async def create(self, data: CreateSchema) -> T:
        """
        Create new record.

        Args:
            data: Record data

        Returns:
            Created record
        """
        try:
            return await self.repository.create(data.model_dump())
        except Exception as e:
            logger.error(f"Error creating record: {str(e)}")
            raise

    async def update(
        self,
        id: str,
        data: UpdateSchema,
    ) -> Optional[T]:
        """
        Update record.

        Args:
            id: Record ID
            data: Updated data

        Returns:
            Updated record or None
        """
        try:
            # Exclude unset fields
            update_data = data.model_dump(exclude_unset=True)
            return await self.repository.update(id, update_data)
        except Exception as e:
            logger.error(f"Error updating record: {str(e)}")
            raise

    async def delete(self, id: str) -> bool:
        """
        Delete record.

        Args:
            id: Record ID

        Returns:
            True if deleted, False otherwise
        """
        try:
            result = await self.repository.delete(id)
            return result is not None
        except Exception as e:
            logger.error(f"Error deleting record: {str(e)}")
            raise

    async def exists(self, **kwargs) -> bool:
        """
        Check if record exists.

        Args:
            **kwargs: Filter criteria

        Returns:
            True if exists, False otherwise
        """
        try:
            return await self.repository.exists(**kwargs)
        except Exception as e:
            logger.error(f"Error checking existence: {str(e)}")
            raise
