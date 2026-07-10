from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.brain import AgentConversation, AgentMessage
from app.schemas.brain import OrchestrationResponse

class MemoryService:
    """
    Manages long-running conversational memory for the AI Orchestrator.
    """
    
    async def load_conversation(self, db: AsyncSession, conversation_id: UUID):
        query = select(AgentConversation).where(AgentConversation.id == conversation_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
        
    async def save_interaction(self, db: AsyncSession, org_id: UUID, user_id: UUID, user_query: str, response: OrchestrationResponse):
        # Retrieve or Create Conversation
        conv = await self.load_conversation(db, response.conversation_id)
        if not conv:
            conv = AgentConversation(
                id=response.conversation_id,
                organization_id=org_id,
                user_id=user_id,
                title=user_query[:50] + "..."
            )
            db.add(conv)
            await db.commit()
            
        # Insert User Message
        u_msg = AgentMessage(
            conversation_id=conv.id,
            role="user",
            content=user_query
        )
        db.add(u_msg)
        
        # Insert Agent Response
        evidence_dicts = [{"source_id": e.source_id, "description": e.description} for e in response.evidence_list]
        
        a_msg = AgentMessage(
            conversation_id=conv.id,
            role="assistant",
            content=response.decision,
            confidence_score=str(response.confidence_score),
            evidence_list=evidence_dicts,
            reasoning_summary=response.reasoning_summary
        )
        db.add(a_msg)
        await db.commit()

memory_service = MemoryService()
