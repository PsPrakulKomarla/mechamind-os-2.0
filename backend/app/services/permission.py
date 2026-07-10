from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ValidationException
from app.models.permission import Permission
from app.repositories.permission import permission_repo
from app.schemas.rbac import PermissionCreate, PermissionUpdate

class PermissionService:
    async def create(self, db: AsyncSession, obj_in: PermissionCreate) -> Permission:
        existing = await permission_repo.get_by_action_resource(db, action=obj_in.action, resource=obj_in.resource)
        if existing:
            raise ValidationException(f"Permission {obj_in.action} on {obj_in.resource} already exists")
        return await permission_repo.create(db=db, obj_in=obj_in)

    async def get(self, db: AsyncSession, id: UUID) -> Permission:
        obj = await permission_repo.get(db=db, id=id)
        if not obj:
            raise ValidationException("Permission not found")
        return obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Permission]:
        return await permission_repo.get_multi(db=db, skip=skip, limit=limit)

permission_service = PermissionService()
