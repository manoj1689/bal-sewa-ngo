"""
Global exception handlers for FastAPI.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.exceptions import APIException
from app.schemas.base import StandardResponse, ValidationErrorResponse, ErrorDetail

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI):
    """
    Register global exception handlers for the FastAPI application.

    Args:
        app: FastAPI instance
    """

    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException):
        """Handle custom API exceptions."""
        logger.error(
            f"API Exception: {exc.error_code} - {exc.message}",
            extra={"path": request.url.path, "status_code": exc.status_code},
        )

        response = StandardResponse(
            status="error",
            message=exc.message,
            error_code=exc.error_code,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=response.model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        """Handle request validation errors."""
        logger.warning(
            f"Validation Error: {request.method} {request.url.path}",
            extra={"errors": exc.errors()},
        )

        errors = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"][1:])
            errors.append(
                ErrorDetail(
                    field=field,
                    message=error["msg"],
                )
            )

        response = ValidationErrorResponse(
            details=errors,
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=response.model_dump(),
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions."""
        logger.exception(
            f"Unexpected Exception: {str(exc)}",
            extra={"path": request.url.path},
        )

        response = StandardResponse(
            status="error",
            message="Internal server error",
            error_code="INTERNAL_ERROR",
        )

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=response.model_dump(),
        )
