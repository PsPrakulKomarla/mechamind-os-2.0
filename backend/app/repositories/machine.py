from uuid import UUID
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from app.models.machine import Machine, MachineStatusHistory
from app.models.component import Component
from app.schemas.machine import MachineCreate, MachineUpdate
from app.models.enums import MachineStatus

class MachineRepository:
    async def create(self, db: AsyncSession, *, obj_in: MachineCreate) -> Machine:
        data = obj_in.model_dump(exclude={"manufacturer_id"})
        db_obj = Machine(**data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Initial status history entry
        status_entry = MachineStatusHistory(
            machine_id=db_obj.id,
            new_status=db_obj.operational_status,
            reason="Initial creation"
        )
        db.add(status_entry)
        await db.commit()
        
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[Machine]:
        query = select(Machine).options(
            selectinload(Machine.subsystems),
            selectinload(Machine.components),
            selectinload(Machine.location),
            selectinload(Machine.status_history)
        ).where(Machine.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_hierarchy(self, db: AsyncSession, id: UUID) -> Optional[Machine]:
        query = select(Machine).options(
            selectinload(Machine.components).selectinload(Component.installed_parts)
        ).where(Machine.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update(self, db: AsyncSession, *, db_obj: Machine, obj_in: MachineUpdate) -> Machine:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def add_status_history(self, db: AsyncSession, machine_id: UUID, old_status: MachineStatus, new_status: MachineStatus, reason: str, user_id: UUID):
        entry = MachineStatusHistory(
            machine_id=machine_id,
            old_status=old_status,
            new_status=new_status,
            reason=reason,
            changed_by_id=user_id
        )
        db.add(entry)
        await db.commit()

    async def search(
        self, 
        db: AsyncSession, 
        factory_id: UUID, 
        search_term: Optional[str] = None,
        department_id: Optional[UUID] = None,
        status: Optional[str] = None,
        criticality: Optional[str] = None,
        skip: int = 0, 
        limit: int = 50
    ) -> Tuple[List[Machine], int]:
        
        query = select(Machine).where(Machine.factory_id == factory_id)
        
        if search_term:
            query = query.where(
                or_(
                    Machine.name.ilike(f"%{search_term}%"),
                    Machine.machine_code.ilike(f"%{search_term}%"),
                    Machine.serial_number.ilike(f"%{search_term}%")
                )
            )
            
        if department_id:
            query = query.where(Machine.department_id == department_id)
            
        if status:
            query = query.where(Machine.operational_status == status)
            
        if criticality:
            query = query.where(Machine.criticality_level == criticality)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query)

        # Pagination
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.scalars().all()), total or 0
        
    async def delete(self, db: AsyncSession, id: UUID) -> None:
        db_obj = await self.get(db, id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()

machine_repo = MachineRepository()
