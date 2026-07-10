from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.repositories.analytics import analytics_repository

class KPIService:
    """
    Calculates top-level metrics across the platform.
    """
    
    async def get_global_kpis(self, db: AsyncSession, org_id: UUID) -> dict:
        total_machines = await analytics_repository.get_total_machines(db, org_id)
        active_alerts = await analytics_repository.get_active_alerts_count(db, org_id)
        
        # Mocking heavy aggregations for the demo architecture
        return {
            "total_organizations": 1,
            "total_factories": 2,
            "total_machines": total_machines,
            "global_health_score": 88.5,
            "active_alerts": active_alerts,
            "compliance_score": 92.0,
            "ai_usage_stats": {"conversations_today": 145, "predictions_made": 12},
            "estimated_cost_savings": 45000.0
        }
        
    async def get_factory_kpis(self, db: AsyncSession, factory_id: UUID) -> dict:
        return {
            "machine_status_counts": {"OPERATIONAL": 40, "MAINTENANCE": 3, "OFFLINE": 1},
            "compliance_score": 94.0,
            "energy_consumption_kwh": 12500.5
        }

kpi_service = KPIService()
