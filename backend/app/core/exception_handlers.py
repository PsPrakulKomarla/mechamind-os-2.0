from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone

from app.core.exceptions import BaseAppException
from app.core.logging import get_logger

logger = get_logger("exception_handlers")

def get_utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

async def app_exception_handler(request: Request, exc: BaseAppException) -> JSONResponse:
    """Handle custom application exceptions."""
    logger.warning("Application exception", error=exc.message, details=exc.details, status_code=exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.__class__.__name__,
            "message": exc.message,
            "details": exc.details,
            "timestamp": get_utc_now_iso()
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle FastAPI/Pydantic validation errors."""
    details = {"errors": exc.errors()}
    logger.warning("Validation error", details=details)
    return JSONResponse(
        status_code=422,
        content={
            "error_code": "ValidationException",
            "message": "Validation failed",
            "details": details,
            "timestamp": get_utc_now_iso()
        }
    )


async def database_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handle generic database exceptions safely."""
    logger.error("Database exception", error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error_code": "DatabaseException",
            "message": "An internal database error occurred",
            "details": {},
            "timestamp": get_utc_now_iso()
        }
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unhandled exceptions."""
    logger.error("Unhandled exception", error=str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error_code": "InternalServerError",
            "message": "An unexpected error occurred",
            "details": {},
            "timestamp": get_utc_now_iso()
        }
    )
