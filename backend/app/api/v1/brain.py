from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.brain import OrchestrationRequest, OrchestrationResponse
from app.services.brain.orchestrator import ai_orchestrator
from app.services.brain.memory_service import memory_service

router = APIRouter(tags=["AI Orchestrator / Brain"])

@router.post("/orchestrate", response_model=OrchestrationResponse)
async def orchestrate_query(
    request: OrchestrationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Entrypoint for the MechaMind Brain. Receives an open-ended query, dispatches to agents,
    aggregates results, and stores conversation memory.
    """
    # Force the context to be constrained by the user's organization
    if not request.context_filters:
        request.context_filters = {}
    request.context_filters["organization_id"] = str(current_user.organization_id)
    
    # 1. Orchestrate
    response = await ai_orchestrator.orchestrate(request)
    
    # 2. Store Memory (Async background task in prod, awaited here for structural completion)
    await memory_service.save_interaction(
        db=db,
        org_id=current_user.organization_id,
        user_id=current_user.id,
        user_query=request.query,
        response=response
    )
    
    return response
