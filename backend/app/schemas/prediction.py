from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import FailurePredictionType, FindingSeverity, ActionRecommendation, MaintenanceRecommendationPriority

class FailurePredictionResponse(BaseModel):
    id: UUID
    asset_id: UUID
    failure_type: FailurePredictionType
    probability: float
    predicted_time: datetime
    confidence: float
    risk_level: FindingSeverity
    recommended_action: ActionRecommendation
    estimated_cost_saving: Optional[float] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RulResponse(BaseModel):
    machine_id: UUID
    remaining_hours: float
    estimated_failure_date: datetime
    confidence: float
    critical_components: List[str]

class DigitalTwinResponse(BaseModel):
    machine_id: UUID
    name: str
    status: str
    health_score: float # 0.0 to 100.0
    active_sensors: int
    latest_alerts: List[Dict[str, Any]]
    active_predictions: List[FailurePredictionResponse]
    recent_maintenance: List[Dict[str, Any]]
    rul_estimate: Optional[RulResponse] = None
