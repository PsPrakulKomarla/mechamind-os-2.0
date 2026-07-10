import uuid
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base

class AgentConversation(Base):
    __tablename__ = "agent_conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=True)
    context = Column(JSONB, default={}) # Holds referenced assets, factories, etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    messages = relationship("AgentMessage", back_populates="conversation", cascade="all, delete-orphan")

class AgentMessage(Base):
    __tablename__ = "agent_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("agent_conversations.id"), nullable=False)
    
    role = Column(String, nullable=False) # 'user', 'assistant', 'system'
    content = Column(String, nullable=False)
    
    # Explainable AI Metadata
    confidence_score = Column(String, nullable=True) # Cast to str or keep float if db type supports
    evidence_list = Column(JSONB, default=[])
    reasoning_summary = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    conversation = relationship("AgentConversation", back_populates="messages")

class OrchestrationAudit(Base):
    __tablename__ = "orchestration_audits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    message_id = Column(UUID(as_uuid=True), ForeignKey("agent_messages.id"), nullable=True)
    
    intent_detected = Column(String, nullable=True)
    agents_invoked = Column(JSONB, default=[])
    conflict_resolution_notes = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
