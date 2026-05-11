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


async def connect_db():
    """Connect to the database."""
    try:
        await prisma_client.connect()
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
