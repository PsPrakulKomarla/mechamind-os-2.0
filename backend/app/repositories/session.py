from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.user_session import UserSession
from app.models.refresh_token import RefreshToken
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class DummySchema(BaseModel):
    pass

class SessionRepository(BaseRepository[UserSession, DummySchema, DummySchema]):
    async def get_by_token(self, db: AsyncSession, *, token: str) -> Optional[UserSession]:
        result = await db.execute(select(UserSession).where(UserSession.session_token == token))
        return result.scalars().first()
    
    async def revoke_all_for_user(self, db: AsyncSession, *, user_id: UUID) -> None:
        result = await db.execute(select(UserSession).where(UserSession.user_id == user_id, UserSession.is_revoked == False))
        sessions = result.scalars().all()
        for session in sessions:
            session.is_revoked = True
        await db.commit()

class RefreshTokenRepository(BaseRepository[RefreshToken, DummySchema, DummySchema]):
    async def get_by_token(self, db: AsyncSession, *, token: str) -> Optional[RefreshToken]:
        result = await db.execute(select(RefreshToken).where(RefreshToken.token == token))
        return result.scalars().first()

    async def revoke_all_for_user(self, db: AsyncSession, *, user_id: UUID) -> None:
        result = await db.execute(select(RefreshToken).where(RefreshToken.user_id == user_id, RefreshToken.is_revoked == False))
        tokens = result.scalars().all()
        for t in tokens:
            t.is_revoked = True
        await db.commit()

session_repo = SessionRepository(UserSession)
refresh_token_repo = RefreshTokenRepository(RefreshToken)
