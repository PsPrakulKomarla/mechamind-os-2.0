from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.response import APIResponse
from app.schemas.rbac import PermissionCreate, PermissionResponse, PermissionCheckRequest
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.services.permission import permission_service
from app.services.rbac import rbac_service
from app.models.user import User

router = APIRouter()

@router.post("", response_model=APIResponse[PermissionResponse], dependencies=[Depends(RequirePermissions(["permission.manage"]))])
async def create_permission(
    request_data: PermissionCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    perm = await permission_service.create(db=db, obj_in=request_data)
    return APIResponse(data=PermissionResponse.model_validate(perm))

@router.get("", response_model=APIResponse[List[PermissionResponse]], dependencies=[Depends(RequirePermissions(["permission.read"]))])
async def get_permissions(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    perms = await permission_service.get_multi(db=db, skip=skip, limit=limit)
    return APIResponse(data=[PermissionResponse.model_validate(p) for p in perms])

@router.post("/check", response_model=APIResponse[bool])
async def check_access(
    request_data: PermissionCheckRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Utility endpoint for frontends to check if current user has a specific permission."""
    has_access = await rbac_service.check_access(
        db=db, user_id=current_user.id, required_permissions=[f"{request_data.resource}.{request_data.action}"]
    )
    return APIResponse(data=has_access)
