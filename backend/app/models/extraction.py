import uuid
from sqlalchemy import Column, String, Integer, DateTime, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import ExtractionType, JobStatus, JobType

class DocumentExtraction(Base):
    """
    Stores raw extracted elements from a document.
    """
    __tablename__ = "document_extractions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    extraction_type = Column(Enum(ExtractionType), nullable=False, index=True)
    content = Column(String, nullable=True) # Could be raw text or image URI
    page_number = Column(Integer, nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExtractedContent(Base):
    """
    Stores normalized, cleaned text chunks ready for Vector DB embeddings.
    """
    __tablename__ = "extracted_contents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    content_type = Column(String, nullable=False) # E.g., 'paragraph', 'table_row'
    text_content = Column(String, nullable=False)
    metadata_payload = Column(JSONB, nullable=True) # Contains bounding boxes, headings
    
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessingJob(Base):
    """
    Tracks the background Celery job status.
    """
    __tablename__ = "processing_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), index=True, nullable=False, unique=True)
    
    job_type = Column(Enum(JobType), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.QUEUED, index=True)
    
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    error_message = Column(String, nullable=True)
