"""
Prisma client initialization and management.
"""

import logging
from contextlib import asynccontextmanager

from prisma import Prisma, register

logger = logging.getLogger(__name__)

# Global Prisma instance
prisma_client = Prisma()
register(prisma_client)


async def ensure_gallery_schema():
    """Add gallery media columns when a local DB has not been migrated yet."""
    statements = [
        'ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "media_type" TEXT NOT NULL DEFAULT \'IMAGE\'',
        'ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "category" TEXT',
        'ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "thumbnail_url" TEXT',
        'ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT \'PUBLISHED\'',
        'ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "bucket_id" TEXT',
        """
        CREATE TABLE IF NOT EXISTS "GalleryBucket" (
            "id" TEXT PRIMARY KEY,
            "title" TEXT NOT NULL,
            "description" TEXT,
            "thumbnail_url" TEXT,
            "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
            "order" INTEGER NOT NULL DEFAULT 0,
            "uploader_id" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
        'CREATE INDEX IF NOT EXISTS "Gallery_media_type_idx" ON "Gallery"("media_type")',
        'CREATE INDEX IF NOT EXISTS "Gallery_category_idx" ON "Gallery"("category")',
        'CREATE INDEX IF NOT EXISTS "Gallery_status_idx" ON "Gallery"("status")',
        'CREATE INDEX IF NOT EXISTS "Gallery_bucket_id_idx" ON "Gallery"("bucket_id")',
        'CREATE INDEX IF NOT EXISTS "GalleryBucket_uploader_id_idx" ON "GalleryBucket"("uploader_id")',
        'CREATE INDEX IF NOT EXISTS "GalleryBucket_status_idx" ON "GalleryBucket"("status")',
        'CREATE INDEX IF NOT EXISTS "GalleryBucket_order_idx" ON "GalleryBucket"("order")',
    ]

    for statement in statements:
        await prisma_client.execute_raw(statement)


async def connect_db():
    """Connect to the database."""
    try:
        await prisma_client.connect()
        await ensure_gallery_schema()
        logger.info("Connected to database")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise


async def disconnect_db():
    """Disconnect from the database."""
    try:
        await prisma_client.disconnect()
        logger.info("Disconnected from database")
    except Exception as e:
        logger.error(f"Failed to disconnect from database: {e}")
        raise


@asynccontextmanager
async def get_db():
    """Get database context manager."""
    await connect_db()
    try:
        yield prisma_client
    finally:
        await disconnect_db()


def get_prisma() -> Prisma:
    """Get Prisma client instance."""
    return prisma_client
