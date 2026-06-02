"""
Application constants and enumerations.
"""

from enum import Enum


class UserRole(str, Enum):
    """User roles for role-based access control."""

    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    EDITOR = "EDITOR"
    VOLUNTEER_MANAGER = "VOLUNTEER_MANAGER"


class DonationStatus(str, Enum):
    """Status of donations."""

    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class CampaignStatus(str, Enum):
    """Status of campaigns."""

    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    COMPLETED = "COMPLETED"


class BlogStatus(str, Enum):
    """Status of blog posts."""

    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class VolunteerStatus(str, Enum):
    """Status of volunteers."""

    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    INACTIVE = "INACTIVE"


class EventStatus(str, Enum):
    """Status of events."""

    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


# Pagination defaults
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100

# File upload constants
ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp"]
ALLOWED_VIDEO_TYPES = ["mp4", "mov", "avi", "mkv", "webm"]
ALLOWED_DOCUMENT_TYPES = ["pdf", "doc", "docx"]
UPLOAD_CHUNK_SIZE = 1024 * 1024  # 1MB chunks for file uploads

# Messages
SUCCESS_MESSAGE = "Operation successful"
ERROR_MESSAGE = "An error occurred"
NOT_FOUND_MESSAGE = "Resource not found"
UNAUTHORIZED_MESSAGE = "Unauthorized access"
FORBIDDEN_MESSAGE = "Access forbidden"
