"""
Services for all entity models.
"""

from collections.abc import Mapping

from app.repositories.entities import (
    UserRepository, CampaignRepository, VolunteerRepository,
    BlogRepository, EventRepository, GalleryRepository,
    DocumentRepository, TestimonialRepository, ContactMessageRepository
)
from app.utils.slug import generate_slug
from app.exceptions import NotFoundException, ConflictException


def _dump_data(data):
    """Normalize Pydantic models and dict-like payloads to plain dicts."""
    if isinstance(data, Mapping):
        return dict(data)
    return data.model_dump()


class UserService:
    """User service."""
    
    def __init__(self):
        self.repo = UserRepository()
    
    async def create_user(self, data):
        from app.auth.password import hash_password
        user_data = data.model_dump()
        user_data['password_hash'] = hash_password(user_data.pop('password'))
        return await self.repo.create(user_data)
    
    async def get_user(self, user_id: str):
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException(f"User {user_id} not found")
        return user
    
    async def get_user_by_email(self, email: str):
        return await self.repo.get_by_email(email)

    async def list_users(self, skip: int = 0, limit: int = 10):
        users = await self.repo.get_all(skip, limit, order_by="createdAt", order_direction="desc")
        total = await self.repo.count()
        return users, total

    async def update_user(self, user_id: str, data):
        await self.get_user(user_id)
        return await self.repo.update(user_id, data.model_dump(exclude_unset=True))

    async def delete_user(self, user_id: str):
        await self.get_user(user_id)
        return await self.repo.delete(user_id)


class CampaignService:
    """Campaign service."""
    
    def __init__(self):
        self.repo = CampaignRepository()
    
    async def create_campaign(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def get_campaign(self, campaign_id: str):
        campaign = await self.repo.get_by_id(campaign_id)
        if not campaign:
            raise NotFoundException(f"Campaign {campaign_id} not found")
        return campaign
    
    async def list_campaigns(self, skip: int = 0, limit: int = 10):
        campaigns = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return campaigns, total
    
    async def update_campaign(self, campaign_id: str, data):
        await self.get_campaign(campaign_id)
        return await self.repo.update(campaign_id, data.model_dump(exclude_unset=True))

    async def list_active_campaigns(self):
        return await self.repo.get_active()

    async def list_featured_campaigns(self):
        return await self.repo.get_featured()


class VolunteerService:
    """Volunteer service."""
    
    def __init__(self):
        self.repo = VolunteerRepository()
    
    async def register_volunteer(self, data):
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise ConflictException("Email already registered")
        return await self.repo.create(_dump_data(data))
    
    async def get_volunteer(self, volunteer_id: str):
        vol = await self.repo.get_by_id(volunteer_id)
        if not vol:
            raise NotFoundException(f"Volunteer {volunteer_id} not found")
        return vol
    
    async def list_volunteers(self, skip: int = 0, limit: int = 10):
        vols = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return vols, total
    
    async def update_volunteer(self, volunteer_id: str, data):
        await self.get_volunteer(volunteer_id)
        return await self.repo.update(volunteer_id, data.model_dump(exclude_unset=True))


class BlogService:
    """Blog service."""
    
    def __init__(self):
        self.repo = BlogRepository()
    
    async def create_blog(self, data):
        blog_data = _dump_data(data)
        if not blog_data.get('slug'):
            blog_data['slug'] = generate_slug(blog_data['title'])
        return await self.repo.create(blog_data)
    
    async def get_blog(self, blog_id: str):
        blog = await self.repo.get_by_id(blog_id)
        if not blog:
            raise NotFoundException(f"Blog {blog_id} not found")
        return blog
    
    async def get_blog_by_slug(self, slug: str):
        blog = await self.repo.get_by_slug(slug)
        if not blog:
            raise NotFoundException(f"Blog slug {slug} not found")
        return blog
    
    async def list_blogs(self, skip: int = 0, limit: int = 10):
        blogs = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return blogs, total
    
    async def list_published(self, skip: int = 0, limit: int = 10):
        blogs = await self.repo.get_published(skip, limit)
        return blogs

    async def update_blog(self, blog_id: str, data: dict):
        await self.get_blog(blog_id)
        return await self.repo.update(blog_id, data)


class EventService:
    """Event service."""
    
    def __init__(self):
        self.repo = EventRepository()
    
    async def create_event(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def get_event(self, event_id: str):
        event = await self.repo.get_by_id(event_id)
        if not event:
            raise NotFoundException(f"Event {event_id} not found")
        return event
    
    async def list_events(self, skip: int = 0, limit: int = 10):
        events = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return events, total
    
    async def list_upcoming(self):
        return await self.repo.get_upcoming()

    async def update_event(self, event_id: str, data: dict):
        await self.get_event(event_id)
        return await self.repo.update(event_id, data)


class GalleryService:
    """Gallery service."""
    
    def __init__(self):
        self.repo = GalleryRepository()
    
    async def create_image(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def get_image(self, image_id: str):
        img = await self.repo.get_by_id(image_id)
        if not img:
            raise NotFoundException(f"Image {image_id} not found")
        return img
    
    async def list_gallery(self, skip: int = 0, limit: int = 10):
        images = await self.repo.get_all_ordered(skip, limit)
        total = await self.repo.count()
        return images, total


class DocumentService:
    """Document service."""
    
    def __init__(self):
        self.repo = DocumentRepository()
    
    async def create_document(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def get_document(self, doc_id: str):
        doc = await self.repo.get_by_id(doc_id)
        if not doc:
            raise NotFoundException(f"Document {doc_id} not found")
        return doc
    
    async def list_documents(self, skip: int = 0, limit: int = 10):
        docs = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return docs, total


class TestimonialService:
    """Testimonial service."""
    
    def __init__(self):
        self.repo = TestimonialRepository()
    
    async def create_testimonial(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def list_testimonials(self, skip: int = 0, limit: int = 10):
        testimonies = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return testimonies, total
    
    async def list_approved(self, skip: int = 0, limit: int = 10):
        testimonies = await self.repo.get_approved(skip, limit)
        return testimonies

    async def get_testimonial(self, testimonial_id: str):
        testimonial = await self.repo.get_by_id(testimonial_id)
        if not testimonial:
            raise NotFoundException(f"Testimonial {testimonial_id} not found")
        return testimonial

    async def update_testimonial(self, testimonial_id: str, data: dict):
        await self.get_testimonial(testimonial_id)
        return await self.repo.update(testimonial_id, data)


class ContactService:
    """Contact message service."""
    
    def __init__(self):
        self.repo = ContactMessageRepository()
    
    async def create_message(self, data):
        return await self.repo.create(_dump_data(data))
    
    async def list_messages(self, skip: int = 0, limit: int = 10):
        messages = await self.repo.get_all(skip, limit)
        total = await self.repo.count()
        return messages, total
    
    async def list_unread(self):
        return await self.repo.get_unread()
    
    async def get_message(self, msg_id: str):
        msg = await self.repo.get_by_id(msg_id)
        if not msg:
            raise NotFoundException(f"Message {msg_id} not found")
        return msg

    async def update_message(self, msg_id: str, data: dict):
        await self.get_message(msg_id)
        return await self.repo.update(msg_id, data)
