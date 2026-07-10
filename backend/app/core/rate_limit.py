from fastapi import Request, HTTPException, status
import time
from app.core.redis import get_redis_client

class RateLimiter:
    """
    Redis-backed sliding window rate limiter.
    """
    def __init__(self, requests: int, window_seconds: int):
        self.requests = requests
        self.window_seconds = window_seconds

    async def __call__(self, request: Request):
        redis = await get_redis_client()
        
        # Use X-Forwarded-For if behind a proxy (like ingress)
        client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "127.0.0.1")
        key = f"rate_limit:{client_ip}:{request.url.path}"
        
        current_time = time.time()
        window_start = current_time - self.window_seconds
        
        pipeline = redis.pipeline()
        
        # Remove old requests
        pipeline.zremrangebyscore(key, 0, window_start)
        # Count requests in window
        pipeline.zcard(key)
        # Add current request
        pipeline.zadd(key, {str(current_time): current_time})
        # Set expiry to keep redis clean
        pipeline.expire(key, self.window_seconds)
        
        results = await pipeline.execute()
        request_count = results[1]
        
        if request_count >= self.requests:
            # Here we could theoretically trigger a SecurityEventLog for RATE_LIMIT_EXCEEDED
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
            
        return True
