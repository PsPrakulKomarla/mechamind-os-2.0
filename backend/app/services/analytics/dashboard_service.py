from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.services.analytics.kpi_service import kpi_service
from app.schemas.analytics import ExecutiveDashboardResponse, FactoryDashboardResponse, TechnicianDashboardResponse, StartupDashboardResponse

class DashboardService:
    
    async def get_executive_dashboard(self, db: AsyncSession, org_id: UUID) -> ExecutiveDashboardResponse:
        kpis = await kpi_service.get_global_kpis(db, org_id)
        return ExecutiveDashboardResponse(**kpis)
        
    async def get_factory_dashboard(self, db: AsyncSession, factory_id: UUID) -> FactoryDashboardResponse:
        kpis = await kpi_service.get_factory_kpis(db, factory_id)
        
        return FactoryDashboardResponse(
            factory_id=factory_id,
            name="Texas Assembly Plant", # Mocked
            machine_status_counts=kpis["machine_status_counts"],
            open_alerts=14,
            recent_failures=[{"machine": "P-101", "issue": "Bearing seized"}],
            compliance_score=kpis["compliance_score"],
            energy_consumption_kwh=kpis["energy_consumption_kwh"],
            risk_heatmap=[{"asset_tag": "P-101", "risk": "CRITICAL"}]
        )
        
    async def get_technician_dashboard(self, db: AsyncSession, user_id: UUID) -> TechnicianDashboardResponse:
        return TechnicianDashboardResponse(
            user_id=user_id,
            assigned_work_orders=5,
            today_inspections=2,
            recent_ai_conversations=8,
            safety_alerts=1
        )
        
    async def get_startup_dashboard(self, db: AsyncSession, org_id: UUID) -> StartupDashboardResponse:
        # Immediate alert screen upon login
        return StartupDashboardResponse(
            most_repeated_issues=[{"issue": "Vibration Spike", "count": 12}],
            critical_unresolved_issues=[{"id": "alert-1", "message": "P-101 Bearing Overheat"}],
            machines_requiring_attention=[{"name": "P-101", "rul_hours": 60}],
            high_risk_predictions=[{"machine": "M-202", "prediction": "Motor Failure", "probability": 0.89}]
        )

dashboard_service = DashboardService()
