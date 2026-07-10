import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class CopilotConversation(Base):
    __tablename__ = "copilot_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True)
    
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    messages = relationship("CopilotMessage", back_populates="conversation", cascade="all, delete-orphan")

class CopilotMessage(Base):
    __tablename__ = "copilot_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("copilot_conversations.id"), index=True, nullable=False)
    
    role = Column(String, nullable=False) # 'user' or 'ai'
    content = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("CopilotConversation", back_populates="messages")
    ai_metadata = relationship("CopilotResponseMetadata", back_populates="message", uselist=False, cascade="all, delete-orphan")

class CopilotResponseMetadata(Base):
    """
    Stores the structured RAG outputs like confidence, sources, and risk level.
    """
    __tablename__ = "copilot_response_metadata"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    message_id = Column(UUID(as_uuid=True), ForeignKey("copilot_messages.id"), unique=True, nullable=False)
    
    confidence_score = Column(String, nullable=True) # e.g. '87%'
    risk_level = Column(String, nullable=True) # LOW, HIGH, CRITICAL
    sources = Column(JSONB, nullable=True) # List of dictionaries [{doc: 'manual.pdf', page: 2}]
    recommendations = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("CopilotMessage", back_populates="ai_metadata")
