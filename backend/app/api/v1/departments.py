from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.schemas.response import APIResponse
from app.schemas.department import (
    DepartmentCreate, DepartmentUpdate, 
    DepartmentResponse, UserAssignment
)
from app.services.department import DepartmentService

router = APIRouter()

@router.post("", response_model=APIResponse[DepartmentResponse], dependencies=[Depends(RequirePermissions(["department.create"]))])
async def create_department(
    obj_in: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new department."""
    dept = await DepartmentService.create_department(db, obj_in, current_user)
    return APIResponse(message="Department created successfully", data=DepartmentResponse.model_validate(dept))

@router.get("/factory/{factory_id}", response_model=APIResponse[List[DepartmentResponse]])
async def list_departments_for_factory(
    factory_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List departments within a specific factory."""
    # Requires read access to the factory scope, simplified here for standard auth.
    depts = await DepartmentService.list_departments(db, factory_id=factory_id, skip=skip, limit=limit)
    data = [DepartmentResponse.model_validate(d) for d in depts]
    return APIResponse(message="Departments retrieved successfully", data=data)

@router.get("/{department_id}", response_model=APIResponse[DepartmentResponse], dependencies=[Depends(RequirePermissions(["department.read"]))])
async def get_department(
    department_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get department details."""
    dept = await DepartmentService.get_department(db, department_id)
    return APIResponse(message="Department retrieved successfully", data=DepartmentResponse.model_validate(dept))

@router.put("/{department_id}", response_model=APIResponse[DepartmentResponse], dependencies=[Depends(RequirePermissions(["department.update"]))])
async def update_department(
    department_id: UUID,
    obj_in: DepartmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update department information."""
    dept = await DepartmentService.update_department(db, department_id, obj_in, current_user)
    return APIResponse(message="Department updated successfully", data=DepartmentResponse.model_validate(dept))

@router.delete("/{department_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["department.delete"]))])
async def delete_department(
    department_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete a department."""
    await DepartmentService.delete_department(db, department_id, current_user)
    return APIResponse(message="Department deleted successfully", data=None)

@router.post("/{department_id}/users", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["department.update"]))])
async def assign_user_to_department(
    department_id: UUID,
    obj_in: UserAssignment,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign a user to the department with a specific role scope."""
    await DepartmentService.assign_user(db, department_id, obj_in, current_user)
    return APIResponse(message="User assigned to department successfully", data=None)

@router.delete("/{department_id}/users/{user_id}/roles/{role_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["department.update"]))])
async def remove_user_from_department(
    department_id: UUID,
    user_id: UUID,
    role_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a user's scoped role from the department."""
    await DepartmentService.remove_user(db, department_id, user_id, role_id, current_user)
    return APIResponse(message="User role removed from department successfully", data=None)
