from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ValidationException
from app.models.factory import Factory
from app.models.user import User
from app.models.enums import AuditAction, EntityType
from app.repositories.factory import factory_repo
from app.repositories.organization import organization_repo
from app.repositories.audit import audit_repo
from app.schemas.factory import FactoryCreate, FactoryUpdate, FactorySettingsUpdate

class FactoryService:
    @staticmethod
    async def get_factory(db: AsyncSession, factory_id: UUID) -> Factory:
        factory = await factory_repo.get(db, id=factory_id)
        if not factory or factory.is_deleted:
            raise NotFoundException(message="Factory not found")
        return factory

    @staticmethod
    async def list_factories(db: AsyncSession, user: User, skip: int = 0, limit: int = 100) -> List[Factory]:
        # For Phase 8.3 we stub out global admin checks, assuming true for superadmins.
        is_global = True  # Replace with actual RBAC check 
        return await factory_repo.get_accessible_multi(db, user_id=user.id, is_global_admin=is_global, skip=skip, limit=limit)

    @staticmethod
    async def create_factory(db: AsyncSession, obj_in: FactoryCreate, current_user: User) -> Factory:
        # Validate Organization
        org = await organization_repo.get(db, id=obj_in.organization_id)
        if not org or org.is_deleted:
            raise ValidationException(message="Invalid Organization ID")

        # Validate Factory Code uniqueness
        if obj_in.factory_code:
            existing_fac = await factory_repo.get_by_code(db, factory_code=obj_in.factory_code, organization_id=obj_in.organization_id)
            if existing_fac:
                raise ValidationException(message="Factory code already exists in this organization")

        factory = await factory_repo.create(db, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.FACTORY,
            entity_id=factory.id,
            changes={"name": factory.name, "organization_id": str(factory.organization_id)},
            ip_address=None
        )
        await db.commit()
        return factory

    @staticmethod
    async def update_factory(db: AsyncSession, factory_id: UUID, obj_in: FactoryUpdate, current_user: User) -> Factory:
        factory = await FactoryService.get_factory(db, factory_id)
        
        if obj_in.factory_code and obj_in.factory_code != factory.factory_code:
            existing_fac = await factory_repo.get_by_code(db, factory_code=obj_in.factory_code, organization_id=factory.organization_id)
            if existing_fac:
                raise ValidationException(message="Factory code already exists in this organization")
                
        factory = await factory_repo.update(db, db_obj=factory, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.FACTORY,
            entity_id=factory.id,
            changes={"updated_fields": obj_in.model_dump(exclude_unset=True)},
            ip_address=None
        )
        await db.commit()
        return factory

    @staticmethod
    async def update_settings(db: AsyncSession, factory_id: UUID, obj_in: FactorySettingsUpdate, current_user: User) -> Factory:
        factory = await FactoryService.get_factory(db, factory_id)
        
        # Merge settings or overwrite
        new_settings = obj_in.settings.model_dump(exclude_unset=True)
        current_settings = factory.settings or {}
        current_settings.update(new_settings)
        
        factory = await factory_repo.update(db, db_obj=factory, obj_in={"settings": current_settings})
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.FACTORY,
            entity_id=factory.id,
            changes={"settings_updated": new_settings},
            ip_address=None
        )
        await db.commit()
        return factory

    @staticmethod
    async def delete_factory(db: AsyncSession, factory_id: UUID, current_user: User) -> None:
        factory = await FactoryService.get_factory(db, factory_id)
        
        await factory_repo.update(db, db_obj=factory, obj_in={"is_deleted": True})
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.DELETE,
            entity_type=EntityType.FACTORY,
            entity_id=factory.id,
            changes={"name": factory.name},
            ip_address=None
        )
        await db.commit()
