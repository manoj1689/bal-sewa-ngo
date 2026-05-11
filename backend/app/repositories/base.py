"""
Base repository class with common CRUD operations.
"""

from typing import Generic, List, Optional, Type, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseRepository(Generic[T]):
    """Base repository class for database operations."""

    def __init__(self, model: Type[T]):
        """
        Initialize repository.

        Args:
            model: Prisma model class
        """
        self.model = model

    async def get_by_id(self, id: str) -> Optional[T]:
        """
        Get record by ID.

        Args:
            id: Record ID

        Returns:
            Record or None if not found
        """
        return await self.model.prisma().find_unique(where={"id": id})

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 10,
        order_by: Optional[str] = None,
        order_direction: str = "asc",
    ) -> List[T]:
        """
        Get all records with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            order_by: Field to order by
            order_direction: Sort direction

        Returns:
            List of records
        """
        kwargs = {
            "skip": skip,
            "take": limit,
        }

        if order_by:
            kwargs["order"] = {order_by: order_direction}

        return await self.model.prisma().find_many(**kwargs)

    async def count(self, where: Optional[dict] = None) -> int:
        """
        Count total records.

        Returns:
            Total record count
        """
        return await self.model.prisma().count(where=where)

    async def create(self, data: dict) -> T:
        """
        Create new record.

        Args:
            data: Record data

        Returns:
            Created record
        """
        return await self.model.prisma().create(data=data)

    async def update(self, id: str, data: dict) -> Optional[T]:
        """
        Update record.

        Args:
            id: Record ID
            data: Updated data

        Returns:
            Updated record or None if not found
        """
        return await self.model.prisma().update(
            where={"id": id},
            data=data,
        )

    async def delete(self, id: str) -> Optional[T]:
        """
        Delete record.

        Args:
            id: Record ID

        Returns:
            Deleted record or None if not found
        """
        return await self.model.prisma().delete(where={"id": id})

    async def exists(self, **kwargs) -> bool:
        """
        Check if record exists.

        Args:
            **kwargs: Filter criteria

        Returns:
            True if record exists, False otherwise
        """
        count = await self.model.prisma().count(where=kwargs)
        return count > 0
