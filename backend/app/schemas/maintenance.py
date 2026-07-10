from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.enums import MaintenanceType, MaintenanceStatus, FailureType, FailureSeverity

class MaintenanceCreate(BaseModel):
    machine_id: UUID
    component_id: Optional[UUID] = None
    maintenance_type: MaintenanceType
    status: MaintenanceStatus = MaintenanceStatus.COMPLETED
    description: str
    date: datetime
    duration_hours: Optional[float] = None
    cost: Optional[float] = None
    remarks: Optional[str] = None

class MaintenanceResponse(MaintenanceCreate):
    id: UUID
    organization_id: UUID
    factory_id: Optional[UUID]
    performed_by: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class FailureCreate(BaseModel):
    machine_id: UUID
    component_id: Optional[UUID] = None
    failure_type: FailureType
    severity: FailureSeverity
    description: str
    detected_date: datetime

class FailureResponse(FailureCreate):
    id: UUID
    resolved_date: Optional[datetime]
    root_cause: Optional[str]
    resolution: Optional[str]
    cost_impact: Optional[float]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CauseProbability(BaseModel):
    cause: str
    probability: str # e.g. "85%"
    evidence: str

class RcaRecommendation(BaseModel):
    immediate: List[str]
    short_term: List[str]
    long_term: List[str]

class RcaResponse(BaseModel):
    problem_summary: str
    possible_causes: List[CauseProbability]
    recommended_actions: RcaRecommendation
    safety_warning: Optional[str] = None
    sources: List[str]
