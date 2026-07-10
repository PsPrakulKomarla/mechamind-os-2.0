from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.prediction import DigitalTwinResponse, FailurePredictionResponse, RulResponse
from app.services.prediction.digital_twin_service import digital_twin_service
from app.services.prediction.failure_prediction_engine import failure_prediction_engine
from app.services.prediction.rul_service import rul_service
from app.repositories.prediction import prediction_repository
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Predictive Maintenance & Digital Twin"])

@router.get("/assets/{asset_id}/digital-twin", response_model=DigitalTwinResponse)
async def get_digital_twin(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In reality, fetch factory_id for the asset to authorize.
    # We mock authorization check for the asset itself.
    return await digital_twin_service.get_digital_twin_state(db, asset_id)

@router.post("/assets/{asset_id}/predict-failure", response_model=FailurePredictionResponse)
async def trigger_failure_prediction(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = await failure_prediction_engine.predict_failure(db, asset_id)
    return prediction

@router.get("/assets/{asset_id}/predictions", response_model=List[FailurePredictionResponse])
async def get_active_predictions(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await prediction_repository.get_active_predictions(db, asset_id)

@router.get("/assets/{asset_id}/remaining-life", response_model=RulResponse)
async def get_remaining_useful_life(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await rul_service.estimate_rul(asset_id)
