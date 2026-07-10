from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from datetime import datetime, timedelta

from app.models.maintenance import MaintenanceRecord, FailureEvent

class MaintenanceRepository:
    
    async def create_maintenance_record(self, db: AsyncSession, record: MaintenanceRecord) -> MaintenanceRecord:
        db.add(record)
        await db.commit()
        await db.refresh(record)
        return record

    async def get_history_by_machine(self, db: AsyncSession, machine_id: UUID, limit: int = 10):
        query = select(MaintenanceRecord).where(MaintenanceRecord.machine_id == machine_id).order_by(MaintenanceRecord.date.desc()).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create_failure_event(self, db: AsyncSession, event: FailureEvent) -> FailureEvent:
        db.add(event)
        await db.commit()
        await db.refresh(event)
        return event

    async def get_failures_by_machine(self, db: AsyncSession, machine_id: UUID, limit: int = 5):
        query = select(FailureEvent).where(FailureEvent.machine_id == machine_id).order_by(FailureEvent.detected_date.desc()).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def calculate_mtbf_mttr(self, db: AsyncSession, machine_id: UUID) -> dict:
        """
        Calculates Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR).
        Returns mock stats for the prototype if not enough data.
        """
        # In a real app we would do a complex SQL window function over the resolved_date and next detected_date.
        # For OS 2.0 Prototype, we simulate based on count.
        query = select(func.count(FailureEvent.id), func.sum(FailureEvent.cost_impact)).where(FailureEvent.machine_id == machine_id)
        result = await db.execute(query)
        count, total_cost = result.first()
        
        if count and count > 1:
            return {
                "mtbf_days": 120.5 / count, # Mock
                "mttr_hours": 4.2,
                "total_failures": count,
                "total_downtime_cost": total_cost or 0.0
            }
        return {
            "mtbf_days": 365.0, # Default assumption
            "mttr_hours": 0.0,
            "total_failures": count or 0,
            "total_downtime_cost": 0.0
        }

maintenance_repository = MaintenanceRepository()
