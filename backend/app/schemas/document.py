from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import DocumentType, ProcessingStatus

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    document_type: DocumentType
    version: str = "1.0"
    factory_id: Optional[UUID] = None

class DocumentResponse(DocumentBase):
    id: UUID
    organization_id: UUID
    uploaded_by_id: UUID
    file_name: str
    file_size: int
    mime_type: str
    status: str
    processing_status: ProcessingStatus
    extracted_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DocumentPaginatedResponse(BaseModel):
    items: List[DocumentResponse]
    total: int
    page: int
    size: int
