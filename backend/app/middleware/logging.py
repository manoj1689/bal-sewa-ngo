"""
Request/response logging middleware.
"""

import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses."""

    async def dispatch(
        self,
        request: Request,
        call_next,
    ) -> Response:
        """
        Process request and log details.

        Args:
            request: HTTP request
            call_next: Next middleware/handler

        Returns:
            HTTP response
        """
        # Start time
        start_time = time.time()

        # Log request
        logger.info(
            f"[REQUEST] {request.method} {request.url.path} - "
            f"IP: {request.client.host if request.client else 'unknown'}"
        )

        # Process request
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(f"[ERROR] Unhandled exception: {str(e)}", exc_info=True)
            raise

        # Calculate processing time
        process_time = time.time() - start_time

        # Log response
        logger.info(
            f"[RESPONSE] {request.method} {request.url.path} - "
            f"Status: {response.status_code} - Time: {process_time:.3f}s"
        )

        # Add response header
        response.headers["X-Process-Time"] = str(process_time)

        return response
