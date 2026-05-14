"""
Upload schemas for local and S3-backed file uploads.
"""

from pydantic import BaseModel


class UploadResponse(BaseModel):
    """Uploaded file metadata returned by upload endpoints."""

    file_name: str
    original_name: str
    file_url: str
    file_size: int
    content_type: str
    extension: str
    category: str
    storage: str
