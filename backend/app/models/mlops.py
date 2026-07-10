import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import ModelStatus

class AiModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    name = Column(String, nullable=False) # e.g., "predictive_maintenance_rf"
    task_type = Column(String, nullable=False) # e.g., "classification", "regression", "cv"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    model_id = Column(UUID(as_uuid=True), ForeignKey("ai_models.id"), nullable=False)
    
    version_tag = Column(String, nullable=False) # e.g., "v1.2.0"
    status = Column(Enum(ModelStatus), default=ModelStatus.DRAFT)
    
    # Path in MinIO
    artifact_uri = Column(String, nullable=False)
    
    # Metrics evaluated on the holdout set
    evaluation_metrics = Column(JSONB, nullable=True) # e.g., {"accuracy": 0.94, "f1": 0.92}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
