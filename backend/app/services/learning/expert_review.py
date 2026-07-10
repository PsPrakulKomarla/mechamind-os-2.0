from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.learning import SolutionProposal
from app.models.enums import SolutionStatus
from app.services.learning.solution_evaluation import solution_evaluation_engine
from app.services.learning.knowledge_versioning import knowledge_versioning_service

class ExpertReviewService:
    
    async def submit_proposal(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, user_id: UUID, data: dict) -> SolutionProposal:
        score = await solution_evaluation_engine.evaluate_proposal(db, data["problem_description"], data["suggested_solution"])
        
        proposal = SolutionProposal(
            organization_id=organization_id,
            factory_id=factory_id,
            submitted_by=user_id,
            problem_description=data["problem_description"],
            suggested_solution=data["suggested_solution"],
            affected_asset_id=data.get("affected_asset_id"),
            evidence=data.get("evidence"),
            confidence_score=score,
            status=SolutionStatus.UNDER_REVIEW
        )
        db.add(proposal)
        await db.commit()
        await db.refresh(proposal)
        return proposal

    async def review_proposal(self, db: AsyncSession, proposal_id: UUID, expert_id: UUID, status: SolutionStatus, reason: str) -> SolutionProposal:
        query = select(SolutionProposal).where(SolutionProposal.id == proposal_id)
        result = await db.execute(query)
        proposal = result.scalar_one_or_none()
        
        if not proposal:
            raise HTTPException(status_code=404, detail="Solution proposal not found")
            
        proposal.status = status
        await db.commit()
        
        if status == SolutionStatus.APPROVED:
            # Generate new knowledge vector with priority boost
            await knowledge_versioning_service.create_knowledge_version(db, expert_id, proposal, reason)
            
        return proposal

expert_review_service = ExpertReviewService()
