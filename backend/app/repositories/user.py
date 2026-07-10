from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import EmailStr
import uuid

from app.repositories.base import BaseRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: EmailStr) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email, User.is_deleted == False))
        return result.scalars().first()
    
    async def get_by_auth_id(self, db: AsyncSession, *, auth_id: uuid.UUID) -> Optional[User]:
        result = await db.execute(select(User).where(User.auth_id == auth_id, User.is_deleted == False))
        return result.scalars().first()

user_repo = UserRepository(User)
