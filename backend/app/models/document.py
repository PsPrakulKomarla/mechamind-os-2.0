import uuid
from sqlalchemy import Column, String, Integer, DateTime, Enum, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import DocumentType, ProcessingStatus

class Document(Base):
    """
    Represents an uploaded physical document, drawing, or manual.
    """
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Scoping
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True) # Optional for org-wide docs
    uploaded_by_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Metadata
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    document_type = Column(Enum(DocumentType), nullable=False, index=True)
    version = Column(String, default="1.0")
    
    # Storage details
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False) # Path inside storage provider
    file_size = Column(Integer, nullable=False) # Bytes
    mime_type = Column(String, nullable=False)
    
    # State tracking
    status = Column(String, default="ACTIVE") # For soft delete
    processing_status = Column(Enum(ProcessingStatus), default=ProcessingStatus.UPLOADED, index=True)
    
    # Extracted data (future RAG use)
    extracted_metadata = Column(JSONB, nullable=True)
    
    is_active = Column(Boolean, default=True) # Soft delete
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
