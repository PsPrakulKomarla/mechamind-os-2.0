from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.mlops import AiModelCreate, ModelVersionCreate, AiModelResponse, ModelVersionResponse
from app.services.mlops.model_registry import model_registry_service
from app.repositories.mlops import mlops_repository

router = APIRouter(tags=["MLOps / Model Registry"])

@router.post("/models", response_model=AiModelResponse)
async def register_model(
    request: AiModelCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await model_registry_service.register_model(db, request)

@router.post("/models/versions", response_model=ModelVersionResponse)
async def register_model_version(
    request: ModelVersionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await model_registry_service.register_model_version(db, request)

@router.post("/models/{model_id}/versions/{version_id}/promote", response_model=ModelVersionResponse)
async def promote_model_version(
    model_id: UUID,
    version_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await model_registry_service.promote_to_production(db, model_id, version_id)

@router.get("/models/{model_id}/versions", response_model=List[ModelVersionResponse])
async def list_model_versions(
    model_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await mlops_repository.get_model_versions(db, model_id)
