from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import ExtractionType, JobStatus, JobType

class ProcessingJobResponse(BaseModel):
    id: UUID
    document_id: UUID
    job_type: JobType
    status: JobStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ExtractedContentResponse(BaseModel):
    id: UUID
    document_id: UUID
    content_type: str
    text_content: str
    metadata_payload: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RetryJobRequest(BaseModel):
    job_type: JobType = JobType.FULL_EXTRACTION
