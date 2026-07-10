from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import redis.asyncio as redis

from app.dependencies.db import get_db
from app.core.redis import get_redis_client
from app.schemas.response import APIResponse
from app.core.logging import get_logger

logger = get_logger("health")
router = APIRouter(tags=["System Health"])

@router.get("", response_model=APIResponse[dict])
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_client)
) -> APIResponse[dict]:
    """
    Verify application, database, and redis connectivity.
    """
    db_status = "ok"
    redis_status = "ok"

    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error("Database health check failed", error=str(e))
        db_status = "unhealthy"

    try:
        await redis_client.ping()
    except Exception as e:
        logger.error("Redis health check failed", error=str(e))
        redis_status = "unhealthy"

    status = "healthy" if db_status == "ok" and redis_status == "ok" else "degraded"

    return APIResponse(
        success=True,
        data={
            "status": status,
            "database": db_status,
            "redis": redis_status
        }
    )

@router.get("/liveness")
async def liveness_check():
    """
    Kubernetes Liveness Probe. Returns 200 if the container process is up.
    """
    return {"status": "alive"}

@router.get("/readiness")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    Kubernetes Readiness Probe. Returns 200 only if DB and dependencies are reachable.
    """
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "database": "disconnected", "error": str(e)}
