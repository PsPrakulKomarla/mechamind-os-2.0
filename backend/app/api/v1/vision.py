from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType, MediaType
from app.schemas.vision import MediaFileUploadResponse, VisionAnalysisResponse
from app.services.vision.media_service import media_service
from app.services.vision.vision_analyzer import vision_analyzer
from app.repositories.vision import vision_repository
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Vision Intelligence Agent"])

@router.post("/upload-image", response_model=MediaFileUploadResponse)
async def upload_image(
    factory_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["document.create"], ScopeType.FACTORY, str(factory_id))
    return await media_service.upload_media(db, current_user.organization_id, factory_id, current_user.id, file, MediaType.IMAGE)

@router.post("/upload-video", response_model=MediaFileUploadResponse)
async def upload_video(
    factory_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["document.create"], ScopeType.FACTORY, str(factory_id))
    return await media_service.upload_media(db, current_user.organization_id, factory_id, current_user.id, file, MediaType.VIDEO)

@router.post("/{media_id}/analyze")
async def analyze_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Security: Ensure user owns this media via factory link
    media = await vision_repository.get_media_file(db, media_id)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
        
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(media.factory_id))
    return await vision_analyzer.process_media(db, media_id)

@router.get("/assets/{asset_id}/vision-history")
async def get_asset_vision_history(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # We would authorize the asset here.
    return await vision_repository.get_vision_history_for_asset(db, asset_id)
