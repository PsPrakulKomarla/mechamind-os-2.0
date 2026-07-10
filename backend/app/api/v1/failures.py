from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.maintenance import FailureCreate, FailureResponse, RcaResponse
from app.services.maintenance.failure_service import failure_service
from app.services.maintenance.rca_engine import rca_engine
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["Failure Tracking & RCA Agent"])

@router.post("/", response_model=FailureResponse)
async def report_failure(
    request: FailureCreate,
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await AuthorizationService.authorize(db, current_user.id, ["machine.update"], ScopeType.FACTORY, str(factory_id))
    
    return await failure_service.report_failure(
        db, current_user.organization_id, factory_id, request.model_dump()
    )

@router.post("/{failure_id}/analyze", response_model=RcaResponse)
async def analyze_failure(
    failure_id: UUID,
    machine_id: UUID,
    issue_description: str,
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Triggers the RcaEngine. The AI agent searches the RAG vector store for semantic matches
    and cross-references past failures for this machine to output possible causes.
    """
    await AuthorizationService.authorize(db, current_user.id, ["machine.read"], ScopeType.FACTORY, str(factory_id))
    
    return await rca_engine.generate_rca(
        db, current_user.organization_id, factory_id, machine_id, issue_description
    )
