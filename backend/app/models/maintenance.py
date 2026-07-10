import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import MaintenanceType, MaintenanceStatus, FailureType, FailureSeverity

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True)
    
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), index=True, nullable=False)
    component_id = Column(UUID(as_uuid=True), ForeignKey("components.id"), index=True, nullable=True)
    
    maintenance_type = Column(Enum(MaintenanceType), nullable=False)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.COMPLETED)
    description = Column(String, nullable=False)
    
    performed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    date = Column(DateTime(timezone=True), nullable=False)
    duration_hours = Column(Float, nullable=True)
    cost = Column(Float, nullable=True) # Financial cost impact
    remarks = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FailureEvent(Base):
    __tablename__ = "failure_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=True)
    
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), index=True, nullable=False)
    component_id = Column(UUID(as_uuid=True), ForeignKey("components.id"), index=True, nullable=True)
    
    failure_type = Column(Enum(FailureType), nullable=False)
    severity = Column(Enum(FailureSeverity), nullable=False)
    description = Column(String, nullable=False)
    
    detected_date = Column(DateTime(timezone=True), nullable=False)
    resolved_date = Column(DateTime(timezone=True), nullable=True)
    
    root_cause = Column(String, nullable=True)
    resolution = Column(String, nullable=True)
    cost_impact = Column(Float, nullable=True) # E.g., downtime cost
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
