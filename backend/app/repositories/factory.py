from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.factory import Factory
from app.repositories.base import BaseRepository
from app.schemas.factory import FactoryCreate, FactoryUpdate

class FactoryRepository(BaseRepository[Factory, FactoryCreate, FactoryUpdate]):
    async def get_by_code(self, db: AsyncSession, *, factory_code: str, organization_id: UUID) -> Optional[Factory]:
        result = await db.execute(
            select(Factory).where(
                func.lower(Factory.factory_code) == factory_code.lower(),
                Factory.organization_id == organization_id,
                Factory.is_deleted == False
            )
        )
        return result.scalars().first()
    
    async def get_accessible_multi(self, db: AsyncSession, *, user_id: UUID, is_global_admin: bool = False, skip: int = 0, limit: int = 100) -> List[Factory]:
        # For Phase 8.3, if is_global_admin is true, return all. Otherwise, we would filter by UserFactoryRole.
        # This will be fully enforced when we build the query filter layer.
        query = select(Factory).where(Factory.is_deleted == False).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

factory_repo = FactoryRepository(Factory)
