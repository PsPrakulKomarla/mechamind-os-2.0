from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import ConnectorType, ConnectorStatus, SyncStatus

class ConnectorCreate(BaseModel):
    organization_id: UUID
    name: str
    connector_type: ConnectorType
    plugin_id: str
    configuration_payload: Dict[str, Any]
    field_mapping_rules: Optional[Dict[str, Any]] = None

class ConnectorResponse(BaseModel):
    id: UUID
    name: str
    connector_type: ConnectorType
    plugin_id: str
    status: ConnectorStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TestConnectionResponse(BaseModel):
    success: bool
    message: str
    latency_ms: Optional[float] = None

class SyncJobTrigger(BaseModel):
    connector_id: UUID

class SyncLogResponse(BaseModel):
    id: UUID
    connector_id: UUID
    status: SyncStatus
    records_processed: Optional[str]
    error_message: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

class WebhookEndpointCreate(BaseModel):
    organization_id: UUID
    name: str
    target_action: str
