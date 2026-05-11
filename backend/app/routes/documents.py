"""
Document routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.entities import DocumentService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/documents", tags=["Documents"])
document_service = DocumentService()


@router.post("", response_model=StandardResponse)
async def create_document(
    data: DocumentCreate,
    current_user=Depends(get_current_admin),
):
    """Upload document (admin only)."""
    document = await document_service.create_document(
        {**data.model_dump(), "uploader_id": current_user.id}
    )
    return StandardResponse(
        status="success",
        message="Document uploaded successfully",
        data=DocumentResponse.model_validate(document),
    )


@router.get("", response_model=StandardResponse)
async def list_documents(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List documents."""
    pagination = Pagination(page, limit)
    documents, total = await document_service.list_documents(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Documents fetched successfully",
        data=[DocumentResponse.model_validate(document) for document in documents],
        pagination=pagination.get_pagination_meta(total),
    )


@router.delete("/{document_id}", response_model=StandardResponse)
async def delete_document(
    document_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete document (admin only)."""
    await document_service.repo.delete(document_id)
    return StandardResponse(
        status="success",
        message="Document deleted successfully",
    )
