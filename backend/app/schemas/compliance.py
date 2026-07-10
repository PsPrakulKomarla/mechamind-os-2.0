from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from app.models.enums import FindingSeverity, FindingStatus, CorrectiveActionStatus, RiskLevel

class ComplianceRequirementCreate(BaseModel):
    title: str
    description: str
    severity: FindingSeverity
    applicable_asset_type: Optional[str] = None
    required_evidence: Optional[List[str]] = None

class RegulationCreate(BaseModel):
    name: str
    code: str
    authority: str
    industry: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    requirements: List[ComplianceRequirementCreate]

class RegulationResponse(BaseModel):
    id: UUID
    name: str
    code: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MissingRequirementFinding(BaseModel):
    issue: str
    severity: FindingSeverity
    recommendation: str

class ComplianceCheckResponse(BaseModel):
    score: float
    risk_level: RiskLevel
    findings: List[MissingRequirementFinding]

class AuditPackageResponse(BaseModel):
    regulation_code: str
    completion_percentage: float
    missing_evidence: List[str]
    compliance_summary: str

class SafetyRiskFinding(BaseModel):
    hazard: str
    severity: RiskLevel
    missing_controls: List[str]
