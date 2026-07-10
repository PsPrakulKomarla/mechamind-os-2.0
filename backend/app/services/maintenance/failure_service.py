from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.maintenance import FailureEvent
from app.repositories.maintenance import maintenance_repository

class FailureService:
    
    async def report_failure(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, data: dict) -> FailureEvent:
        event = FailureEvent(
            organization_id=organization_id,
            factory_id=factory_id,
            machine_id=data["machine_id"],
            component_id=data.get("component_id"),
            failure_type=data["failure_type"],
            severity=data["severity"],
            description=data["description"],
            detected_date=data["detected_date"]
        )
        return await maintenance_repository.create_failure_event(db, event)

failure_service = FailureService()
