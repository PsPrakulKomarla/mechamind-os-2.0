from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.exceptions import UnauthorizedException
from app.dependencies.db import get_db
from app.repositories.user import user_repo
from app.models.user import User
from app.schemas.token import TokenPayload

async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    """Dependency that ensures the user is authenticated via middleware and fetches the DB record."""
    payload: TokenPayload = getattr(request.state, "user_payload", None)
    
    if not payload:
        raise UnauthorizedException("Authentication required")
    
    try:
        user_id = UUID(payload.sub)
    except (ValueError, TypeError):
        raise UnauthorizedException("Invalid token payload")
        
    user = await user_repo.get(db, id=user_id)
    if not user:
        raise UnauthorizedException("User not found")
        
    return user
