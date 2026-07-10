import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import FailurePredictionType, FindingSeverity, ActionRecommendation

class FailurePrediction(Base):
    __tablename__ = "failure_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), index=True, nullable=False)
    
    failure_type = Column(Enum(FailurePredictionType), nullable=False)
    probability = Column(Float, nullable=False) # 0.0 to 1.0
    predicted_time = Column(DateTime(timezone=True), nullable=False) # When the failure is expected
    confidence = Column(Float, nullable=False) # Model confidence score
    risk_level = Column(Enum(FindingSeverity), nullable=False)
    
    recommended_action = Column(Enum(ActionRecommendation), nullable=False)
    estimated_cost_saving = Column(Float, nullable=True) # Cost saved by acting now vs waiting for failure
    
    # Store the input context used to make the prediction (e.g. sensor drift, RCA reports)
    context_used = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
