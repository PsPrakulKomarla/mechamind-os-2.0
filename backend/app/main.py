from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import BaseAppException
from app.core.exception_handlers import (
    app_exception_handler,
    validation_exception_handler,
    database_exception_handler,
    global_exception_handler,
)
from app.middleware.request_id import RequestIDMiddleware
from app.api.router import api_router

# Initialize structured logging before app startup
setup_logging(environment=settings.ENVIRONMENT)
logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for FastAPI."""
    logger.info("Starting up MechaMind OS Backend...")
    # Add startup events here (e.g. warming up caches)
    yield
    logger.info("Shutting down MechaMind OS Backend...")
    # Add shutdown events here (e.g. closing Redis pool)


def create_app() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    from app.middleware.auth import AuthMiddleware
    from app.core.telemetry import configure_telemetry

    # Telemetry
    configure_telemetry(app)

    # Middlewares (Order matters)
    app.add_middleware(AuthMiddleware)
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Secure Headers Middleware
    @app.middleware("http")
    async def secure_headers_middleware(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    # Exception Handlers
    app.add_exception_handler(BaseAppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, database_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # API Routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_app()
