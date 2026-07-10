from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from app.services.maintenance.maintenance_service import maintenance_service
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Maintenance Records"])

@router.post("/", response_model=MaintenanceResponse)
async def log_maintenance(
    request: MaintenanceCreate,
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.update"], ScopeType.FACTORY, str(factory_id))
    
    return await maintenance_service.log_maintenance(
        db, current_user.organization_id, factory_id, current_user.id, request.model_dump()
    )

@router.get("/machines/{machine_id}/history")
async def get_machine_maintenance_history(
    machine_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In production, check if machine belongs to user's factory/org
    return await maintenance_service.get_machine_history(db, machine_id)
