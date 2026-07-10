import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import RiskLevel, AssetCriticality

class AssetRiskAssessment(Base):
    """
    Stores risk calculations for any asset (Machine/Component).
    Risk Score = Probability * Impact.
    """
    __tablename__ = "asset_risk_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    asset_id = Column(UUID(as_uuid=True), index=True, nullable=False) # Polymorphic FK to Machine or Component
    
    safety_score = Column(Float, default=0.0)
    production_score = Column(Float, default=0.0)
    financial_score = Column(Float, default=0.0)
    environment_score = Column(Float, default=0.0)
    compliance_score = Column(Float, default=0.0)
    
    overall_risk_score = Column(Float, nullable=False)
    risk_level = Column(Enum(RiskLevel), nullable=False)
    
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    calculated_by_id = Column(UUID(as_uuid=True), nullable=True)
    
class AssetHealthScore(Base):
    """
    Stores the quantitative health score (0-100) of an asset based on runtime factors.
    """
    __tablename__ = "asset_health_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    asset_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    health_score = Column(Float, nullable=False) # 0 to 100
    condition_status = Column(String, nullable=False) # EXCELLENT, GOOD, FAIR, POOR, CRITICAL
    
    health_factors = Column(JSONB, nullable=True) # E.g., {"age_factor": 0.9, "vibration_factor": 0.6}
    
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    
class CriticalityHistory(Base):
    """
    Append-only log tracking changes to an asset's Criticality.
    """
    __tablename__ = "criticality_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    asset_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    previous_criticality = Column(Enum(AssetCriticality), nullable=True)
    new_criticality = Column(Enum(AssetCriticality), nullable=False)
    
    reason = Column(String, nullable=True)
    
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    changed_by_id = Column(UUID(as_uuid=True), nullable=True)
