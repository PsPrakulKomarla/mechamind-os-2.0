import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.token import TokenPayload
from app.core.redis_security import redis_security
from app.core.exceptions import UnauthorizedException

class JWTService:
    """Enterprise-grade JWT manager."""
    
    def _create_token(
        self, 
        user_id: str, 
        token_type: str, 
        expires_delta: timedelta, 
        org_id: Optional[str] = None, 
        roles: list[str] = None, 
        permissions: list[str] = None
    ) -> str:
        now = datetime.now(timezone.utc)
        payload = TokenPayload(
            sub=user_id,
            jti=str(uuid.uuid4()),
            type=token_type,
            exp=now + expires_delta,
            iat=now,
            org_id=org_id,
            roles=roles or [],
            permissions=permissions or []
        )
        return jwt.encode(payload.model_dump(mode='json'), settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def create_access_token(self, user_id: str, org_id: Optional[str] = None, roles: list[str] = None) -> str:
        return self._create_token(
            user_id=user_id,
            token_type="access",
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            org_id=org_id,
            roles=roles
        )

    def create_refresh_token(self, user_id: str) -> str:
        return self._create_token(
            user_id=user_id,
            token_type="refresh",
            expires_delta=timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        )

    async def validate_token(self, token: str, expected_type: str = "access") -> TokenPayload:
        """Validate token signature, expiration, type, and check Redis blacklist."""
        try:
            decoded_dict = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            payload = TokenPayload(**decoded_dict)
        except jwt.ExpiredSignatureError:
            raise UnauthorizedException("Token has expired")
        except (jwt.PyJWTError, ValidationError):
            raise UnauthorizedException("Invalid token")
            
        if payload.type != expected_type:
            raise UnauthorizedException(f"Expected {expected_type} token")
            
        # Check Redis Blacklist
        if await redis_security.is_token_blacklisted(payload.jti):
            raise UnauthorizedException("Token has been revoked")
            
        return payload

    async def revoke_token(self, token: str) -> None:
        """Extract JTI and TTL from token and add to Redis blacklist."""
        try:
            decoded_dict = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_exp": False})
            payload = TokenPayload(**decoded_dict)
            
            # Calculate remaining time to live
            now = datetime.now(timezone.utc)
            ttl = int((payload.exp - now).total_seconds())
            if ttl > 0:
                await redis_security.blacklist_token(payload.jti, ttl)
        except (jwt.PyJWTError, ValidationError):
            pass  # If invalid, it can't be used anyway

jwt_service = JWTService()
