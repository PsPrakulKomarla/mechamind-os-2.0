from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.organization import Organization
from app.repositories.base import BaseRepository
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

class OrganizationRepository(BaseRepository[Organization, OrganizationCreate, OrganizationUpdate]):
    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[Organization]:
        result = await db.execute(
            select(Organization).where(
                func.lower(Organization.name) == name.lower(),
                Organization.is_deleted == False
            )
        )
        return result.scalars().first()
    
    async def get_active_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Organization]:
        result = await db.execute(
            select(Organization)
            .where(Organization.is_deleted == False)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

organization_repo = OrganizationRepository(Organization)
