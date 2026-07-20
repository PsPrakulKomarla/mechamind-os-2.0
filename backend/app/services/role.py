from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ValidationException
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.user_role import UserRole
from app.models.enums import AuditAction, EntityType
from app.repositories.role import role_repo
from app.repositories.permission import role_permission_repo, user_role_repo
from app.repositories.audit import audit_repo
from app.schemas.rbac import RoleCreate, RoleUpdate
from app.core.redis_rbac import redis_rbac

class RoleService:
    async def create(self, db: AsyncSession, obj_in: RoleCreate, user_id: UUID) -> Role:
        existing = await role_repo.get_by_name(db, name=obj_in.name)
        if existing and existing.organization_id == obj_in.organization_id:
            raise ValidationException(f"Role {obj_in.name} already exists in this organization")
            
        role = await role_repo.create(db=db, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db, user_id=user_id, organization_id=role.organization_id,
            action=AuditAction.CREATE, entity_type=EntityType.ROLE, entity_id=role.id
        )
        await db.commit()
        return role

    async def assign_permissions_to_role(self, db: AsyncSession, role_id: UUID, permission_ids: List[UUID], user_id: UUID) -> None:
        role = await role_repo.get(db, id=role_id)
        if not role:
            raise ValidationException("Role not found")
            
        await role_permission_repo.clear_permissions_for_role(db, role_id=role_id)
        
        for p_id in permission_ids:
            mapping = RolePermission(role_id=role_id, permission_id=p_id)
            db.add(mapping)
            
        await db.commit()
        await audit_repo.log_action(
            db=db, user_id=user_id,             action=AuditAction.UPDATE, entity_type=EntityType.ROLE, entity_id=role_id
        )
        await db.commit()

    async def assign_role_to_user(self, db: AsyncSession, user_id: UUID, role_id: UUID, admin_id: UUID) -> UserRole:
        role = await role_repo.get(db, id=role_id)
        if not role:
            raise ValidationException("Role not found")
            
        existing = await user_role_repo.get_mapping(db, user_id=user_id, role_id=role_id)
        if existing:
            return existing
            
        mapping = UserRole(user_id=user_id, role_id=role_id)
        db.add(mapping)
        await db.commit()
        await db.refresh(mapping)
        
        await redis_rbac.invalidate_user_permissions(str(user_id))
        
        await audit_repo.log_action(
            db=db, user_id=admin_id,             action=AuditAction.ROLE_ASSIGNED, entity_type=EntityType.USER, entity_id=user_id
        )
        await db.commit()

        return mapping

    async def remove_role_from_user(self, db: AsyncSession, user_id: UUID, role_id: UUID, admin_id: UUID) -> None:
        mapping = await user_role_repo.get_mapping(db, user_id=user_id, role_id=role_id)
        if mapping:
            await db.delete(mapping)
            await db.commit()
            await redis_rbac.invalidate_user_permissions(str(user_id))
            await audit_repo.log_action(
                db=db, user_id=admin_id, action=AuditAction.UPDATE, entity_type=EntityType.USER, entity_id=user_id
            )
            await db.commit()

role_service = RoleService()
