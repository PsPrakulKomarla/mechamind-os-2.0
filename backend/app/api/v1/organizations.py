from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.schemas.response import APIResponse
from app.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, 
    OrganizationResponse, OrganizationSettingsUpdate
)
from app.services.organization import OrganizationService

router = APIRouter()

@router.post("", response_model=APIResponse[OrganizationResponse], dependencies=[Depends(RequirePermissions(["organization.create"]))])
async def create_organization(
    obj_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new organization. Requires global admin permission."""
    org = await OrganizationService.create_organization(db, obj_in, current_user)
    return APIResponse(message="Organization created successfully", data=OrganizationResponse.model_validate(org))

@router.get("", response_model=APIResponse[List[OrganizationResponse]])
async def list_organizations(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List organizations. A normal user might only see their assigned orgs (Filtered in Phase 8.3/8.4)."""
    # For now, we list all active if permitted, but practically this will scope to user's permitted orgs.
    orgs = await OrganizationService.list_organizations(db, skip=skip, limit=limit)
    data = [OrganizationResponse.model_validate(o) for o in orgs]
    return APIResponse(message="Organizations retrieved successfully", data=data)

@router.get("/{organization_id}", response_model=APIResponse[OrganizationResponse], dependencies=[Depends(RequirePermissions(["organization.read"]))])
async def get_organization(
    organization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get organization details."""
    org = await OrganizationService.get_organization(db, organization_id)
    return APIResponse(message="Organization retrieved successfully", data=OrganizationResponse.model_validate(org))

@router.put("/{organization_id}", response_model=APIResponse[OrganizationResponse], dependencies=[Depends(RequirePermissions(["organization.update"]))])
async def update_organization(
    organization_id: UUID,
    obj_in: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an organization's core details."""
    org = await OrganizationService.update_organization(db, organization_id, obj_in, current_user)
    return APIResponse(message="Organization updated successfully", data=OrganizationResponse.model_validate(org))

@router.delete("/{organization_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["organization.delete"]))])
async def delete_organization(
    organization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete an organization."""
    await OrganizationService.delete_organization(db, organization_id, current_user)
    return APIResponse(message="Organization deleted successfully", data=None)

@router.get("/{organization_id}/settings", response_model=APIResponse[OrganizationSettingsUpdate], dependencies=[Depends(RequirePermissions(["organization.read"]))])
async def get_organization_settings(
    organization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get organization settings."""
    org = await OrganizationService.get_organization(db, organization_id)
    settings_data = OrganizationSettingsUpdate.model_validate(org)
    return APIResponse(message="Organization settings retrieved successfully", data=settings_data)

@router.put("/{organization_id}/settings", response_model=APIResponse[OrganizationResponse], dependencies=[Depends(RequirePermissions(["organization.update"]))])
async def update_organization_settings(
    organization_id: UUID,
    obj_in: OrganizationSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an organization's settings."""
    org = await OrganizationService.update_settings(db, organization_id, obj_in, current_user)
    return APIResponse(message="Organization settings updated successfully", data=OrganizationResponse.model_validate(org))
