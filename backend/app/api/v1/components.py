from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.component import (
    ComponentCreate, ComponentResponse,
    InstalledPartInstanceCreate, InstalledPartInstanceResponse,
    PartReplacementRequest
)
from app.services.component import component_service

router = APIRouter(tags=["Components"])

@router.post("/", response_model=ComponentResponse, status_code=status.HTTP_201_CREATED)
async def create_component(
    obj_in: ComponentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new component on a machine/subsystem. Validates factory scope."""
    return await component_service.create_component(db, obj_in, current_user.id)

@router.get("/{id}", response_model=ComponentResponse)
async def get_component(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a component. Validates factory scope."""
    return await component_service.get_component(db, id, current_user.id)

# === Parts Attachment endpoints living under Component resource ===

@router.post("/{id}/parts", response_model=InstalledPartInstanceResponse, status_code=status.HTTP_201_CREATED)
async def install_part(
    id: UUID,
    obj_in: InstalledPartInstanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Attach a physical part to a component."""
    if obj_in.component_id != id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Path ID and Body ID mismatch")
    return await component_service.install_part(db, obj_in, current_user.id)

@router.post("/{id}/parts/{part_id}/replace", response_model=InstalledPartInstanceResponse)
async def replace_part(
    id: UUID,
    part_id: UUID,
    request: PartReplacementRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    CRITICAL AI WORKFLOW: Replace a part. 
    Retires the old part (retaining history) and installs the new part definition.
    """
    return await component_service.replace_part(db, id, part_id, request, current_user.id)
