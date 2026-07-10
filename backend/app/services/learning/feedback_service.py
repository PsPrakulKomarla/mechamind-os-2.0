from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.learning import AIResponseFeedback
from app.schemas.learning import FeedbackSubmitRequest

class FeedbackService:
    async def submit_feedback(self, db: AsyncSession, request: FeedbackSubmitRequest, user_id: UUID, conversation_id: UUID) -> AIResponseFeedback:
        feedback = AIResponseFeedback(
            conversation_id=conversation_id,
            message_id=request.message_id,
            user_id=user_id,
            feedback_type=request.feedback_type,
            rating=request.rating,
            comment=request.comment,
            submitted_solution=request.submitted_solution
        )
        db.add(feedback)
        await db.commit()
        await db.refresh(feedback)
        return feedback

feedback_service = FeedbackService()
