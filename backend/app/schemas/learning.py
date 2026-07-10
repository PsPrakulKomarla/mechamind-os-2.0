from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import FeedbackType, SolutionStatus

class FeedbackSubmitRequest(BaseModel):
    message_id: UUID
    feedback_type: FeedbackType
    rating: Optional[int] = Field(None, ge=-1, le=5)
    comment: Optional[str] = None
    submitted_solution: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: UUID
    message_id: UUID
    feedback_type: FeedbackType
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SolutionSubmitRequest(BaseModel):
    problem_description: str
    suggested_solution: str
    affected_asset_id: Optional[UUID] = None
    evidence: Optional[Dict[str, Any]] = None

class SolutionReviewRequest(BaseModel):
    status: SolutionStatus
    reason: str

class SolutionResponse(BaseModel):
    id: UUID
    problem_description: str
    suggested_solution: str
    status: SolutionStatus
    confidence_score: Optional[float] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
