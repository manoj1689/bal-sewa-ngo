"""
Custom exception classes for the application.
"""


class APIException(Exception):
    """Base exception class for API."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class NotFoundException(APIException):
    """Raised when a resource is not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND",
        )


class UnauthorizedException(APIException):
    """Raised when user is not authenticated."""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED",
        )


class ForbiddenException(APIException):
    """Raised when user doesn't have permission."""

    def __init__(self, message: str = "Access forbidden"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN",
        )


class ValidationException(APIException):
    """Raised when validation fails."""

    def __init__(self, message: str = "Validation failed", details: dict = None):
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
        )
        self.details = details or {}


class ConflictException(APIException):
    """Raised when there's a resource conflict."""

    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
        )


class RateLimitException(APIException):
    """Raised when rate limit is exceeded."""

    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
        )


class ServiceException(APIException):
    """Raised when service operation fails."""

    def __init__(self, message: str = "Service error"):
        super().__init__(
            message=message,
            status_code=500,
            error_code="SERVICE_ERROR",
        )


class DatabaseException(APIException):
    """Raised when database operation fails."""

    def __init__(self, message: str = "Database error"):
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR",
        )
