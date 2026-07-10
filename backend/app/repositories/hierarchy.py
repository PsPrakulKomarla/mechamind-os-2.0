from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.factory import Factory
from app.models.department import Department
from app.models.team import Team
from app.repositories.base import BaseRepository
from app.schemas.hierarchy import (
    FactoryCreate, FactoryUpdate, 
    DepartmentCreate, DepartmentUpdate, 
    TeamCreate, TeamUpdate
)

class FactoryRepository(BaseRepository[Factory, FactoryCreate, FactoryUpdate]):
    async def get_by_org(self, db: AsyncSession, *, organization_id: UUID, skip: int = 0, limit: int = 100) -> List[Factory]:
        result = await db.execute(
            select(Factory).where(Factory.organization_id == organization_id, Factory.is_deleted == False).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

class DepartmentRepository(BaseRepository[Department, DepartmentCreate, DepartmentUpdate]):
    async def get_by_factory(self, db: AsyncSession, *, factory_id: UUID, skip: int = 0, limit: int = 100) -> List[Department]:
        result = await db.execute(
            select(Department).where(Department.factory_id == factory_id, Department.is_deleted == False).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

class TeamRepository(BaseRepository[Team, TeamCreate, TeamUpdate]):
    async def get_by_department(self, db: AsyncSession, *, department_id: UUID, skip: int = 0, limit: int = 100) -> List[Team]:
        result = await db.execute(
            select(Team).where(Team.department_id == department_id, Team.is_deleted == False).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

factory_repo = FactoryRepository(Factory)
department_repo = DepartmentRepository(Department)
team_repo = TeamRepository(Team)
