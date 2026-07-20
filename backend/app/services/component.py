from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from datetime import datetime, timezone

from app.schemas.component import (
    SubsystemCreate, SubsystemUpdate, 
    ComponentCreate, ComponentUpdate,
    PartDefinitionCreate, InstalledPartInstanceCreate,
    PartReplacementRequest
)
from app.models.component import MachineSubsystem, Component, InstalledPartInstance
from app.models.asset_master import PartDefinition
from app.models.enums import AuditAction, EntityType, ConditionStatus, ScopeType
from app.repositories.component import component_repo
from app.repositories.machine import machine_repo
from app.services.audit import audit_service
from app.services.authorization import AuthorizationService

class ComponentService:
    
    # === Subsystems ===
    async def create_subsystem(self, db: AsyncSession, machine_id: UUID, obj_in: SubsystemCreate, user_id: UUID) -> MachineSubsystem:
        # Check authorization dynamically because factory_id is not in URL
        machine = await machine_repo.get(db, machine_id)
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
            
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(machine.factory_id))

        subsystem = await component_repo.create_subsystem(db, obj_in=obj_in, machine_id=machine_id)
        
        await audit_service.log_action(
            db=db, user_id=user_id, action=AuditAction.CREATE, entity_type=EntityType.MACHINE, # Or Subsystem
            entity_id=subsystem.id, details={"event": "SUBSYSTEM_CREATED"}
        )
        await db.commit()
        return subsystem

    async def get_subsystem(self, db: AsyncSession, id: UUID, user_id: UUID) -> MachineSubsystem:
        subsystem = await component_repo.get_subsystem(db, id)
        if not subsystem:
            raise HTTPException(status_code=404, detail="Subsystem not found")
            
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(subsystem.machine.factory_id))
        return subsystem

    # === Components ===
    async def create_component(self, db: AsyncSession, obj_in: ComponentCreate, user_id: UUID) -> Component:
        machine = await machine_repo.get(db, obj_in.machine_id)
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
            
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(machine.factory_id))

        component = await component_repo.create_component(db, obj_in=obj_in)
        
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.CREATE, entity_type=EntityType.MACHINE, entity_id=component.id)
        await db.commit()
        return component

    async def get_component(self, db: AsyncSession, id: UUID, user_id: UUID) -> Component:
        component = await component_repo.get_component(db, id)
        if not component:
            raise HTTPException(status_code=404, detail="Component not found")
            
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(component.machine.factory_id))
        return component

    # === Parts ===
    async def install_part(self, db: AsyncSession, obj_in: InstalledPartInstanceCreate, user_id: UUID) -> InstalledPartInstance:
        component = await self.get_component(db, obj_in.component_id, user_id) # Checks Auth internally
        
        installed_part = await component_repo.install_part(db, obj_in=obj_in)
        
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.CREATE, entity_type=EntityType.MACHINE, entity_id=installed_part.id, details={"event": "PART_INSTALLED"})
        await db.commit()
        return installed_part

    async def replace_part(self, db: AsyncSession, component_id: UUID, old_part_id: UUID, request: PartReplacementRequest, user_id: UUID) -> InstalledPartInstance:
        """
        The critical replacement logic: Retires the old part and installs the new part.
        """
        component = await self.get_component(db, component_id, user_id)
        
        # Verify permissions to modify the machine
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(component.machine.factory_id))

        old_part = await component_repo.get_installed_part(db, old_part_id)
        if not old_part or old_part.component_id != component_id:
            raise HTTPException(status_code=404, detail="Old part not found on this component")

        # 1. Retire old part
        old_part.condition = ConditionStatus.RETIRED
        old_part.replacement_date = datetime.now(timezone.utc)
        db.add(old_part)
        
        # 2. Create new part instance
        new_part_data = InstalledPartInstanceCreate(
            component_id=component_id,
            part_definition_id=request.new_part_definition_id,
            serial_number=request.new_serial_number,
            source_inventory_item_id=request.new_source_inventory_item_id
        )
        new_part = InstalledPartInstance(**new_part_data.model_dump())
        db.add(new_part)
        
        await db.commit()
        await db.refresh(new_part)
        
        await audit_service.log_action(
            db=db, user_id=user_id, action=AuditAction.UPDATE, entity_type=EntityType.MACHINE, 
            entity_id=component_id, 
            details={
                "event": "PART_REPLACED",
                "old_part_id": str(old_part_id),
                "new_part_id": str(new_part.id),
                "reason": request.reason
            }
        )
        await db.commit()
        return new_part

component_service = ComponentService()
