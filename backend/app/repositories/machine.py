from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.machine import Machine
from app.schemas.machine import MachineCreate, MachineUpdate

class MachineRepository:
    async def create(self, db: AsyncSession, *, obj_in: MachineCreate) -> Machine:
        db_obj = Machine(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[Machine]:
        query = select(Machine).options(
            selectinload(Machine.subsystems),
            selectinload(Machine.components),
            selectinload(Machine.location)
        ).where(Machine.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_factory(self, db: AsyncSession, factory_id: UUID) -> List[Machine]:
        query = select(Machine).where(Machine.factory_id == factory_id)
        result = await db.execute(query)
        return list(result.scalars().all())

machine_repo = MachineRepository()
