from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.component import Component, InstalledPartInstance, MachineSubsystem
from app.models.asset_master import PartDefinition
from app.schemas.component import ComponentCreate, SubsystemCreate, InstalledPartInstanceCreate, PartDefinitionCreate
from app.models.machine import Machine

class ComponentRepository:
    
    # === Subsystems ===
    async def create_subsystem(self, db: AsyncSession, *, obj_in: SubsystemCreate, machine_id: UUID) -> MachineSubsystem:
        db_obj = MachineSubsystem(**obj_in.model_dump(), machine_id=machine_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_subsystem(self, db: AsyncSession, id: UUID) -> Optional[MachineSubsystem]:
        query = select(MachineSubsystem).options(selectinload(MachineSubsystem.machine)).where(MachineSubsystem.id == id)
        result = await db.execute(query)
        return result.scalars().first()
        
    async def get_subsystems_by_machine(self, db: AsyncSession, machine_id: UUID) -> List[MachineSubsystem]:
        query = select(MachineSubsystem).where(MachineSubsystem.machine_id == machine_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    # === Components ===
    async def create_component(self, db: AsyncSession, *, obj_in: ComponentCreate) -> Component:
        db_obj = Component(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_component(self, db: AsyncSession, id: UUID) -> Optional[Component]:
        query = select(Component).options(
            selectinload(Component.machine),
            selectinload(Component.installed_parts)
        ).where(Component.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_components_by_subsystem(self, db: AsyncSession, subsystem_id: UUID) -> List[Component]:
        query = select(Component).where(Component.subsystem_id == subsystem_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    # === Parts ===
    async def create_part_definition(self, db: AsyncSession, *, obj_in: PartDefinitionCreate) -> PartDefinition:
        db_obj = PartDefinition(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def get_part_definition(self, db: AsyncSession, id: UUID) -> Optional[PartDefinition]:
        query = select(PartDefinition).where(PartDefinition.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def install_part(self, db: AsyncSession, *, obj_in: InstalledPartInstanceCreate) -> InstalledPartInstance:
        db_obj = InstalledPartInstance(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_installed_part(self, db: AsyncSession, id: UUID) -> Optional[InstalledPartInstance]:
        query = select(InstalledPartInstance).options(
            selectinload(InstalledPartInstance.component).selectinload(Component.machine)
        ).where(InstalledPartInstance.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_installed_parts_by_component(self, db: AsyncSession, component_id: UUID) -> List[InstalledPartInstance]:
        query = select(InstalledPartInstance).where(InstalledPartInstance.component_id == component_id)
        result = await db.execute(query)
        return list(result.scalars().all())

component_repo = ComponentRepository()
