import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.enums import FeedbackType, SolutionStatus

class AIResponseFeedback(Base):
    __tablename__ = "ai_response_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("copilot_conversations.id"), index=True, nullable=False)
    message_id = Column(UUID(as_uuid=True), ForeignKey("copilot_messages.id"), index=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    
    feedback_type = Column(Enum(FeedbackType), nullable=False)
    rating = Column(Integer, nullable=True) # e.g. 1-5 stars or 1/-1
    comment = Column(String, nullable=True)
    submitted_solution = Column(String, nullable=True) # Optional text from user suggesting an alternative
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SolutionProposal(Base):
    """
    Formal proposal to augment the AI's knowledge base. Requires Expert review.
    """
    __tablename__ = "solution_proposals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True)
    
    problem_description = Column(String, nullable=False)
    suggested_solution = Column(String, nullable=False)
    affected_asset_id = Column(UUID(as_uuid=True), nullable=True) # Optional Machine/Component ref
    
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    evidence = Column(JSONB, nullable=True) # Links to photos, logs, or past feedback IDs
    confidence_score = Column(Float, nullable=True) # AI-evaluated score before human review
    
    status = Column(Enum(SolutionStatus), default=SolutionStatus.SUBMITTED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class KnowledgeVersion(Base):
    """
    Audit log of changes made to the Knowledge Base (Vector + Graph) upon Solution Approval.
    """
    __tablename__ = "knowledge_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    solution_proposal_id = Column(UUID(as_uuid=True), ForeignKey("solution_proposals.id"), nullable=True)
    
    previous_knowledge_metadata = Column(JSONB, nullable=True)
    new_knowledge_metadata = Column(JSONB, nullable=True)
    
    changed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # The Expert who approved
    reason = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
