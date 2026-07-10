from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from app.models.enums import AgentType, IntentType

class EvidenceItem(BaseModel):
    source_type: str # e.g., 'document', 'sensor', 'database'
    source_id: str
    description: str
    url: Optional[str] = None

class AgentContribution(BaseModel):
    agent_type: AgentType
    confidence_score: float = Field(ge=0.0, le=1.0)
    findings: str
    evidence: List[EvidenceItem] = []

class OrchestrationRequest(BaseModel):
    query: str
    conversation_id: Optional[UUID] = None # For follow-ups
    context_filters: Optional[Dict[str, Any]] = None # e.g., {"factory_id": "..."}

class OrchestrationResponse(BaseModel):
    decision: str
    reasoning_summary: str
    confidence_score: float
    evidence_list: List[EvidenceItem]
    agents_invoked: List[AgentType]
    conversation_id: UUID
