from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.compliance import SafetyRiskFinding
from app.services.compliance.safety_analyzer import safety_analyzer
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Safety Intelligence"])

@router.get("/factories/{factory_id}/risks", response_model=List[SafetyRiskFinding])
async def get_safety_risks(
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
    return await safety_analyzer.get_safety_risks(db, current_user.organization_id, factory_id)
