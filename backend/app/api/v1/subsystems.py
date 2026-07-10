from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.component import SubsystemCreate, SubsystemResponse
from app.services.component import component_service

router = APIRouter(tags=["Subsystems"])

@router.post("/machine/{machine_id}", response_model=SubsystemResponse, status_code=status.HTTP_201_CREATED)
async def create_subsystem(
    machine_id: UUID,
    obj_in: SubsystemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new subsystem attached to a machine. Validates factory scope dynamically."""
    return await component_service.create_subsystem(db, machine_id, obj_in, current_user.id)

@router.get("/{id}", response_model=SubsystemResponse)
async def get_subsystem(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get subsystem. Validates factory scope dynamically."""
    return await component_service.get_subsystem(db, id, current_user.id)
