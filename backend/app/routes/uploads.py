"""
File upload routes for images, videos, and documents.
"""

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.dependencies import get_current_admin
from app.schemas.base import StandardResponse
from app.schemas.upload import UploadResponse
from app.services.storage import storage_service

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/image", response_model=StandardResponse)
async def upload_image(
    file: UploadFile = File(...),
    storage: str | None = Form(None),
    current_user=Depends(get_current_admin),
):
    """Upload an image to local storage or S3 (admin only)."""
    uploaded = await storage_service.upload_file(
        file=file,
        category="image",
        storage=storage,
    )
    return StandardResponse(
        status="success",
        message="Image uploaded successfully",
        data=UploadResponse.model_validate(uploaded),
    )


@router.post("/video", response_model=StandardResponse)
async def upload_video(
    file: UploadFile = File(...),
    storage: str | None = Form(None),
    current_user=Depends(get_current_admin),
):
    """Upload a video to local storage or S3 (admin only)."""
    uploaded = await storage_service.upload_file(
        file=file,
        category="video",
        storage=storage,
    )
    return StandardResponse(
        status="success",
        message="Video uploaded successfully",
        data=UploadResponse.model_validate(uploaded),
    )


@router.post("/document", response_model=StandardResponse)
async def upload_document(
    file: UploadFile = File(...),
    storage: str | None = Form(None),
    current_user=Depends(get_current_admin),
):
    """Upload a document to local storage or S3 (admin only)."""
    uploaded = await storage_service.upload_file(
        file=file,
        category="document",
        storage=storage,
    )
    return StandardResponse(
        status="success",
        message="Document uploaded successfully",
        data=UploadResponse.model_validate(uploaded),
    )
