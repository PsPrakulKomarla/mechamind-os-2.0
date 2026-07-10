from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.machine import (
    MachineCreate, 
    MachineUpdate, 
    MachineResponse, 
    MachineDetailResponse,
    MachineHierarchyResponse,
    MachineStatusUpdate
)
from app.services.machine import machine_service

router = APIRouter(tags=["Machines"])

@router.post("/", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
async def create_machine(
    machine_in: MachineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new machine in a factory.
    Requires `machine.create` permission at the FACTORY scope.
    Note: We manually check the scope because the factory_id is in the body, not path.
    """
    # For body payloads, we validate via AuthorizationService directly or we can map it via a custom dependency wrapper.
    # To keep it standard FastAPI, we use the dependency on the router where possible, but here we invoke service.
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.create"], ScopeType.FACTORY, str(machine_in.factory_id))
    
    return await machine_service.create_machine(db, machine_in, current_user.id)

@router.get("/factory/{factory_id}", response_model=dict)
async def list_machines(
    factory_id: UUID,
    search: Optional[str] = None,
    department_id: Optional[UUID] = None,
    status: Optional[str] = None,
    criticality: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequirePermissions(["machine.read"], ScopeType.FACTORY, "factory_id"))
):
    """
    Search and filter machines in a specific factory.
    Guarded by FACTORY scoped RequirePermissions middleware.
    """
    machines, total = await machine_service.search_machines(
        db, factory_id, search, department_id, status, criticality, skip, limit
    )
    
    return {
        "data": machines,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{machine_id}", response_model=MachineDetailResponse)
async def get_machine(
    machine_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete machine profile including location and status history"""
    machine = await machine_service.get_machine(db, machine_id)
    # Auth check: User must have read access to the factory owning this machine.
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(machine.factory_id))
    
    return machine

@router.get("/{machine_id}/hierarchy", response_model=MachineHierarchyResponse)
async def get_machine_hierarchy(
    machine_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deep nested API returning Machine -> Components -> Installed Parts"""
    machine = await machine_service.get_hierarchy(db, machine_id)
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(machine.factory_id))
    return machine

@router.put("/{machine_id}", response_model=MachineResponse)
async def update_machine(
    machine_id: UUID,
    machine_in: MachineUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    machine = await machine_service.get_machine(db, machine_id)
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.update"], ScopeType.FACTORY, str(machine.factory_id))
    
    return await machine_service.update_machine(db, machine_id, machine_in, current_user.id)

@router.post("/{machine_id}/status", response_model=MachineResponse)
async def update_machine_status(
    machine_id: UUID,
    status_in: MachineStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    machine = await machine_service.get_machine(db, machine_id)
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.update"], ScopeType.FACTORY, str(machine.factory_id))
    
    return await machine_service.update_status(db, machine_id, status_in, current_user.id)

@router.delete("/{machine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_machine(
    machine_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    machine = await machine_service.get_machine(db, machine_id)
    from app.services.authorization import AuthorizationService
    await AuthorizationService.authorize(db, current_user.id, ["machine.delete"], ScopeType.FACTORY, str(machine.factory_id))
    
    await machine_service.delete_machine(db, machine_id, current_user.id)
