"""
Repositories for all entity models.
"""

from prisma.models import (
    User, Campaign, Volunteer, Blog, Event,
    Gallery, GalleryBucket, Document, Testimonial, ContactMessage
)
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    """User repository."""
    
    def __init__(self):
        super().__init__(User)
    
    async def get_by_email(self, email: str):
        return await self.model.prisma().find_unique(where={"email": email})


class CampaignRepository(BaseRepository):
    """Campaign repository."""
    
    def __init__(self):
        super().__init__(Campaign)
    
    async def get_active(self):
        return await self.model.prisma().find_many(
            where={"status": "ACTIVE"},
            order={"start_date": "desc"}
        )

    async def get_featured(self):
        return await self.model.prisma().find_many(
            where={"is_featured": True},
            order={"start_date": "desc"},
        )


class VolunteerRepository(BaseRepository):
    """Volunteer repository."""
    
    def __init__(self):
        super().__init__(Volunteer)
    
    async def get_by_email(self, email: str):
        return await self.model.prisma().find_unique(where={"email": email})


class BlogRepository(BaseRepository):
    """Blog repository."""
    
    def __init__(self):
        super().__init__(Blog)
    
    async def get_by_slug(self, slug: str):
        return await self.model.prisma().find_unique(where={"slug": slug})
    
    async def get_published(self, skip: int = 0, limit: int = 10):
        return await self.model.prisma().find_many(
            where={"status": "PUBLISHED"},
            skip=skip,
            take=limit,
            order={"published_at": "desc"}
        )


class EventRepository(BaseRepository):
    """Event repository."""
    
    def __init__(self):
        super().__init__(Event)
    
    async def get_upcoming(self):
        from datetime import datetime
        return await self.model.prisma().find_many(
            where={"event_date": {"gte": datetime.utcnow()}},
            order={"event_date": "asc"}
        )


class GalleryRepository(BaseRepository):
    """Gallery repository."""
    
    def __init__(self):
        super().__init__(Gallery)
    
    async def get_all_ordered(self, skip: int = 0, limit: int = 10, where: dict | None = None):
        return await self.model.prisma().find_many(
            where=where,
            skip=skip,
            take=limit,
            order={"order": "asc"}
        )


class GalleryBucketRepository(BaseRepository):
    """Gallery bucket repository."""

    def __init__(self):
        super().__init__(GalleryBucket)

    async def get_all_ordered(self, skip: int = 0, limit: int = 10, where: dict | None = None):
        return await self.model.prisma().find_many(
            where=where,
            skip=skip,
            take=limit,
            order={"order": "asc"},
        )


class DocumentRepository(BaseRepository):
    """Document repository."""
    
    def __init__(self):
        super().__init__(Document)
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 10):
        return await self.model.prisma().find_many(
            where={"document_category": category},
            skip=skip,
            take=limit,
            order={"createdAt": "desc"}
        )


class TestimonialRepository(BaseRepository):
    """Testimonial repository."""
    
    def __init__(self):
        super().__init__(Testimonial)
    
    async def get_approved(self, skip: int = 0, limit: int = 10):
        return await self.model.prisma().find_many(
            where={"is_approved": True},
            skip=skip,
            take=limit,
            order={"createdAt": "desc"}
        )


class ContactMessageRepository(BaseRepository):
    """Contact message repository."""
    
    def __init__(self):
        super().__init__(ContactMessage)
    
    async def get_unread(self):
        return await self.model.prisma().find_many(
            where={"is_read": False},
            order={"createdAt": "desc"}
        )
