"""
Document schemas for validation and response formatting.
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class DocumentCreate(BaseModel):
    """Document upload schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    file_url: str
    file_type: str = Field(..., description="pdf, doc, docx, etc")
    file_size: int = Field(..., gt=0, description="File size in bytes")
    document_category: Optional[str] = Field(None, max_length=100)


class DocumentUpdate(BaseModel):
    """Document update schema."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    document_category: Optional[str] = None


class DocumentResponse(BaseModel):
    """Document response schema."""

    id: str
    title: str
    description: Optional[str] = None
    file_url: str
    file_type: str
    file_size: int
    document_category: Optional[str] = None
    uploader_id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
