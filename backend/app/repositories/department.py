from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.department import Department
from app.repositories.base import BaseRepository
from app.schemas.department import DepartmentCreate, DepartmentUpdate

class DepartmentRepository(BaseRepository[Department, DepartmentCreate, DepartmentUpdate]):
    async def get_by_name(self, db: AsyncSession, *, name: str, factory_id: UUID) -> Optional[Department]:
        result = await db.execute(
            select(Department).where(
                func.lower(Department.name) == name.lower(),
                Department.factory_id == factory_id,
                Department.is_deleted == False
            )
        )
        return result.scalars().first()
    
    async def get_accessible_multi(self, db: AsyncSession, *, factory_id: UUID, skip: int = 0, limit: int = 100) -> List[Department]:
        # Simple fetch bounded by factory_id
        query = select(Department).where(
            Department.factory_id == factory_id, 
            Department.is_deleted == False
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())

department_repo = DepartmentRepository(Department)
