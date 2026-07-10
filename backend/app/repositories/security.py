from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.models.security import SecurityEventLog

class SecurityRepository:
    
    async def create_event_log(self, db: AsyncSession, log: SecurityEventLog) -> SecurityEventLog:
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log
        
    async def get_logs_by_org(self, db: AsyncSession, organization_id: UUID, limit: int = 100) -> List[SecurityEventLog]:
        query = select(SecurityEventLog).where(
            SecurityEventLog.organization_id == organization_id
        ).order_by(SecurityEventLog.created_at.desc()).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

security_repository = SecurityRepository()
