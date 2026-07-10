from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.compliance import Regulation, ComplianceRequirement
from app.repositories.compliance import compliance_repository

class RegulationService:
    
    async def create_regulation(self, db: AsyncSession, organization_id: UUID, data: dict) -> Regulation:
        reg = Regulation(
            organization_id=organization_id,
            name=data["name"],
            code=data["code"],
            authority=data["authority"],
            industry=data.get("industry"),
            description=data.get("description"),
            version=data.get("version")
        )
        # Assuming cascading is not strictly set up for simplicity, we add requirements separately or rely on DB flush.
        # In a real setup, we'd add the ComplianceRequirement objects to `reg.requirements`.
        return await compliance_repository.create_regulation(db, reg)
        
    async def list_regulations(self, db: AsyncSession):
        return await compliance_repository.get_all_regulations(db)

regulation_service = RegulationService()
