from uuid import UUID
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.relationship import RelationshipCreate
from app.models.relationship import AssetRelationship
from app.models.enums import AuditAction, EntityType, ScopeType
from app.repositories.relationship import relationship_repo
from app.repositories.machine import machine_repo
from app.repositories.component import component_repo
from app.services.audit import audit_service
from app.services.authorization import AuthorizationService

class RelationshipService:
    
    async def _resolve_entity_factory(self, db: AsyncSession, entity_id: UUID, entity_type: EntityType) -> UUID:
        """
        Dynamically finds the factory_id of the entity to enforce tenant isolation.
        """
        if entity_type == EntityType.MACHINE:
            machine = await machine_repo.get(db, entity_id)
            if not machine: raise HTTPException(status_code=404, detail="Machine not found")
            return machine.factory_id
            
        elif entity_type in [EntityType.SUBSYSTEM, EntityType.COMPONENT, EntityType.INSTALLED_PART]:
            # For simplicity, we resolve through component (assuming a unified repo lookup, but here we explicitly use component repo)
            # In a real app, you'd route this perfectly. We'll check component here.
            component = await component_repo.get_component(db, entity_id)
            if component: return component.machine.factory_id
            
            subsystem = await component_repo.get_subsystem(db, entity_id)
            if subsystem: return subsystem.machine.factory_id
            
            installed_part = await component_repo.get_installed_part(db, entity_id)
            if installed_part: return installed_part.component.machine.factory_id
            
            raise HTTPException(status_code=404, detail="Entity not found")
            
        else:
            raise HTTPException(status_code=400, detail=f"Entity type {entity_type} not resolvable for factory scope yet")

    async def create_relationship(self, db: AsyncSession, obj_in: RelationshipCreate, user_id: UUID) -> AssetRelationship:
        # 1. Resolve source factory and validate auth
        factory_id = await self._resolve_entity_factory(db, obj_in.source_entity_id, obj_in.source_entity_type)
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(factory_id))

        # 2. Check for circular dependency before creating
        is_circular = await relationship_repo.check_circular_dependency(db, obj_in.source_entity_id, obj_in.target_entity_id)
        if is_circular:
            raise HTTPException(status_code=400, detail="Circular dependency detected. Cannot link these assets.")

        edge = await relationship_repo.create(db, obj_in=obj_in, user_id=user_id)
        
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.CREATE, entity_type=EntityType.MACHINE, entity_id=edge.id, details={"event": "RELATIONSHIP_CREATED"})
        return edge

    async def get_neighbors(self, db: AsyncSession, entity_id: UUID, entity_type: EntityType, user_id: UUID) -> List[AssetRelationship]:
        factory_id = await self._resolve_entity_factory(db, entity_id, entity_type)
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
        
        return await relationship_repo.get_neighbors(db, entity_id)

    async def get_dependencies(self, db: AsyncSession, entity_id: UUID, entity_type: EntityType, direction: str, user_id: UUID) -> List[Dict[str, Any]]:
        if direction not in ["upstream", "downstream"]:
            raise HTTPException(status_code=400, detail="Direction must be 'upstream' or 'downstream'")
            
        factory_id = await self._resolve_entity_factory(db, entity_id, entity_type)
        await AuthorizationService.authorize(db, user_id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
        
        return await relationship_repo.traverse_dependencies(db, entity_id, direction)

    async def delete_relationship(self, db: AsyncSession, id: UUID, user_id: UUID):
        edge = await relationship_repo.get(db, id)
        if not edge:
            raise HTTPException(status_code=404, detail="Relationship not found")
            
        factory_id = await self._resolve_entity_factory(db, edge.source_entity_id, edge.source_entity_type)
        await AuthorizationService.authorize(db, user_id, ["machine.update"], ScopeType.FACTORY, str(factory_id))
        
        await relationship_repo.soft_delete(db, id)
        await audit_service.log_action(db=db, user_id=user_id, action=AuditAction.DELETE, entity_type=EntityType.MACHINE, entity_id=id, details={"event": "RELATIONSHIP_DELETED"})

relationship_service = RelationshipService()
