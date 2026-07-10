from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.copilot import CopilotConversation, CopilotMessage, CopilotResponseMetadata

class ConversationService:
    
    async def get_or_create_conversation(
        self, db: AsyncSession, user_id: UUID, organization_id: UUID, factory_id: Optional[UUID], conversation_id: Optional[UUID] = None
    ) -> CopilotConversation:
        if conversation_id:
            query = select(CopilotConversation).where(CopilotConversation.id == conversation_id)
            result = await db.execute(query)
            conv = result.scalar_one_or_none()
            if conv:
                return conv
                
        # Create new
        conv = CopilotConversation(
            user_id=user_id,
            organization_id=organization_id,
            factory_id=factory_id,
            title="New Chat"
        )
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
        return conv

    async def add_message(self, db: AsyncSession, conversation_id: UUID, role: str, content: str) -> CopilotMessage:
        msg = CopilotMessage(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        return msg

    async def add_metadata(self, db: AsyncSession, message_id: UUID, meta: dict) -> CopilotResponseMetadata:
        db_meta = CopilotResponseMetadata(
            message_id=message_id,
            confidence_score=meta.get("confidence"),
            risk_level=meta.get("risk_level"),
            sources=meta.get("sources", []),
            recommendations=meta.get("recommendations", [])
        )
        db.add(db_meta)
        await db.commit()
        await db.refresh(db_meta)
        return db_meta
        
    async def get_history(self, db: AsyncSession, user_id: UUID) -> List[CopilotConversation]:
        query = select(CopilotConversation).where(CopilotConversation.user_id == user_id).order_by(CopilotConversation.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

conversation_service = ConversationService()
