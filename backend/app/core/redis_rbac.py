import json
import redis.asyncio as redis
from typing import List, Optional

from app.core.config import settings

class RedisRBACManager:
    """Manages Redis caching for User Permissions and Roles."""
    
    def __init__(self):
        self.redis_pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)
        
    def _get_client(self) -> redis.Redis:
        return redis.Redis.from_pool(self.redis_pool)

    def _cache_key(self, user_id: str) -> str:
        return f"user_permissions:{user_id}"

    async def get_user_permissions(self, user_id: str) -> Optional[List[str]]:
        """Retrieve cached permissions for a user."""
        client = self._get_client()
        data = await client.get(self._cache_key(user_id))
        await client.aclose()
        if data:
            return json.loads(data)
        return None

    async def cache_user_permissions(self, user_id: str, permissions: List[str]) -> None:
        """Cache user permissions for 1 hour."""
        client = self._get_client()
        await client.setex(
            self._cache_key(user_id),
            3600,  # 1 hour
            json.dumps(permissions)
        )
        await client.aclose()

    async def invalidate_user_permissions(self, user_id: str) -> None:
        """Clear a specific user's cached permissions."""
        client = self._get_client()
        await client.delete(self._cache_key(user_id))
        await client.aclose()

redis_rbac = RedisRBACManager()
