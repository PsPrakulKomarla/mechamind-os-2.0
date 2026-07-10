import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.enums import FindingStatus, FindingSeverity, CorrectiveActionStatus, RiskLevel

class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=True) # Null means global standard like ISO 45001
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    authority = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    description = Column(String, nullable=True)
    version = Column(String, nullable=True)
    effective_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplianceRequirement(Base):
    __tablename__ = "compliance_requirements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    regulation_id = Column(UUID(as_uuid=True), ForeignKey("regulations.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    applicable_asset_type = Column(String, nullable=True)
    required_evidence = Column(JSONB, nullable=True) # Array of required document types
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplianceAssessment(Base):
    __tablename__ = "compliance_assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    regulation_id = Column(UUID(as_uuid=True), ForeignKey("regulations.id"), index=True, nullable=False)
    
    score = Column(Float, nullable=False)
    risk_level = Column(Enum(RiskLevel), nullable=False)
    findings_summary = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplianceFinding(Base):
    __tablename__ = "compliance_findings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("compliance_assessments.id"), index=True, nullable=False)
    requirement_id = Column(UUID(as_uuid=True), ForeignKey("compliance_requirements.id"), nullable=False)
    
    issue = Column(String, nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    evidence_missing = Column(JSONB, nullable=True)
    recommendation = Column(String, nullable=True)
    status = Column(Enum(FindingStatus), default=FindingStatus.OPEN)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    factory_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    finding_id = Column(UUID(as_uuid=True), ForeignKey("compliance_findings.id"), index=True, nullable=False)
    
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(CorrectiveActionStatus), default=CorrectiveActionStatus.PENDING)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
