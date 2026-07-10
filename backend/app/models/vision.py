import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum, Integer, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import MediaType, AnalysisStatus, DefectType, FindingSeverity

class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True) # Optional link to machine
    
    file_type = Column(Enum(MediaType), nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=False)
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class VisionAnalysis(Base):
    __tablename__ = "vision_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    media_id = Column(UUID(as_uuid=True), ForeignKey("media_files.id"), index=True, nullable=False)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    
    analysis_type = Column(String, nullable=False) # e.g. "YOLOv8_DEFECT_DETECTION"
    result = Column(JSONB, nullable=True) # Raw result payload from AI
    confidence_score = Column(Float, nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DetectedDefect(Base):
    __tablename__ = "detected_defects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("vision_analyses.id"), index=True, nullable=False)
    
    defect_type = Column(Enum(DefectType), nullable=False)
    location = Column(JSONB, nullable=True) # Bounding box [x,y,w,h] or timestamp for video
    severity = Column(Enum(FindingSeverity), nullable=False)
    confidence = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
