from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime
from app.models.enums import MediaType, AnalysisStatus, DefectType, FindingSeverity

class MediaFileUploadResponse(BaseModel):
    id: UUID
    file_type: MediaType
    file_path: str
    file_size: int
    status: AnalysisStatus
    model_config = ConfigDict(from_attributes=True)

class DetectedDefectSchema(BaseModel):
    defect_type: DefectType
    location: Optional[Dict[str, Any]] = None
    severity: FindingSeverity
    confidence: float
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class VisionAnalysisResponse(BaseModel):
    id: UUID
    media_id: UUID
    asset_id: Optional[UUID] = None
    analysis_type: str
    confidence_score: float
    severity: FindingSeverity
    defects: List[DetectedDefectSchema] = []
    
    # Optional fields appended dynamically by the VisionAnalyzer tying to RCA
    rca_recommendations: Optional[List[str]] = None
    rca_possible_causes: Optional[List[str]] = None
    
    model_config = ConfigDict(from_attributes=True)
