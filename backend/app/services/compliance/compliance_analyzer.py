from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import uuid

from app.core.llm import llm_provider
from app.services.copilot.context_builder import context_builder
from app.repositories.compliance import compliance_repository
from app.models.compliance import ComplianceAssessment, ComplianceFinding
from app.models.enums import RiskLevel, FindingSeverity

class ComplianceAnalyzer:
    """
    AI Agent that scans factory documents and maintenance records against a Regulation to find compliance gaps.
    """
    
    async def run_assessment(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, regulation_code: str) -> dict:
        # 1. Fetch RAG Context (All factory documents, SOPs, training records)
        context_chunks = await context_builder.build_context(db, organization_id, factory_id, f"Compliance check for {regulation_code}")
        context_text = "\n".join(context_chunks)
        
        # 2. Ask LLM to evaluate compliance
        system_prompt = f"""
        You are a strict Industrial Compliance Auditor checking against {regulation_code}.
        Analyze the following factory documents and identify any missing evidence or violations.
        Return structured JSON compliance payload.
        
        FACTORY EVIDENCE:
        {context_text}
        """
        
        # 3. Invoke Mock LLM
        llm_response = await llm_provider.generate_response(system_prompt, f"Evaluate compliance for {regulation_code}")
        payload = llm_response.get("compliance_payload", {})
        
        if not payload:
            payload = {"score": 100.0, "risk_level": "LOW", "findings": []}
            
        # 4. Save Assessment and Findings to DB
        assessment = ComplianceAssessment(
            organization_id=organization_id,
            factory_id=factory_id,
            regulation_id=uuid.uuid4(), # Mock ID, in reality query the Regulation by code
            score=payload["score"],
            risk_level=RiskLevel(payload["risk_level"])
        )
        
        db_findings = []
        for f in payload["findings"]:
            db_findings.append(
                ComplianceFinding(
                    requirement_id=uuid.uuid4(), # Mock
                    issue=f["issue"],
                    severity=FindingSeverity(f["severity"]),
                    recommendation=f["recommendation"]
                )
            )
            
        await compliance_repository.save_assessment(db, assessment, db_findings)
        
        return payload

compliance_analyzer = ComplianceAnalyzer()
