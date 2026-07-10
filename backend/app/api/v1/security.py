from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.security import SecurityEventLogResponse
from app.repositories.security import security_repository
from app.services.authorization import AuthorizationService
from app.models.enums import ScopeType

router = APIRouter(tags=["Enterprise Security & Audit"])

@router.get("/events/{organization_id}", response_model=List[SecurityEventLogResponse])
async def get_security_audit_logs(
    organization_id: UUID,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the Security Event Logs (SOC visibility). Only Org Admins.
    """
    await AuthorizationService.authorize(db, current_user.id, ["security.read"], ScopeType.ORGANIZATION, str(organization_id))
    return await security_repository.get_logs_by_org(db, organization_id, limit)
