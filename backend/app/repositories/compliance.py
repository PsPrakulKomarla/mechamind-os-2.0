from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.compliance import Regulation, ComplianceRequirement, ComplianceAssessment, ComplianceFinding

class ComplianceRepository:
    
    async def create_regulation(self, db: AsyncSession, regulation: Regulation) -> Regulation:
        db.add(regulation)
        await db.commit()
        await db.refresh(regulation)
        return regulation
        
    async def get_all_regulations(self, db: AsyncSession):
        query = select(Regulation)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def save_assessment(self, db: AsyncSession, assessment: ComplianceAssessment, findings: list[ComplianceFinding]) -> ComplianceAssessment:
        db.add(assessment)
        await db.flush() # Get ID
        
        for f in findings:
            f.assessment_id = assessment.id
            db.add(f)
            
        await db.commit()
        await db.refresh(assessment)
        return assessment

compliance_repository = ComplianceRepository()
