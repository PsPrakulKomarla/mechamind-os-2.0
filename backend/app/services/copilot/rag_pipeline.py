from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.schemas.copilot import ChatRequest, ChatResponse
from app.services.copilot.context_builder import context_builder
from app.services.copilot.response_generator import response_generator
from app.services.copilot.conversation_service import conversation_service

class RagPipeline:
    """
    The master orchestrator for the AI Copilot.
    """
    
    async def process_chat(self, db: AsyncSession, request: ChatRequest, user_id: UUID, organization_id: UUID) -> ChatResponse:
        
        # 1. Init Conversation
        conv = await conversation_service.get_or_create_conversation(
            db, user_id, organization_id, request.factory_id, request.conversation_id
        )
        
        # 2. Log User Query
        await conversation_service.add_message(db, conv.id, "user", request.message)
        
        # 3. Retrieve Context (pgvector search)
        context = await context_builder.build_context(
            db, request.message, organization_id, request.factory_id
        )
        
        # 4. Generate AI Response
        raw_response = await response_generator.generate(request.message, context)
        
        # 5. Log AI Answer
        ai_msg = await conversation_service.add_message(db, conv.id, "ai", raw_response["answer"])
        
        # 6. Save Metadata (Citations, Risk)
        await conversation_service.add_metadata(db, ai_msg.id, raw_response)
        
        # 7. Format Output
        return ChatResponse(
            conversation_id=conv.id,
            message_id=ai_msg.id,
            answer=raw_response["answer"],
            confidence=raw_response.get("confidence"),
            risk_level=raw_response.get("risk_level"),
            sources=raw_response.get("sources", []),
            recommendations=raw_response.get("recommendations", [])
        )

rag_pipeline = RagPipeline()
