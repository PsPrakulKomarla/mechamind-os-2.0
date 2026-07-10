from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.risk_health import HealthScoreCreate, HealthScoreResponse, CriticalityUpdate
from app.services.risk_health import risk_health_service

router = APIRouter(tags=["Asset Health"])

@router.post("/assets/{id}/health-score", response_model=HealthScoreResponse, status_code=status.HTTP_201_CREATED)
async def calculate_health(
    id: UUID,
    payload: HealthScoreCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculates and stores a new health score (0-100) based on provided degradation factors."""
    return await risk_health_service.calculate_health(db, id, payload, current_user.id)

@router.get("/assets/{id}/health", response_model=HealthScoreResponse)
async def get_latest_health(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve the most recent health score for an asset."""
    return await risk_health_service.get_latest_health(db, id, current_user.id)

@router.put("/assets/{id}/criticality", status_code=status.HTTP_200_OK)
async def update_criticality(
    id: UUID,
    payload: CriticalityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a machine's criticality. This logs to the append-only CriticalityHistory table."""
    await risk_health_service.update_criticality(db, id, payload, current_user.id)
    return {"status": "success", "message": f"Criticality updated to {payload.new_criticality}"}
