from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class SearchFilter(BaseModel):
    department_id: Optional[UUID] = None
    machine_id: Optional[UUID] = None
    document_type: Optional[str] = None
    # Can extend with date ranges etc.

class SearchRequest(BaseModel):
    query: str
    factory_id: Optional[UUID] = None
    filters: Optional[SearchFilter] = None
    top_k: int = Field(default=5, ge=1, le=20)

class SearchResultResponse(BaseModel):
    id: UUID
    document_id: UUID
    content: str
    metadata_payload: Optional[Dict[str, Any]] = None
    similarity_score: float # Distance / similarity score
    
    model_config = ConfigDict(from_attributes=True)

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultResponse]
