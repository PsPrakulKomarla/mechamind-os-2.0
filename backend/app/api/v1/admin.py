from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List, Optional, Dict
from uuid import UUID
from datetime import datetime

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.schemas.response import APIResponse
from app.schemas.user import UserResponse
from app.schemas.rbac import RoleCreate, AssignPermissionRequest, AssignRoleRequest
from app.schemas.user import AdminUserCreate, UserUpdate
from app.schemas.admin import AdminDashboardStatsResponse
from app.models.user import User
from app.services.admin import admin_service

router = APIRouter(tags=["Admin"])


@router.get("/dashboard/stats", response_model=APIResponse[AdminDashboardStatsResponse], dependencies=[Depends(RequirePermissions(["admin.dashboard.read"]))])
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    stats = await admin_service.get_dashboard_stats(db=db, user_id=current_user.id)
    return APIResponse(data=stats)


@router.get("/system/health", response_model=APIResponse[dict])
async def get_system_health() -> Any:
    return APIResponse(data={
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "uptime": "active",
        "checks": {
            "database": "connected",
            "api": "operational",
            "auth": "working"
        }
    })


@router.get("/audit-logs", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.audit.read"]))])
async def get_audit_logs(
    start_date: Optional[datetime] = Query(None, alias="startDate"),
    end_date: Optional[datetime] = Query(None, alias="endDate"),
    user_id: Optional[UUID] = Query(None, alias="userId"),
    action: Optional[str] = Query(None, alias="action"),
    entity_type: Optional[str] = Query(None, alias="entityType"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    audit_filters = {
        "start_date": start_date,
        "end_date": end_date,
        "user_id": user_id,
        "action": action,
        "entity_type": entity_type,
        "skip": skip,
        "limit": limit
    }
    logs = await admin_service.get_audit_logs(db=db, filters=audit_filters, requesting_user_id=current_user.id)
    return APIResponse(data=logs)


@router.get("/settings", response_model=APIResponse[dict], dependencies=[Depends(RequirePermissions(["admin.settings.read"]))])
async def get_system_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    settings = await admin_service.get_system_settings(db=db, user_id=current_user.id)
    return APIResponse(data=settings)


@router.put("/settings", response_model=APIResponse[dict], dependencies=[Depends(RequirePermissions(["admin.settings.update"]))])
async def update_system_settings(
    request_data: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    settings = await admin_service.update_system_settings(db=db, obj_in=request_data, user_id=current_user.id)
    return APIResponse(data=settings)


@router.get("/users", response_model=APIResponse[List[UserResponse]], dependencies=[Depends(RequirePermissions(["admin.users.read"]))])
async def get_users(
    search: Optional[str] = Query(None, alias="search"),
    status: Optional[str] = Query(None, alias="status"),
    organization_id: Optional[UUID] = Query(None, alias="organizationId"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    user_filters = {
        "search": search,
        "status": status,
        "organization_id": organization_id,
        "skip": skip,
        "limit": limit
    }
    users = await admin_service.get_users(db=db, filters=user_filters, requesting_user_id=current_user.id)
    return APIResponse(data=users)


@router.post("/users", response_model=APIResponse[UserResponse], dependencies=[Depends(RequirePermissions(["admin.users.create"]))])
async def create_user(
    request_data: AdminUserCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    user = await admin_service.create_user(db=db, obj_in=request_data, requesting_user_id=current_user.id)
    return APIResponse(data=UserResponse.model_validate(user))


@router.put("/users/{user_id}", response_model=APIResponse[UserResponse], dependencies=[Depends(RequirePermissions(["admin.users.update"]))])
async def update_user(
    user_id: UUID,
    request_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    user = await admin_service.update_user(db=db, user_id=user_id, obj_in=request_data, requesting_user_id=current_user.id)
    return APIResponse(data=UserResponse.model_validate(user))


@router.delete("/users/{user_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["admin.users.delete"]))])
async def delete_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await admin_service.delete_user(db=db, user_id=user_id, requesting_user_id=current_user.id)
    return APIResponse(message="User deleted successfully")


@router.get("/roles", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.roles.read"]))])
async def get_roles(
    organization_id: Optional[UUID] = Query(None, alias="organizationId"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    role_filters = {
        "organization_id": organization_id,
        "skip": skip,
        "limit": limit
    }
    roles = await admin_service.get_roles(db=db, filters=role_filters, requesting_user_id=current_user.id)
    return APIResponse(data=roles)


@router.post("/roles", response_model=APIResponse[Any], dependencies=[Depends(RequirePermissions(["admin.roles.create"]))])
async def create_role(
    request_data: RoleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    role = await admin_service.create_role(db=db, obj_in=request_data, requesting_user_id=current_user.id)
    return APIResponse(data=role)


@router.post("/roles/{role_id}/permissions", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["admin.roles.permissions.assign"]))])
async def assign_permissions_to_role(
    role_id: UUID,
    request_data: AssignPermissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await admin_service.assign_permissions_to_role(
        db=db, role_id=role_id, permission_ids=request_data.permission_ids,
        requesting_user_id=current_user.id
    )
    return APIResponse(message="Permissions assigned successfully")


@router.get("/permissions", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.permissions.read"]))])
async def get_permissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    permissions = await admin_service.get_permissions(db=db, skip=skip, limit=limit, requesting_user_id=current_user.id)
    return APIResponse(data=permissions)


@router.post("/permissions", response_model=APIResponse[Any], dependencies=[Depends(RequirePermissions(["admin.permissions.create"]))])
async def create_permission(
    request_data: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    permission = await admin_service.create_permission(db=db, obj_in=request_data, requesting_user_id=current_user.id)
    return APIResponse(data=permission)


@router.post("/users/{user_id}/assign-role", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["admin.users.assign"]))])
async def assign_role_to_user(
    user_id: UUID,
    request_data: AssignRoleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await admin_service.assign_role_to_user(
        db=db, user_id=user_id, role_id=request_data.role_id,
        requesting_user_id=current_user.id
    )
    return APIResponse(message="Role assigned successfully")


@router.get("/permissions-summary", response_model=APIResponse[dict], dependencies=[Depends(RequirePermissions(["admin.permissions.read"]))])
async def get_permissions_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    summary = await admin_service.get_permissions_summary(db=db, requesting_user_id=current_user.id)
    return APIResponse(data=summary)


@router.get("/system-stats", response_model=APIResponse[dict], dependencies=[Depends(RequirePermissions(["admin.dashboard.read"]))])
async def get_system_stats(
    days: int = Query(30, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    stats = await admin_service.get_system_stats(db=db, days=days, requesting_user_id=current_user.id)
    return APIResponse(data=stats)


@router.post("/users/{user_id}/reset-password", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["admin.users.password.reset"]))])
async def reset_user_password(
    user_id: UUID,
    new_password: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await admin_service.reset_user_password(db=db, user_id=user_id, new_password=new_password, requesting_user_id=current_user.id)
    return APIResponse(message="User password reset successfully")


@router.post("/users/{user_id}/unlock", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["admin.users.unlock"]))])
async def unlock_user_account(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await admin_service.unlock_user_account(db=db, user_id=user_id, requesting_user_id=current_user.id)
    return APIResponse(message="User account unlocked successfully")


@router.get("/dashboard/activities", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.audit.read"]))])
async def get_dashboard_activities(
    hours: int = Query(24, ge=1, le=168),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    activities = await admin_service.get_dashboard_activities(db=db, hours=hours, requesting_user_id=current_user.id)
    return APIResponse(data=activities)


@router.get("/roles-summary", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.roles.read"]))])
async def get_roles_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    summary = await admin_service.get_roles_summary(db=db, requesting_user_id=current_user.id)
    return APIResponse(data=summary)


@router.get("/organizations-summary", response_model=APIResponse[List[Any]], dependencies=[Depends(RequirePermissions(["admin.organizations.read"]))])
async def get_organizations_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    summary = await admin_service.get_organizations_summary(db=db, requesting_user_id=current_user.id)
    return APIResponse(data=summary)
