from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.risk_health import RiskAssessmentCreate, RiskAssessmentResponse, RiskSummaryItem
from app.services.risk_health import risk_health_service

router = APIRouter(tags=["Asset Risk"])

@router.post("/assets/{id}/risk-assessment", response_model=RiskAssessmentResponse, status_code=status.HTTP_201_CREATED)
async def calculate_risk(
    id: UUID,
    payload: RiskAssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate and save a new Risk Assessment (Probability x Severity)."""
    return await risk_health_service.calculate_risk(db, id, payload, current_user.id)

@router.get("/assets/{id}/risk", response_model=RiskAssessmentResponse)
async def get_latest_risk(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve the most recent risk assessment for an asset."""
    return await risk_health_service.get_latest_risk(db, id, current_user.id)

@router.get("/assets/risk-summary/factory/{factory_id}", response_model=List[RiskSummaryItem])
async def get_risk_summary(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch all High and Critical risk assets for a specific factory dashboard."""
    return await risk_health_service.get_risk_summary(db, factory_id, current_user.id)
