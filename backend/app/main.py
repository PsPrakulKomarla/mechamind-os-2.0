from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import BaseAppException
from app.core.exception_handlers import (
    app_exception_handler,
    validation_exception_handler,
    database_exception_handler,
    global_exception_handler,
)
from app.core.security import get_password_hash
from app.middleware.request_id import RequestIDMiddleware
from app.api.router import api_router
from app.db.session import AsyncSessionLocal as async_session_maker
from app.models.user import User
from app.models.organization import Organization
from app.models.role import Role
from app.models.user_role import UserRole

# Initialize structured logging before app startup
setup_logging(environment=settings.ENVIRONMENT)
logger = get_logger("main")


async def seed_admin_user():
    """Seed the factory owner admin user on startup."""
    async with async_session_maker() as db:
        # Check if admin user already exists
        result = await db.execute(select(User).where(User.email == "admin@gmail.com"))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            logger.info("Admin user already exists")
            return
        
        # Create organization
        org = Organization(name="MechaMind Factory")
        db.add(org)
        await db.flush()
        
        # Create admin user
        admin_user = User(
            email="admin@gmail.com",
            password_hash=get_password_hash("qwertyuiop"),
            first_name="Factory",
            last_name="Owner",
            organization_id=org.id,
            is_active=True,
        )
        db.add(admin_user)
        await db.flush()
        
        # Get or create SUPER_ADMIN role
        role_result = await db.execute(select(Role).where(Role.name == "SUPER_ADMIN"))
        super_admin_role = role_result.scalar_one_or_none()
        
        if not super_admin_role:
            super_admin_role = Role(name="SUPER_ADMIN", description="Super Administrator")
            db.add(super_admin_role)
            await db.flush()
        
        # Assign SUPER_ADMIN role to admin user
        user_role = UserRole(user_id=admin_user.id, role_id=super_admin_role.id)
        db.add(user_role)
        
        await db.commit()
        logger.info("Factory owner admin user seeded successfully")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for FastAPI."""
    logger.info("Starting up MechaMind OS Backend...")
    # Seed admin user on startup
    await seed_admin_user()
    yield
    logger.info("Shutting down MechaMind OS Backend...")


def create_app() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
        max_content_length=settings.MAX_CONTENT_LENGTH,
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
