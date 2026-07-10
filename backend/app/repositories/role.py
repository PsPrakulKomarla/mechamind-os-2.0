from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import Role
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class DummySchema(BaseModel):
    pass

class RoleRepository(BaseRepository[Role, DummySchema, DummySchema]):
    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[Role]:
        result = await db.execute(select(Role).where(Role.name == name))
        return result.scalars().first()

role_repo = RoleRepository(Role)
