from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import ModelStatus

class AiModelCreate(BaseModel):
    organization_id: UUID
    name: str
    task_type: str

class ModelVersionCreate(BaseModel):
    model_id: UUID
    version_tag: str
    artifact_uri: str
    evaluation_metrics: Optional[Dict[str, Any]] = None

class AiModelResponse(BaseModel):
    id: UUID
    name: str
    task_type: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ModelVersionResponse(BaseModel):
    id: UUID
    model_id: UUID
    version_tag: str
    status: ModelStatus
    artifact_uri: str
    evaluation_metrics: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
