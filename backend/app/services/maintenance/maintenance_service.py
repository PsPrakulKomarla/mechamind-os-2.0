from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.maintenance import MaintenanceRecord
from app.repositories.maintenance import maintenance_repository

class MaintenanceService:
    
    async def log_maintenance(self, db: AsyncSession, organization_id: UUID, factory_id: UUID, user_id: UUID, data: dict) -> MaintenanceRecord:
        record = MaintenanceRecord(
            organization_id=organization_id,
            factory_id=factory_id,
            performed_by=user_id,
            machine_id=data["machine_id"],
            component_id=data.get("component_id"),
            maintenance_type=data["maintenance_type"],
            status=data["status"],
            description=data["description"],
            date=data["date"],
            duration_hours=data.get("duration_hours"),
            cost=data.get("cost"),
            remarks=data.get("remarks")
        )
        return await maintenance_repository.create_maintenance_record(db, record)

    async def get_machine_history(self, db: AsyncSession, machine_id: UUID):
        records = await maintenance_repository.get_history_by_machine(db, machine_id)
        stats = await maintenance_repository.calculate_mtbf_mttr(db, machine_id)
        return {
            "records": records,
            "statistics": stats
        }

maintenance_service = MaintenanceService()
