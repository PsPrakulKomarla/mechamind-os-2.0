from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import ExtractedEntityType

class ExtractedEntityResponse(BaseModel):
    id: UUID
    document_id: UUID
    entity_type: ExtractedEntityType
    entity_name: str
    entity_value: Optional[str] = None
    confidence_score: float
    metadata_payload: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EntityRelationshipResponse(BaseModel):
    id: UUID
    source_entity_id: UUID
    target_entity_id: UUID
    relationship_type: str
    confidence_score: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class KnowledgeMapResponse(BaseModel):
    id: UUID
    extracted_entity_id: UUID
    target_table: str
    target_id: UUID
    match_score: float

    model_config = ConfigDict(from_attributes=True)

class EntitySearchRequest(BaseModel):
    query: str
    entity_types: Optional[List[ExtractedEntityType]] = None
