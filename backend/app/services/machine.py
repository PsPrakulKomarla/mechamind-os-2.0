from uuid import UUID
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import json

from app.schemas.machine import MachineCreate, MachineUpdate, MachineStatusUpdate
from app.models.machine import Machine
from app.repositories.machine import machine_repo
from app.repositories.department import department_repo
from app.services.audit import audit_service
from app.models.enums import AuditAction, EntityType
from app.services.redis import redis_client
from app.core.config import settings

class MachineService:
    
    async def create_machine(self, db: AsyncSession, machine_in: MachineCreate, user_id: UUID) -> Machine:
        # Validate department belongs to factory if provided
        if machine_in.department_id:
            dept = await department_repo.get(db, machine_in.department_id)
            if not dept or dept.factory_id != machine_in.factory_id:
                raise HTTPException(status_code=400, detail="Department does not belong to the specified factory")

        machine = await machine_repo.create(db, obj_in=machine_in)
        
        await audit_service.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.CREATE,
            entity_type=EntityType.MACHINE, # Assume added to enum
            entity_id=machine.id,
            details={"factory_id": str(machine.factory_id), "status": machine.operational_status}
        )
        await db.commit()

        # Invalidate factory asset count cache
        await redis_client.delete(f"factory:{machine.factory_id}:machine_count")
        
        return machine

    async def get_machine(self, db: AsyncSession, machine_id: UUID) -> Optional[Machine]:
        machine = await machine_repo.get(db, machine_id)
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
        return machine

    async def get_hierarchy(self, db: AsyncSession, machine_id: UUID) -> Optional[Machine]:
        machine = await machine_repo.get_hierarchy(db, machine_id)
        if not machine:
            raise HTTPException(status_code=404, detail="Machine not found")
        return machine

    async def search_machines(
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
        
        # Redis caching for raw count if no filters are applied
        cache_key = f"factory:{factory_id}:machine_count"
        if not any([search_term, department_id, status, criticality]):
            cached_count = await redis_client.get(cache_key)
            if cached_count:
                machines, _ = await machine_repo.search(db, factory_id, skip=skip, limit=limit)
                return machines, int(cached_count)
                
        machines, total = await machine_repo.search(
            db, factory_id, search_term, department_id, status, criticality, skip, limit
        )

        if not any([search_term, department_id, status, criticality]):
            await redis_client.set(cache_key, str(total), ex=3600)

        return machines, total

    async def update_machine(self, db: AsyncSession, machine_id: UUID, machine_in: MachineUpdate, user_id: UUID) -> Machine:
        machine = await self.get_machine(db, machine_id)
        
        updated_machine = await machine_repo.update(db, db_obj=machine, obj_in=machine_in)
        
        await audit_service.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.MACHINE,
            entity_id=machine.id,
            details={"updated_fields": machine_in.model_dump(exclude_unset=True)}
        )
        await db.commit()
        return updated_machine

    async def update_status(self, db: AsyncSession, machine_id: UUID, status_in: MachineStatusUpdate, user_id: UUID) -> Machine:
        machine = await self.get_machine(db, machine_id)
        
        old_status = machine.operational_status
        if old_status == status_in.status:
            return machine # No change
            
        machine.operational_status = status_in.status
        db.add(machine)
        await db.commit()
        await db.refresh(machine)
        
        await machine_repo.add_status_history(
            db=db, 
            machine_id=machine_id, 
            old_status=old_status, 
            new_status=status_in.status, 
            reason=status_in.reason or "Status changed via API", 
            user_id=user_id
        )
        
        await audit_service.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.MACHINE,
            entity_id=machine.id,
            details={"event": "STATUS_CHANGE", "old": old_status, "new": status_in.status}
        )
        await db.commit()
        
        return machine

    async def delete_machine(self, db: AsyncSession, machine_id: UUID, user_id: UUID):
        machine = await self.get_machine(db, machine_id)
        factory_id = machine.factory_id
        await machine_repo.delete(db, machine_id)
        
        await audit_service.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.DELETE,
            entity_type=EntityType.MACHINE,
            entity_id=machine_id
        )
        await db.commit()
        
        await redis_client.delete(f"factory:{factory_id}:machine_count")

machine_service = MachineService()
