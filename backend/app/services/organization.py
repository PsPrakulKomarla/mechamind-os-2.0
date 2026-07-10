from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ValidationException
from app.models.organization import Organization
from app.models.user import User
from app.models.enums import AuditAction, EntityType
from app.repositories.organization import organization_repo
from app.repositories.audit_log import audit_repo
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationSettingsUpdate

class OrganizationService:
    @staticmethod
    async def get_organization(db: AsyncSession, org_id: UUID) -> Organization:
        org = await organization_repo.get(db, id=org_id)
        if not org or org.is_deleted:
            raise NotFoundException(message="Organization not found")
        return org

    @staticmethod
    async def list_organizations(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Organization]:
        # NOTE: A Global Admin sees all active organizations.
        return await organization_repo.get_active_multi(db, skip=skip, limit=limit)

    @staticmethod
    async def create_organization(db: AsyncSession, obj_in: OrganizationCreate, current_user: User) -> Organization:
        existing_org = await organization_repo.get_by_name(db, name=obj_in.name)
        if existing_org:
            raise ValidationException(message="Organization with this name already exists")
        
        org = await organization_repo.create(db, obj_in=obj_in)
        
        # Log creation
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.ORGANIZATION,
            entity_id=org.id,
            details={"name": org.name},
            ip_address=None
        )
        return org

    @staticmethod
    async def update_organization(db: AsyncSession, org_id: UUID, obj_in: OrganizationUpdate, current_user: User) -> Organization:
        org = await OrganizationService.get_organization(db, org_id)
        
        if obj_in.name and obj_in.name != org.name:
            existing_org = await organization_repo.get_by_name(db, name=obj_in.name)
            if existing_org:
                raise ValidationException(message="Organization with this name already exists")
                
        org = await organization_repo.update(db, db_obj=org, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.ORGANIZATION,
            entity_id=org.id,
            details={"updated_fields": obj_in.model_dump(exclude_unset=True)},
            ip_address=None
        )
        return org

    @staticmethod
    async def update_settings(db: AsyncSession, org_id: UUID, obj_in: OrganizationSettingsUpdate, current_user: User) -> Organization:
        org = await OrganizationService.get_organization(db, org_id)
        org = await organization_repo.update(db, db_obj=org, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.ORGANIZATION,
            entity_id=org.id,
            details={"settings_updated": obj_in.model_dump(exclude_unset=True)},
            ip_address=None
        )
        return org

    @staticmethod
    async def delete_organization(db: AsyncSession, org_id: UUID, current_user: User) -> None:
        org = await OrganizationService.get_organization(db, org_id)
        # Soft delete
        await organization_repo.update(db, db_obj=org, obj_in={"is_deleted": True})
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.DELETE,
            entity_type=EntityType.ORGANIZATION,
            entity_id=org.id,
            details={"name": org.name},
            ip_address=None
        )
