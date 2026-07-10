from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import Optional, List

from app.models.integration import IntegrationConnector, SynchronizationJob, SynchronizationLog, WebhookEndpoint

class IntegrationRepository:
    
    async def create_connector(self, db: AsyncSession, connector: IntegrationConnector) -> IntegrationConnector:
        db.add(connector)
        await db.commit()
        await db.refresh(connector)
        return connector
        
    async def get_connector(self, db: AsyncSession, connector_id: UUID) -> Optional[IntegrationConnector]:
        return await db.get(IntegrationConnector, connector_id)
        
    async def update_connector_status(self, db: AsyncSession, connector: IntegrationConnector) -> IntegrationConnector:
        db.add(connector)
        await db.commit()
        await db.refresh(connector)
        return connector
        
    async def create_sync_log(self, db: AsyncSession, log: SynchronizationLog) -> SynchronizationLog:
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log
        
    async def get_sync_logs(self, db: AsyncSession, connector_id: UUID) -> List[SynchronizationLog]:
        query = select(SynchronizationLog).where(SynchronizationLog.connector_id == connector_id).order_by(SynchronizationLog.started_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

integration_repository = IntegrationRepository()
