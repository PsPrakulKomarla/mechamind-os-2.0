from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.models.user_role import UserRole
from app.repositories.base import BaseRepository
from app.schemas.rbac import PermissionCreate, PermissionUpdate
from pydantic import BaseModel

class DummySchema(BaseModel):
    pass

class PermissionRepository(BaseRepository[Permission, PermissionCreate, PermissionUpdate]):
    async def get_by_action_resource(self, db: AsyncSession, *, action: str, resource: str) -> Optional[Permission]:
        result = await db.execute(
            select(Permission).where(Permission.action == action, Permission.resource == resource)
        )
        return result.scalars().first()

class RolePermissionRepository(BaseRepository[RolePermission, DummySchema, DummySchema]):
    async def get_permissions_for_role(self, db: AsyncSession, *, role_id: UUID) -> List[Permission]:
        result = await db.execute(
            select(Permission)
            .join(RolePermission)
            .where(RolePermission.role_id == role_id)
        )
        return list(result.scalars().all())
        
    async def clear_permissions_for_role(self, db: AsyncSession, *, role_id: UUID) -> None:
        result = await db.execute(select(RolePermission).where(RolePermission.role_id == role_id))
        mappings = result.scalars().all()
        for m in mappings:
            await db.delete(m)
        await db.commit()

class UserRoleRepository(BaseRepository[UserRole, DummySchema, DummySchema]):
    async def get_roles_for_user(self, db: AsyncSession, *, user_id: UUID) -> List[UserRole]:
        result = await db.execute(
            select(UserRole)
            .options(selectinload(UserRole.role))
            .where(UserRole.user_id == user_id)
        )
        return list(result.scalars().all())

    async def get_mapping(self, db: AsyncSession, *, user_id: UUID, role_id: UUID) -> Optional[UserRole]:
        result = await db.execute(
            select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id)
        )
        return result.scalars().first()

permission_repo = PermissionRepository(Permission)
role_permission_repo = RolePermissionRepository(RolePermission)
user_role_repo = UserRoleRepository(UserRole)
