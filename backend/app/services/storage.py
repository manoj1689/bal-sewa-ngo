"""
Storage service for local and S3-backed uploads.
"""

from __future__ import annotations

import os
from pathlib import Path
from uuid import uuid4

import aiofiles
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import UploadFile

from app.config.settings import settings
from app.core.constants import (
    ALLOWED_DOCUMENT_TYPES,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_VIDEO_TYPES,
    UPLOAD_CHUNK_SIZE,
)
from app.exceptions import ServiceException, ValidationException
from app.schemas.upload import UploadResponse


class StorageService:
    """Handle file validation and persistence for local or S3 storage."""

    allowed_extensions = {
        "image": ALLOWED_IMAGE_TYPES,
        "video": ALLOWED_VIDEO_TYPES,
        "document": ALLOWED_DOCUMENT_TYPES,
    }

    def __init__(self) -> None:
        self.upload_root = Path(settings.FILE_UPLOAD_DIR)

    def ensure_local_directories(self) -> None:
        """Create local upload directories when using local storage."""
        for category in self.allowed_extensions:
            (self.upload_root / category).mkdir(parents=True, exist_ok=True)

    def _validate_storage(self, storage: str | None) -> str:
        selected_storage = (storage or settings.file_storage_backend).strip().lower()
        if selected_storage not in {"local", "s3"}:
            raise ValidationException("Storage must be either 'local' or 's3'")
        return selected_storage

    def _validate_file(self, file: UploadFile, category: str) -> tuple[str, str]:
        if not file.filename:
            raise ValidationException("A file is required")

        extension = Path(file.filename).suffix.lower().lstrip(".")
        if not extension:
            raise ValidationException("Uploaded file must have an extension")

        allowed_extensions = self.allowed_extensions[category]
        if extension not in allowed_extensions:
            raise ValidationException(
                f"Unsupported {category} file type. Allowed: {', '.join(allowed_extensions)}"
            )

        safe_name = f"{uuid4().hex}.{extension}"
        return safe_name, extension

    async def _read_file_bytes(self, file: UploadFile) -> bytes:
        contents = await file.read()
        if not contents:
            raise ValidationException("Uploaded file is empty")
        if len(contents) > settings.MAX_FILE_SIZE:
            raise ValidationException(
                f"File exceeds maximum size of {settings.MAX_FILE_SIZE} bytes"
            )
        await file.seek(0)
        return contents

    async def _save_local(
        self,
        *,
        category: str,
        file_name: str,
        contents: bytes,
    ) -> str:
        destination = self.upload_root / category / file_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(destination, "wb") as output:
            for index in range(0, len(contents), UPLOAD_CHUNK_SIZE):
                await output.write(contents[index : index + UPLOAD_CHUNK_SIZE])
        return f"/uploads/{category}/{file_name}"

    def _s3_client(self):
        if not settings.AWS_REGION or not settings.AWS_S3_BUCKET:
            raise ValidationException(
                "AWS_REGION and AWS_S3_BUCKET are required for S3 uploads"
            )

        return boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL or None,
        )

    def _save_s3(
        self,
        *,
        category: str,
        file_name: str,
        contents: bytes,
        content_type: str,
    ) -> str:
        object_key = f"{category}/{file_name}"
        try:
            client = self._s3_client()
            client.put_object(
                Bucket=settings.AWS_S3_BUCKET,
                Key=object_key,
                Body=contents,
                ContentType=content_type,
            )
        except (BotoCoreError, ClientError) as exc:
            raise ServiceException(f"Failed to upload file to S3: {str(exc)}") from exc

        if settings.AWS_S3_ENDPOINT_URL:
            endpoint = settings.AWS_S3_ENDPOINT_URL.rstrip("/")
            return f"{endpoint}/{settings.AWS_S3_BUCKET}/{object_key}"

        return (
            f"https://{settings.AWS_S3_BUCKET}.s3."
            f"{settings.AWS_REGION}.amazonaws.com/{object_key}"
        )

    async def upload_file(
        self,
        *,
        file: UploadFile,
        category: str,
        storage: str | None = None,
    ) -> UploadResponse:
        """Validate and upload a file to local storage or S3."""
        selected_storage = self._validate_storage(storage)
        file_name, extension = self._validate_file(file, category)
        contents = await self._read_file_bytes(file)
        content_type = file.content_type or "application/octet-stream"

        if selected_storage == "local":
            file_url = await self._save_local(
                category=category,
                file_name=file_name,
                contents=contents,
            )
        else:
            file_url = self._save_s3(
                category=category,
                file_name=file_name,
                contents=contents,
                content_type=content_type,
            )

        return UploadResponse(
            file_name=file_name,
            original_name=file.filename or file_name,
            file_url=file_url,
            file_size=len(contents),
            content_type=content_type,
            extension=extension,
            category=category,
            storage=selected_storage,
        )


storage_service = StorageService()
