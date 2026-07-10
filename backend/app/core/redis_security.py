import redis.asyncio as redis
from typing import Optional

from app.core.config import settings

class RedisSecurityManager:
    """Manages Redis-backed security features like token blacklists and brute-force protection."""
    
    def __init__(self):
        self.redis_pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)
        
    def _get_client(self) -> redis.Redis:
        return redis.Redis.from_pool(self.redis_pool)

    # --- Token Blacklist ---
    
    async def blacklist_token(self, jti: str, expires_in_seconds: int) -> None:
        """Add a token JTI to the blacklist until its natural expiration."""
        client = self._get_client()
        await client.setex(f"blacklist:{jti}", expires_in_seconds, "revoked")
        await client.aclose()

    async def is_token_blacklisted(self, jti: str) -> bool:
        """Check if a token JTI is blacklisted."""
        client = self._get_client()
        result = await client.exists(f"blacklist:{jti}")
        await client.aclose()
        return result > 0

    # --- Brute Force Protection ---
    
    async def record_failed_login(self, email: str) -> int:
        """Increment failed login attempts and return the new count."""
        client = self._get_client()
        key = f"login_attempts:{email}"
        attempts = await client.incr(key)
        if attempts == 1:
            await client.expire(key, settings.LOCKOUT_MINUTES * 60)
        await client.aclose()
        return attempts

    async def clear_login_attempts(self, email: str) -> None:
        """Clear failed login attempts upon successful login."""
        client = self._get_client()
        await client.delete(f"login_attempts:{email}")
        await client.aclose()

    async def is_locked_out(self, email: str) -> bool:
        """Check if an account is temporarily locked out."""
        client = self._get_client()
        attempts = await client.get(f"login_attempts:{email}")
        await client.aclose()
        if attempts and int(attempts) >= settings.MAX_LOGIN_ATTEMPTS:
            return True
        return False

redis_security = RedisSecurityManager()
