from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List
from uuid import UUID

from app.schemas.response import APIResponse
from app.schemas.rbac import RoleCreate, RoleResponse, AssignRoleRequest, AssignPermissionRequest
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.services.role import role_service
from app.repositories.role import role_repo
from app.models.user import User

router = APIRouter()

@router.post("", response_model=APIResponse[RoleResponse], dependencies=[Depends(RequirePermissions(["role.manage"]))])
async def create_role(
    request_data: RoleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    role = await role_service.create(db=db, obj_in=request_data, user_id=current_user.id)
    return APIResponse(data=RoleResponse.model_validate(role))

@router.get("", response_model=APIResponse[List[RoleResponse]], dependencies=[Depends(RequirePermissions(["role.read"]))])
async def get_roles(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    roles = await role_repo.get_multi(db=db, skip=skip, limit=limit)
    return APIResponse(data=[RoleResponse.model_validate(r) for r in roles])

@router.post("/{role_id}/permissions", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["role.manage"]))])
async def assign_permissions(
    role_id: UUID,
    request_data: AssignPermissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await role_service.assign_permissions_to_role(
        db=db, role_id=role_id, permission_ids=request_data.permission_ids, user_id=current_user.id
    )
    return APIResponse(message="Permissions assigned successfully")

@router.post("/users/{user_id}/assign", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["role.assign"]))])
async def assign_role_to_user(
    user_id: UUID,
    request_data: AssignRoleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await role_service.assign_role_to_user(
        db=db, user_id=user_id, role_id=request_data.role_id, admin_id=current_user.id
    )
    return APIResponse(message="Role assigned to user successfully")
