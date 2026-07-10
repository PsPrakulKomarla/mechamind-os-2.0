from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID

from app.models.analytics import UserActivityLog, FactoryTimelineEvent, GeneratedReport
from app.models.machine import Machine
from app.models.iot import MachineAlert
from app.models.prediction import FailurePrediction

class AnalyticsRepository:
    
    async def log_activity(self, db: AsyncSession, log: UserActivityLog) -> UserActivityLog:
        db.add(log)
        await db.commit()
        return log
        
    async def log_factory_event(self, db: AsyncSession, event: FactoryTimelineEvent) -> FactoryTimelineEvent:
        db.add(event)
        await db.commit()
        return event
        
    async def get_total_machines(self, db: AsyncSession, org_id: UUID) -> int:
        query = select(func.count(Machine.id)).where(Machine.organization_id == org_id)
        result = await db.execute(query)
        return result.scalar() or 0
        
    async def get_active_alerts_count(self, db: AsyncSession, org_id: UUID) -> int:
        # Mocking join for demo
        query = select(func.count(MachineAlert.id)).where(MachineAlert.status == "OPEN")
        result = await db.execute(query)
        return result.scalar() or 0

analytics_repository = AnalyticsRepository()
