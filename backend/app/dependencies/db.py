from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.core.logging import get_logger

logger = get_logger("db_dependency")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to yield a database session and ensure it closes."""
    session = AsyncSessionLocal()
    try:
        yield session
    except Exception as e:
        logger.error("Database session error", error=str(e))
        await session.rollback()
        raise
    finally:
        await session.close()
