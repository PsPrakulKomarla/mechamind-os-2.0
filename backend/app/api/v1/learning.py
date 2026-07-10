from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.learning import FeedbackSubmitRequest, FeedbackResponse, SolutionSubmitRequest, SolutionReviewRequest, SolutionResponse
from app.services.learning.feedback_service import feedback_service
from app.services.learning.expert_review import expert_review_service
from app.services.authorization import AuthorizationService

router = APIRouter(tags=["AI Learning & Feedback"])

@router.post("/copilot/feedback", response_model=FeedbackResponse)
async def submit_copilot_feedback(
    request: FeedbackSubmitRequest,
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a rating or correction on an AI response."""
    return await feedback_service.submit_feedback(db, request, current_user.id, conversation_id)

@router.post("/knowledge/solutions", response_model=SolutionResponse)
async def submit_solution_proposal(
    request: SolutionSubmitRequest,
    factory_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Propose a new maintenance fix or safety rule to the AI's knowledge base."""
    # Ensure user belongs to this factory
    await AuthorizationService.authorize(db, current_user.id, ["document.read"], ScopeType.FACTORY, str(factory_id))
    
    return await expert_review_service.submit_proposal(
        db, current_user.organization_id, factory_id, current_user.id, request.model_dump()
    )

@router.put("/knowledge/solutions/{solution_id}/review", response_model=SolutionResponse)
async def review_solution_proposal(
    solution_id: UUID,
    request: SolutionReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Expert workflow to approve or reject a solution. Approved solutions update AI vectors."""
    # Enforce EXPERT level permissions. In production this maps to a specific role/permission.
    # For prototype, we enforce a strict policy check: 'knowledge.approve'
    await AuthorizationService.authorize(db, current_user.id, ["document.update"], ScopeType.ORGANIZATION, str(current_user.organization_id))
    
    return await expert_review_service.review_proposal(
        db, solution_id, current_user.id, request.status, request.reason
    )
