from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.enums import ScopeType, AuditAction, EntityType
from app.schemas.copilot import ChatRequest, ChatResponse, ConversationHistoryResponse
from app.services.copilot.rag_pipeline import rag_pipeline
from app.services.copilot.conversation_service import conversation_service
from app.services.authorization import AuthorizationService
from app.services.audit import audit_service

router = APIRouter(tags=["Industrial AI Copilot"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Talk to the MechaMind OS Copilot. Provide a factory_id to narrow the semantic context.
    """
    if request.factory_id:
        await AuthorizationService.authorize(db, current_user.id, ["document.read"], ScopeType.FACTORY, str(request.factory_id))
        
    response = await rag_pipeline.process_chat(
        db, request, current_user.id, current_user.organization_id
    )
    
    await audit_service.log_action(db, current_user.id, AuditAction.READ, EntityType.DOCUMENT, None, {"event": "ai_query_executed", "risk": response.risk_level})
    return response

@router.get("/history", response_model=List[ConversationHistoryResponse])
async def get_chat_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch previous chat threads."""
    return await conversation_service.get_history(db, current_user.id)
