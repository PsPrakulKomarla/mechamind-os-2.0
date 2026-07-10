import json
import redis.asyncio as redis
from typing import Optional, Any
from app.core.config import settings

class RedisCacheService:
    """
    Redis caching layer to prevent re-embedding identical search queries
    or retrieving frequently accessed knowledge chunks from pgvector repeatedly.
    """
    
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.default_ttl = 3600 # 1 hour
        
    def _generate_key(self, prefix: str, identifier: str) -> str:
        return f"mechamind:{prefix}:{identifier}"
        
    async def get(self, prefix: str, identifier: str) -> Optional[Any]:
        key = self._generate_key(prefix, identifier)
        data = await self.redis.get(key)
        if data:
            return json.loads(data)
        return None
        
    async def set(self, prefix: str, identifier: str, data: Any, ttl: int = None):
        key = self._generate_key(prefix, identifier)
        await self.redis.set(key, json.dumps(data), ex=ttl or self.default_ttl)
        
    async def invalidate(self, prefix: str, identifier: str):
        key = self._generate_key(prefix, identifier)
        await self.redis.delete(key)

cache_service = RedisCacheService()
