from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import SecurityEventType

class SecurityEventLogCreate(BaseModel):
    organization_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    event_type: SecurityEventType
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

class SecurityEventLogResponse(BaseModel):
    id: UUID
    organization_id: Optional[UUID]
    user_id: Optional[UUID]
    event_type: SecurityEventType
    ip_address: Optional[str]
    user_agent: Optional[str]
    payload: Optional[Dict[str, Any]]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
