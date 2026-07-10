from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.component import Component, InstalledPartInstance
from app.schemas.component import ComponentCreate

class ComponentRepository:
    async def create(self, db: AsyncSession, *, obj_in: ComponentCreate) -> Component:
        db_obj = Component(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[Component]:
        query = select(Component).options(
            selectinload(Component.installed_parts)
        ).where(Component.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_machine(self, db: AsyncSession, machine_id: UUID) -> List[Component]:
        query = select(Component).where(Component.machine_id == machine_id)
        result = await db.execute(query)
        return list(result.scalars().all())

component_repo = ComponentRepository()
