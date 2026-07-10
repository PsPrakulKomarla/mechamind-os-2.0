from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OperationalStatus

class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    team_lead_id: Optional[UUID] = None
    status: OperationalStatus = OperationalStatus.ACTIVE

class TeamCreate(TeamBase):
    department_id: UUID

class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    team_lead_id: Optional[UUID] = None
    status: Optional[OperationalStatus] = None

class TeamResponse(TeamBase):
    id: UUID
    department_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserTeamAssignment(BaseModel):
    user_id: UUID
