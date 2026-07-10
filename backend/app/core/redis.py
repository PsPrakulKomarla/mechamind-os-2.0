import redis.asyncio as redis
from typing import AsyncGenerator
from app.core.config import settings

# Global Redis pool
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL,
    decode_responses=True
)

async def get_redis_client() -> AsyncGenerator[redis.Redis, None]:
    """Dependency to yield a Redis client."""
    client = redis.Redis.from_pool(redis_pool)
    try:
        yield client
    finally:
        await client.aclose()
