from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import RiskLevel, AssetCriticality

class RiskAssessmentCreate(BaseModel):
    # Payload-driven generic factors
    probability_factor: float
    safety_impact: float
    production_impact: float
    financial_impact: float
    environment_impact: float
    compliance_impact: float

class RiskAssessmentResponse(BaseModel):
    id: UUID
    asset_id: UUID
    safety_score: float
    production_score: float
    financial_score: float
    environment_score: float
    compliance_score: float
    overall_risk_score: float
    risk_level: RiskLevel
    calculated_at: datetime
    calculated_by_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class HealthScoreCreate(BaseModel):
    health_factors: Dict[str, float]

class HealthScoreResponse(BaseModel):
    id: UUID
    asset_id: UUID
    health_score: float
    condition_status: str
    health_factors: Optional[Dict[str, float]] = None
    calculated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CriticalityUpdate(BaseModel):
    new_criticality: AssetCriticality
    reason: str

class RiskSummaryItem(BaseModel):
    asset_id: UUID
    asset_name: str
    risk_level: RiskLevel
    overall_risk_score: float
    criticality: AssetCriticality
