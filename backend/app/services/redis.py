"""Best-effort Redis cache used by domain services.

Cache outages must not make primary database operations fail. Health checks continue
to use the strict dependency in ``app.core.redis``.
"""

import logging
from typing import Any, Optional

import redis.asyncio as redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)


class ResilientRedisClient:
    def __init__(self) -> None:
        self._client = redis.from_url(settings.REDIS_URL, decode_responses=True)

    async def get(self, key: str) -> Optional[str]:
        try:
            return await self._client.get(key)
        except RedisError as exc:
            logger.warning("Redis cache read failed for %s: %s", key, exc)
            return None

    async def set(self, key: str, value: Any, **kwargs: Any) -> bool:
        try:
            return bool(await self._client.set(key, value, **kwargs))
        except RedisError as exc:
            logger.warning("Redis cache write failed for %s: %s", key, exc)
            return False

    async def delete(self, *keys: str) -> int:
        try:
            return int(await self._client.delete(*keys))
        except RedisError as exc:
            logger.warning("Redis cache invalidation failed for %s: %s", keys, exc)
            return 0

    async def close(self) -> None:
        await self._client.aclose()


redis_client = ResilientRedisClient()
