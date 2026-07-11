from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.schemas.response import APIResponse
from app.schemas.factory import (
    FactoryCreate, FactoryUpdate, 
    FactoryResponse, FactorySettingsUpdate, FactorySettings
)
from app.services.factory import FactoryService

router = APIRouter()

@router.post("", response_model=APIResponse[FactoryResponse], dependencies=[Depends(RequirePermissions(["factory.create"]))])
async def create_factory(
    obj_in: FactoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new factory. Requires 'factory.create' permission."""
    factory = await FactoryService.create_factory(db, obj_in, current_user)
    return APIResponse(message="Factory created successfully", data=FactoryResponse.model_validate(factory))

@router.get("", response_model=APIResponse[List[FactoryResponse]])
async def list_factories(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List factories available to the current user context."""
    factories = await FactoryService.list_factories(db, user=current_user, skip=skip, limit=limit)
    data = [FactoryResponse.model_validate(f) for f in factories]
    return APIResponse(message="Factories retrieved successfully", data=data)

@router.get("/{factory_id}", response_model=APIResponse[FactoryResponse], dependencies=[Depends(RequirePermissions(["factory.read"]))])
async def get_factory(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed factory context."""
    factory = await FactoryService.get_factory(db, factory_id)
    return APIResponse(message="Factory retrieved successfully", data=FactoryResponse.model_validate(factory))

@router.put("/{factory_id}", response_model=APIResponse[FactoryResponse], dependencies=[Depends(RequirePermissions(["factory.update"]))])
async def update_factory(
    factory_id: UUID,
    obj_in: FactoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a factory's core details."""
    factory = await FactoryService.update_factory(db, factory_id, obj_in, current_user)
    return APIResponse(message="Factory updated successfully", data=FactoryResponse.model_validate(factory))

@router.delete("/{factory_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["factory.delete"]))])
async def delete_factory(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete a factory, preserving history and audits."""
    await FactoryService.delete_factory(db, factory_id, current_user)
    return APIResponse(message="Factory deleted successfully", data=None)

@router.get("/{factory_id}/settings", response_model=APIResponse[FactorySettings], dependencies=[Depends(RequirePermissions(["factory.read"]))])
async def get_factory_settings(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the JSON settings payload for AI and Operation limits."""
    factory = await FactoryService.get_factory(db, factory_id)
    settings = factory.settings or {}
    return APIResponse(message="Factory settings retrieved successfully", data=FactorySettings.model_validate(settings))

@router.put("/{factory_id}/settings", response_model=APIResponse[FactoryResponse], dependencies=[Depends(RequirePermissions(["factory.update"]))])
async def update_factory_settings(
    factory_id: UUID,
    obj_in: FactorySettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update specific AI or Operational JSON configuration limits."""
    factory = await FactoryService.update_settings(db, factory_id, obj_in, current_user)
    return APIResponse(message="Factory settings updated successfully", data=FactoryResponse.model_validate(factory))
