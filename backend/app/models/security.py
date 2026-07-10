import uuid
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import SecurityEventType

class SecurityEventLog(Base):
    __tablename__ = "security_event_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=True) # Optional, might be unauth
    user_id = Column(UUID(as_uuid=True), index=True, nullable=True)
    
    event_type = Column(Enum(SecurityEventType), nullable=False, index=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    # Metadata for forensic analysis (e.g., the injected prompt, the bad file hash)
    payload = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
