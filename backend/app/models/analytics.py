import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import ActivityType, ReportType, ExportFormat

class UserActivityLog(Base):
    __tablename__ = "user_activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    activity_type = Column(Enum(ActivityType), nullable=False)
    description = Column(String, nullable=False)
    metadata_payload = Column(JSONB, nullable=True) # E.g., The question asked, or doc uploaded
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class FactoryTimelineEvent(Base):
    __tablename__ = "factory_timeline_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    factory_id = Column(UUID(as_uuid=True), ForeignKey("factories.id"), index=True, nullable=False)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    
    event_category = Column(String, nullable=False) # "FAILURE", "MAINTENANCE", "AI_PREDICTION"
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class GeneratedReport(Base):
    __tablename__ = "generated_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    requested_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    report_type = Column(Enum(ReportType), nullable=False)
    export_format = Column(Enum(ExportFormat), nullable=False)
    status = Column(String, default="PROCESSING") # PROCESSING, COMPLETED, FAILED
    file_url = Column(String, nullable=True) # S3 link
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
